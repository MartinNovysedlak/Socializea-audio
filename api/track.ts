import { createClient } from '@supabase/supabase-js';

type Req = {
  method?: string;
  body?: unknown;
};
type Res = {
  status: (code: number) => { end: () => void; json: (body: Record<string, unknown>) => void };
};

const ANALYTICS_EVENT_TYPES = ['pageview', 'click', 'scroll_depth', 'time_on_page'] as const;
type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

type AnalyticsEventPayload = {
  session_id: string;
  page_url: string;
  event_type: AnalyticsEventType;
  x?: number | null;
  y?: number | null;
  element_selector?: string | null;
  viewport_width?: number | null;
  viewport_height?: number | null;
  duration_ms?: number | null;
  scroll_percent?: number | null;
  referrer?: string | null;
};

const MAX_BATCH = 40;
const SESSION_MAX = 80;
const URL_MAX = 500;
const SELECTOR_MAX = 300;
const REF_MAX = 500;

function isEventType(value: unknown): value is AnalyticsEventType {
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

function normalizePageUrl(value: unknown): string | null {
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

function sanitizeEvent(raw: unknown): AnalyticsEventPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const session_id = clip(row.session_id, SESSION_MAX);
  const page_url = normalizePageUrl(row.page_url);
  if (!session_id || !page_url || !isEventType(row.event_type)) return null;

  return {
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
}

function sanitizeBatch(raw: unknown): AnalyticsEventPayload[] {
  if (!Array.isArray(raw)) return [];
  const out: AnalyticsEventPayload[] = [];
  for (const item of raw.slice(0, MAX_BATCH)) {
    const event = sanitizeEvent(item);
    if (event) out.push(event);
  }
  return out;
}

function supabaseClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT'
  );
}

function parseBody(body: unknown): unknown {
  if (body == null) return null;
  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    return parseBody(body.toString('utf8'));
  }
  if (body instanceof Uint8Array) {
    return parseBody(new TextDecoder().decode(body));
  }
  return body;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const parsed = parseBody(req.body);
    const events = sanitizeBatch(
      parsed && typeof parsed === 'object' && parsed !== null && 'events' in parsed
        ? (parsed as { events: unknown }).events
        : parsed
    );

    if (events.length === 0) {
      return res.status(204).end();
    }

    const { error } = await supabaseClient().from('analytics_events').insert(events);
    if (error) {
      console.error('analytics insert failed:', error.message);
      return res.status(500).json({ ok: false });
    }

    return res.status(204).end();
  } catch (err) {
    console.error('analytics track failed:', err instanceof Error ? err.message : err);
    return res.status(500).json({ ok: false });
  }
}
