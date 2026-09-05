import { createClient } from '@supabase/supabase-js';
import { sanitizeBatch } from './_lib/analyticsSanitize';

type Req = {
  method?: string;
  body?: unknown;
};
type Res = {
  status: (code: number) => { end: () => void; json: (body: Record<string, unknown>) => void };
};

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
