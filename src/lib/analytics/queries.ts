import { supabase } from '@/lib/supabase';
import type { AnalyticsDailyRow, AnalyticsEventRow } from './types';

const PAGE = 1000;
const CAP = 15000;

async function fetchPaged<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const all: T[] = [];
  for (let from = 0; from < CAP; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) {
      console.error('Analytics query error:', error.message);
      break;
    }
    const rows = data || [];
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
}

export async function fetchEventsSince(isoFrom: string, eventType?: AnalyticsEventRow['event_type']): Promise<AnalyticsEventRow[]> {
  return fetchPaged<AnalyticsEventRow>((from, to) => {
    let q = supabase
      .from('analytics_events')
      .select(
        'id, session_id, page_url, event_type, x, y, element_selector, viewport_width, viewport_height, duration_ms, scroll_percent, referrer, created_at'
      )
      .gte('created_at', isoFrom)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (eventType) q = q.eq('event_type', eventType);
    return q;
  });
}

export async function fetchDailySince(isoDay: string): Promise<AnalyticsDailyRow[]> {
  const { data, error } = await supabase
    .from('analytics_daily')
    .select('day, page_url, pageviews, unique_sessions, avg_duration_ms, click_count')
    .gte('day', isoDay)
    .order('day', { ascending: true });

  if (error) {
    console.error('Analytics daily query error:', error.message);
    return [];
  }
  return data || [];
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

export function daysAgoDay(days: number): string {
  return daysAgoIso(days).slice(0, 10);
}
