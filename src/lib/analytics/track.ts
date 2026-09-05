import { getCookieConsent } from '@/lib/cookieConsent';
import type { AnalyticsEventPayload, AnalyticsEventType } from './types';

const SESSION_KEY = 'sa_analytics_session';
const SESSION_TS_KEY = 'sa_analytics_session_at';
const IDLE_MS = 30 * 60 * 1000;
const FLUSH_MS = 4000;
const MAX_QUEUE = 40;

let queue: AnalyticsEventPayload[] = [];
let flushTimer: number | null = null;
let started = false;
let pageEnteredAt = Date.now();
let maxScroll = 0;
let currentPath = '/';
let cleanupFns: Array<() => void> = [];

function isAdminSession(): boolean {
  try {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  } catch {
    return false;
  }
}

function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.analytics === true;
}

function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true;
  if (isAdminSession()) return true;
  if (window.location.pathname.startsWith('/admin')) return true;
  if (!hasAnalyticsConsent()) return true;
  return false;
}

function touchSessionId(): string {
  const now = Date.now();
  let id = localStorage.getItem(SESSION_KEY);
  const last = Number(localStorage.getItem(SESSION_TS_KEY) || '0');
  if (!id || now - last > IDLE_MS) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  localStorage.setItem(SESSION_TS_KEY, String(now));
  return id;
}

function pageUrl(): string {
  return `${window.location.pathname}${window.location.search}` || '/';
}

function enqueue(partial: Omit<AnalyticsEventPayload, 'session_id' | 'page_url' | 'event_type'> & {
  event_type: AnalyticsEventType;
  page_url?: string;
}) {
  if (shouldSkip()) return;
  const event: AnalyticsEventPayload = {
    session_id: touchSessionId(),
    page_url: partial.page_url ?? pageUrl(),
    event_type: partial.event_type,
    x: partial.x ?? null,
    y: partial.y ?? null,
    element_selector: partial.element_selector ?? null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    duration_ms: partial.duration_ms ?? null,
    scroll_percent: partial.scroll_percent ?? null,
    referrer: document.referrer || null,
  };
  queue.push(event);
  if (queue.length >= MAX_QUEUE) flush();
}

function flush() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, MAX_QUEUE);
  const body = JSON.stringify({ events: batch });

  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).then((res) => {
    if (!res.ok) throw new Error('track endpoint unavailable');
  }).catch(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      void supabase.from('analytics_events').insert(batch);
    });
  });
}

function currentScrollPercent(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
}

function selectorFor(el: Element): string {
  const withId = el.closest('[id]');
  if (withId instanceof HTMLElement && withId.id) return `#${withId.id}`;
  const tag = el.tagName.toLowerCase();
  const cls = Array.from(el.classList).slice(0, 2).join('.');
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const parts = [tag];
  if (cls) parts.push(`.${cls}`);
  if (text) parts.push(`[${text}]`);
  return parts.join('').slice(0, 300);
}

function sendPageLeave(path: string) {
  const duration = Math.max(0, Date.now() - pageEnteredAt);
  enqueue({ event_type: 'time_on_page', page_url: path, duration_ms: duration });
  enqueue({ event_type: 'scroll_depth', page_url: path, scroll_percent: maxScroll });
}

function onClick(e: MouseEvent) {
  if (shouldSkip()) return;
  const target = e.target;
  if (!(target instanceof Element)) return;
  const docH = Math.max(document.documentElement.scrollHeight, 1);
  const x = Math.min(100, Math.max(0, Math.round((e.clientX / Math.max(window.innerWidth, 1)) * 100)));
  const y = Math.min(100, Math.max(0, Math.round((e.pageY / docH) * 100)));
  enqueue({
    event_type: 'click',
    x,
    y,
    element_selector: selectorFor(target),
  });
}

function onScroll() {
  if (shouldSkip()) return;
  maxScroll = Math.max(maxScroll, currentScrollPercent());
}

let lastPageviewAt = 0;
let lastPageviewPath = '';

export function trackPageview(path?: string) {
  if (shouldSkip()) return;
  const next = path ?? pageUrl();
  const now = Date.now();
  if (next === lastPageviewPath && now - lastPageviewAt < 400) return;
  lastPageviewPath = next;
  lastPageviewAt = now;
  if (currentPath && currentPath !== next && started) {
    sendPageLeave(currentPath);
  }
  currentPath = next;
  pageEnteredAt = now;
  maxScroll = currentScrollPercent();
  enqueue({ event_type: 'pageview', page_url: next });
  flush();
}

export function initAnalytics(): () => void {
  if (started || typeof window === 'undefined') return () => undefined;
  started = true;
  currentPath = pageUrl();
  pageEnteredAt = Date.now();
  maxScroll = 0;

  const onConsent = () => {
    if (hasAnalyticsConsent() && !shouldSkip()) {
      trackPageview(pageUrl());
    }
  };

  document.addEventListener('click', onClick, true);

  let scrollTick = false;
  const scrollListener = () => {
    if (scrollTick) return;
    scrollTick = true;
    window.setTimeout(() => {
      scrollTick = false;
      onScroll();
    }, 500);
  };
  window.addEventListener('scroll', scrollListener, { passive: true });

  const onHide = () => {
    sendPageLeave(currentPath);
    flush();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') onHide();
  });
  window.addEventListener('pagehide', onHide);

  window.addEventListener('cookie-consent-updated', onConsent);

  flushTimer = window.setInterval(() => flush(), FLUSH_MS);

  cleanupFns = [
    () => document.removeEventListener('click', onClick, true),
    () => window.removeEventListener('scroll', scrollListener),
    () => window.removeEventListener('pagehide', onHide),
    () => window.removeEventListener('cookie-consent-updated', onConsent),
    () => {
      if (flushTimer != null) window.clearInterval(flushTimer);
    },
  ];

  return () => {
    sendPageLeave(currentPath);
    flush();
    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];
    started = false;
  };
}
