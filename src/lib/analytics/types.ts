export const ANALYTICS_EVENT_TYPES = ['pageview', 'click', 'scroll_depth', 'time_on_page'] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export type AnalyticsEventPayload = {
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

export type AnalyticsDailyRow = {
  day: string;
  page_url: string;
  pageviews: number;
  unique_sessions: number;
  avg_duration_ms: number;
  click_count: number;
};

export type AnalyticsEventRow = AnalyticsEventPayload & {
  id: string;
  created_at: string;
};
