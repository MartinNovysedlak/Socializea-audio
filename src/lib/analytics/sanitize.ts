import type { AnalyticsEventPayload } from './types';
import { ANALYTICS_EVENT_TYPES } from './types';

const MAX_BATCH = 40;
const SESSION_MAX = 80;
const URL_MAX = 500;
const SELECTOR_MAX = 300;
const REF_MAX = 500;

function isEventType(value: unknown): value is AnalyticsEventPayload['event_type'] {
  return typeof value === 'string' && (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value);
}

function clip(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function intInRange(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const n = Math.round(value);
  if (n < min || n > max) return null;
  return n;
}

/** page_url must be a site path, never an absolute foreign URL */
export function normalizePageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  let path = value.trim();
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const u = new URL(path);
      path = `${u.pathname}${u.search}`;
    }
  } catch {
    return null;
  }
  if (!path.startsWith('/')) return null;
  if (path.startsWith('//')) return null;
  if (path.length > URL_MAX) path = path.slice(0, URL_MAX);
  return path;
}

export function sanitizeEvent(raw: unknown): AnalyticsEventPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const session_id = clip(row.session_id, SESSION_MAX);
  const page_url = normalizePageUrl(row.page_url);
  if (!session_id || !page_url || !isEventType(row.event_type)) return null;

  const event: AnalyticsEventPayload = {
    session_id,
    page_url,
    event_type: row.event_type,
    x: intInRange(row.x, 0, 100),
    y: intInRange(row.y, 0, 100),
    element_selector: clip(row.element_selector, SELECTOR_MAX),
    viewport_width: intInRange(row.viewport_width, 1, 10000),
    viewport_height: intInRange(row.viewport_height, 1, 10000),
    duration_ms: intInRange(row.duration_ms, 0, 86_400_000),
    scroll_percent: intInRange(row.scroll_percent, 0, 100),
    referrer: clip(row.referrer, REF_MAX),
  };

  return event;
}

export function sanitizeBatch(raw: unknown): AnalyticsEventPayload[] {
  if (!Array.isArray(raw)) return [];
  const out: AnalyticsEventPayload[] = [];
  for (const item of raw.slice(0, MAX_BATCH)) {
    const event = sanitizeEvent(item);
    if (event) out.push(event);
  }
  return out;
}
