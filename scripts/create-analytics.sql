create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  page_url text not null,
  event_type text not null,
  x integer,
  y integer,
  element_selector text,
  viewport_width integer,
  viewport_height integer,
  duration_ms integer,
  scroll_percent integer,
  referrer text,
  created_at timestamptz not null default now(),
  constraint analytics_events_type_chk check (event_type in ('pageview', 'click', 'scroll_depth', 'time_on_page')),
  constraint analytics_events_session_len check (char_length(session_id) between 1 and 80),
  constraint analytics_events_url_len check (char_length(page_url) between 1 and 500),
  constraint analytics_events_sel_len check (element_selector is null or char_length(element_selector) <= 300),
  constraint analytics_events_ref_len check (referrer is null or char_length(referrer) <= 500),
  constraint analytics_events_xy_chk check (
    (x is null and y is null) or (x between 0 and 100 and y between 0 and 100)
  ),
  constraint analytics_events_scroll_chk check (scroll_percent is null or scroll_percent between 0 and 100)
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_page_type_idx on public.analytics_events (page_url, event_type);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);

create table if not exists public.analytics_daily (
  day date not null,
  page_url text not null,
  pageviews integer not null default 0,
  unique_sessions integer not null default 0,
  avg_duration_ms integer not null default 0,
  click_count integer not null default 0,
  primary key (day, page_url)
);

alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;

drop policy if exists "Allow public select" on public.analytics_events;
drop policy if exists "Allow public insert" on public.analytics_events;
drop policy if exists "Allow public delete" on public.analytics_events;
drop policy if exists "Allow all for anon" on public.analytics_events;
drop policy if exists "Allow public select" on public.analytics_daily;
drop policy if exists "Allow public insert" on public.analytics_daily;
drop policy if exists "Allow public update" on public.analytics_daily;
drop policy if exists "Allow all for anon" on public.analytics_daily;

create policy "Allow public select" on public.analytics_events for select to public using (true);
create policy "Allow public insert" on public.analytics_events for insert to public with check (true);
create policy "Allow public delete" on public.analytics_events for delete to public using (true);
create policy "Allow all for anon" on public.analytics_events for all to anon using (true) with check (true);

create policy "Allow public select" on public.analytics_daily for select to public using (true);
create policy "Allow public insert" on public.analytics_daily for insert to public with check (true);
create policy "Allow public update" on public.analytics_daily for update to public using (true) with check (true);
create policy "Allow all for anon" on public.analytics_daily for all to anon using (true) with check (true);

grant select, insert, update, delete on public.analytics_events to anon, authenticated;
grant select, insert, update, delete on public.analytics_daily to anon, authenticated;
