import { createClient } from '@supabase/supabase-js';

type Req = { method?: string };
type Res = {
  status: (code: number) => { json: (body: Record<string, unknown>) => void };
};

type EventRow = {
  event_type: string;
  session_id: string;
  page_url: string;
  duration_ms: number | null;
  created_at: string;
};

function supabaseClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT'
  );
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const supabase = supabaseClient();
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const day = isoDay(yesterday);
  const dayStart = `${day}T00:00:00.000Z`;
  const dayEnd = `${day}T23:59:59.999Z`;

  const { data: events, error: fetchError } = await supabase
    .from('analytics_events')
    .select('event_type, session_id, page_url, duration_ms, created_at')
    .gte('created_at', dayStart)
    .lte('created_at', dayEnd)
    .limit(20000);

  if (fetchError) {
    return res.status(500).json({ status: 'error', message: fetchError.message });
  }

  const byPage = new Map<
    string,
    { sessions: Set<string>; pageviews: number; durations: number[]; clicks: number }
  >();

  for (const row of (events || []) as EventRow[]) {
    const bucket = byPage.get(row.page_url) ?? {
      sessions: new Set<string>(),
      pageviews: 0,
      durations: [],
      clicks: 0,
    };
    bucket.sessions.add(row.session_id);
    if (row.event_type === 'pageview') bucket.pageviews += 1;
    if (row.event_type === 'click') bucket.clicks += 1;
    if (row.event_type === 'time_on_page' && typeof row.duration_ms === 'number') {
      bucket.durations.push(row.duration_ms);
    }
    byPage.set(row.page_url, bucket);
  }

  const dailyRows = [...byPage.entries()].map(([page_url, b]) => ({
    day,
    page_url,
    pageviews: b.pageviews,
    unique_sessions: b.sessions.size,
    avg_duration_ms:
      b.durations.length > 0
        ? Math.round(b.durations.reduce((a, n) => a + n, 0) / b.durations.length)
        : 0,
    click_count: b.clicks,
  }));

  if (dailyRows.length > 0) {
    const { error: upsertError } = await supabase.from('analytics_daily').upsert(dailyRows, {
      onConflict: 'day,page_url',
    });
    if (upsertError) {
      return res.status(500).json({ status: 'error', message: upsertError.message });
    }
  }

  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 90);
  const cutoffIso = cutoff.toISOString();

  const { error: clickDelError } = await supabase
    .from('analytics_events')
    .delete()
    .in('event_type', ['click', 'scroll_depth'])
    .lt('created_at', cutoffIso);

  if (clickDelError) {
    return res.status(500).json({ status: 'error', message: clickDelError.message });
  }

  const { error: pvDelError } = await supabase
    .from('analytics_events')
    .delete()
    .in('event_type', ['pageview', 'time_on_page'])
    .lt('created_at', cutoffIso);

  if (pvDelError) {
    return res.status(500).json({ status: 'error', message: pvDelError.message });
  }

  return res.status(200).json({
    status: 'ok',
    day,
    aggregated_pages: dailyRows.length,
    timestamp: new Date().toISOString(),
  });
}
