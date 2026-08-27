import { createClient } from '@supabase/supabase-js';
import { sanitizeBatch } from '../src/lib/analytics/sanitize';

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
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

export default async function handler(req: Req, res: Res) {
  try {
    if (req.method !== 'POST') {
      return res.status(204).end();
    }

    const parsed = parseBody(req.body);
    const events = sanitizeBatch(
      parsed && typeof parsed === 'object' && parsed !== null && 'events' in parsed
        ? (parsed as { events: unknown }).events
        : parsed
    );

    if (events.length > 0) {
      await supabaseClient().from('analytics_events').insert(events);
    }
  } catch {
    // tracking must never block UX
  }

  return res.status(204).end();
}
