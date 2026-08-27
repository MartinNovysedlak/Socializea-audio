"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  Clock,
  Eye,
  LayoutDashboard,
  Monitor,
  MousePointerClick,
  Smartphone,
  TrendingDown,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { daysAgoDay, daysAgoIso, fetchDailySince, fetchEventsSince } from '@/lib/analytics/queries';
import { drawHeatmap } from '@/lib/analytics/heatDraw';
import { pageLabel, SITE_PAGES } from '@/lib/analytics/pages';
import type { AnalyticsDailyRow, AnalyticsEventRow } from '@/lib/analytics/types';

type RangeKey = 'week' | 'month' | 'year';

const RANGE: Record<RangeKey, { days: number; label: string }> = {
  week: { days: 7, label: 'Týždeň' },
  month: { days: 30, label: 'Mesiac' },
  year: { days: 365, label: 'Rok' },
};

function formatDuration(ms: number): string {
  if (ms <= 0) return '0 s';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m} min ${rem} s`;
}

function isAdmin(): boolean {
  try {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  } catch {
    return false;
  }
}

function deviceBucket(width: number | null | undefined): 'mobile' | 'tablet' | 'desktop' {
  if (!width) return 'desktop';
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function hostFromReferrer(ref: string | null | undefined): string {
  if (!ref) return 'Priame / neznáme';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (host.includes('socializea-audio')) return 'Interné';
    return host || 'Priame / neznáme';
  } catch {
    return 'Priame / neznáme';
  }
}

const AdminAnalytics = () => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('month');
  const [events, setEvents] = useState<AnalyticsEventRow[]>([]);
  const [daily, setDaily] = useState<AnalyticsDailyRow[]>([]);
  const [selectedPage, setSelectedPage] = useState('/');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameHeight, setFrameHeight] = useState(900);

  useEffect(() => {
    setAllowed(isAdmin());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [raw, sums] = await Promise.all([
      fetchEventsSince(daysAgoIso(365)),
      fetchDailySince(daysAgoDay(365)),
    ]);
    setEvents(raw);
    setDaily(sums);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (allowed) void load();
  }, [allowed, load]);

  const ranged = useMemo(() => {
    const cutoff = Date.now() - RANGE[range].days * 86400000;
    return events.filter((e) => new Date(e.created_at).getTime() >= cutoff);
  }, [events, range]);

  const pageviews = useMemo(() => ranged.filter((e) => e.event_type === 'pageview'), [ranged]);
  const clicks = useMemo(() => ranged.filter((e) => e.event_type === 'click'), [ranged]);
  const times = useMemo(() => ranged.filter((e) => e.event_type === 'time_on_page'), [ranged]);
  const scrolls = useMemo(() => ranged.filter((e) => e.event_type === 'scroll_depth'), [ranged]);

  const stats = useMemo(() => {
    const sessions = new Set(pageviews.map((e) => e.session_id));
    const viewsPerSession = new Map<string, number>();
    for (const e of pageviews) {
      viewsPerSession.set(e.session_id, (viewsPerSession.get(e.session_id) || 0) + 1);
    }
    let bounces = 0;
    for (const n of viewsPerSession.values()) if (n <= 1) bounces += 1;
    const avgTime =
      times.length > 0 ? times.reduce((acc, e) => acc + (e.duration_ms || 0), 0) / times.length : 0;
    const counts = new Map<string, number>();
    for (const e of pageviews) counts.set(e.page_url, (counts.get(e.page_url) || 0) + 1);
    let topPage = '—';
    let topCount = 0;
    for (const [url, n] of counts) {
      if (n > topCount) {
        topPage = url;
        topCount = n;
      }
    }
    const devices = { mobile: 0, tablet: 0, desktop: 0 };
    const seen = new Set<string>();
    for (const e of pageviews) {
      if (seen.has(e.session_id)) continue;
      seen.add(e.session_id);
      devices[deviceBucket(e.viewport_width)] += 1;
    }
    const sess = sessions.size;
    const pct = (n: number) => (sess > 0 ? Math.round((n / sess) * 100) : 0);
    return {
      sessions: sess,
      pageviews: pageviews.length,
      clicks: clicks.length,
      avgTime,
      bounce: sess > 0 ? Math.round((bounces / sess) * 100) : 0,
      pagesPerSession: sess > 0 ? Math.round((pageviews.length / sess) * 10) / 10 : 0,
      topPage: pageLabel(topPage),
      topCount,
      devices,
      mobilePct: pct(devices.mobile),
      tabletPct: pct(devices.tablet),
      desktopPct: pct(devices.desktop),
    };
  }, [pageviews, times, clicks]);

  const referrers = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of pageviews) {
      const host = hostFromReferrer(e.referrer);
      map.set(host, (map.get(host) || 0) + 1);
    }
    return [...map.entries()]
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [pageviews]);

  const pages = useMemo(() => {
    const extra = [...new Set(events.map((e) => e.page_url))].filter(
      (p) => !SITE_PAGES.some((s) => s.path === p)
    );
    extra.sort();
    return [...SITE_PAGES.map((p) => p.path), ...extra];
  }, [events]);

  const pageBreakdown = useMemo(() => {
    const map = new Map<string, { views: number; clicks: number; sessions: Set<string> }>();
    for (const path of pages) {
      map.set(path, { views: 0, clicks: 0, sessions: new Set() });
    }
    for (const e of pageviews) {
      const row = map.get(e.page_url) ?? { views: 0, clicks: 0, sessions: new Set<string>() };
      row.views += 1;
      row.sessions.add(e.session_id);
      map.set(e.page_url, row);
    }
    for (const e of clicks) {
      const row = map.get(e.page_url) ?? { views: 0, clicks: 0, sessions: new Set<string>() };
      row.clicks += 1;
      map.set(e.page_url, row);
    }
    return [...map.entries()]
      .map(([path, row]) => ({
        path,
        label: pageLabel(path),
        views: row.views,
        clicks: row.clicks,
        sessions: row.sessions.size,
      }))
      .sort((a, b) => b.views - a.views);
  }, [pages, pageviews, clicks]);

  const heatPoints = useMemo(
    () =>
      clicks
        .filter((e) => e.page_url === selectedPage && e.x != null && e.y != null)
        .map((e) => ({ x: e.x as number, y: e.y as number })),
    [clicks, selectedPage]
  );

  const topElements = useMemo(() => {
    const map = new Map<string, { selector: string; page: string; count: number }>();
    for (const e of clicks) {
      const selector = e.element_selector || '(neznámy prvok)';
      const key = `${e.page_url}::${selector}`;
      const prev = map.get(key);
      if (prev) prev.count += 1;
      else map.set(key, { selector, page: e.page_url, count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 20);
  }, [clicks]);

  const visitsChart = useMemo(() => {
    const dailyTotals = new Map<string, number>();
    for (const row of daily) {
      dailyTotals.set(row.day, (dailyTotals.get(row.day) || 0) + row.pageviews);
    }

    if (range === 'year') {
      const byMonth = new Map<string, number>();
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        byMonth.set(key, 0);
      }
      for (const e of pageviews) {
        const key = e.created_at.slice(0, 7);
        if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) || 0) + 1);
      }
      const dailyByMonth = new Map<string, number>();
      for (const [day, n] of dailyTotals) {
        const key = day.slice(0, 7);
        dailyByMonth.set(key, (dailyByMonth.get(key) || 0) + n);
      }
      for (const [key, n] of byMonth) {
        if (n === 0) byMonth.set(key, dailyByMonth.get(key) || 0);
      }
      return [...byMonth.entries()].map(([day, pageviewsCount]) => ({ day, pageviews: pageviewsCount }));
    }

    const byDay = new Map<string, number>();
    for (let i = RANGE[range].days - 1; i >= 0; i--) {
      byDay.set(daysAgoDay(i), 0);
    }
    for (const e of pageviews) {
      const day = e.created_at.slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) || 0) + 1);
    }
    for (const [day, n] of byDay) {
      if (n === 0) byDay.set(day, dailyTotals.get(day) || 0);
    }
    return [...byDay.entries()].map(([day, pageviewsCount]) => ({
      day: day.slice(5),
      pageviews: pageviewsCount,
    }));
  }, [daily, pageviews, range]);

  const timeByPage = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const e of times) {
      const list = map.get(e.page_url) || [];
      list.push(e.duration_ms || 0);
      map.set(e.page_url, list);
    }
    return [...map.entries()]
      .map(([page, list]) => ({
        page: pageLabel(page),
        seconds: Math.round(list.reduce((a, n) => a + n, 0) / list.length / 1000),
      }))
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 8);
  }, [times]);

  const scrollDepth = useMemo(() => {
    const pageScrolls = scrolls.filter((e) => e.page_url === selectedPage);
    const sessions = new Map<string, number>();
    for (const e of pageScrolls) {
      sessions.set(e.session_id, Math.max(sessions.get(e.session_id) || 0, e.scroll_percent || 0));
    }
    const reached = (n: number) => {
      if (sessions.size === 0) return 0;
      let c = 0;
      for (const v of sessions.values()) if (v >= n) c += 1;
      return Math.round((c / sessions.size) * 100);
    };
    return { p25: reached(25), p50: reached(50), p75: reached(75), p100: reached(100) };
  }, [scrolls, selectedPage]);

  const paintHeat = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.parentElement?.clientWidth || 800;
    canvas.width = w;
    canvas.height = frameHeight;
    drawHeatmap(canvas, heatPoints);
  }, [heatPoints, frameHeight]);

  useEffect(() => {
    paintHeat();
  }, [paintHeat]);

  const onFrameLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    const h = Math.max(doc?.documentElement.scrollHeight || 0, 700);
    setFrameHeight(Math.min(h, 4000));
  };

  if (allowed === false) return <Navigate to="/admin" replace />;
  if (allowed === null) return null;

  const metricCards = [
    { label: 'Sessiony', value: String(stats.sessions), icon: Users },
    { label: 'Zobrazenia stránok', value: String(stats.pageviews), icon: Eye },
    { label: 'Priemerný čas', value: formatDuration(stats.avgTime), icon: Clock },
    { label: 'Miera odchodu', value: `${stats.bounce} %`, icon: TrendingDown },
    { label: 'Stránky / session', value: String(stats.pagesPerSession), icon: LayoutDashboard },
    { label: 'Kliky', value: String(stats.clicks), icon: MousePointerClick },
    {
      label: 'Zariadenia',
      value: `M ${stats.mobilePct}% · T ${stats.tabletPct}% · D ${stats.desktopPct}%`,
      icon: Smartphone,
    },
    { label: 'Top stránka', value: `${stats.topPage} (${stats.topCount})`, icon: Monitor },
  ];

  return (
    <>
      <Helmet>
        <title>Analytika | Socializea Audio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-[#020721] flex flex-col">
        <Navbar />
        <div className="flex-1 pt-40 pb-24 container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#020721]/60 border border-white/10 p-6 rounded-3xl">
              <div>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="text-[#BD20D3]" size={28} />
                  <h1 className="text-3xl font-extrabold text-white">Analytika</h1>
                </div>
                <p className="text-gray-400 mt-1 text-sm">Vlastné meranie návštev — bez IP a bez fingerprintu.</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex rounded-xl border border-white/15 p-1 bg-black/30">
                  {(Object.keys(RANGE) as RangeKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRange(key)}
                      className={`h-10 px-4 rounded-lg text-sm font-semibold transition-colors ${
                        range === key ? 'bg-[#BD20D3] text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {RANGE[key].label}
                    </button>
                  ))}
                </div>
                <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5 rounded-xl h-11">
                  <Link to="/admin">
                    <ArrowLeft size={16} className="mr-2" />
                    Späť do adminu
                  </Link>
                </Button>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400 text-center py-16">Načítavam dáta…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {metricCards.map((card) => (
                    <Card key={card.label} className="bg-[#020721]/60 border-white/10 rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 flex items-center gap-2">
                          <card.icon size={14} className="text-[#BD20D3]" />
                          {card.label}
                        </CardDescription>
                        <CardTitle className="text-white text-lg md:text-xl font-bold truncate">{card.value}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <Card className="bg-[#020721]/60 border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Návštevy podľa stránok</CardTitle>
                    <CardDescription className="text-gray-400">
                      {RANGE[range].label.toLowerCase()} — vrátane stránok bez dát
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                          <th className="px-6 py-3">Stránka</th>
                          <th className="px-6 py-3">URL</th>
                          <th className="px-6 py-3 text-right">Sessiony</th>
                          <th className="px-6 py-3 text-right">Zobrazenia</th>
                          <th className="px-6 py-3 text-right">Kliky</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {pageBreakdown.map((row) => (
                          <tr key={row.path}>
                            <td className="px-6 py-3 text-white font-semibold">{row.label}</td>
                            <td className="px-6 py-3 font-mono text-xs">{row.path}</td>
                            <td className="px-6 py-3 text-right">{row.sessions}</td>
                            <td className="px-6 py-3 text-right">{row.views}</td>
                            <td className="px-6 py-3 text-right text-[#BD20D3] font-bold">{row.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card className="bg-[#020721]/60 border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Zdroje návštev</CardTitle>
                    <CardDescription className="text-gray-400">
                      Odkiaľ prišli pageviewy — {RANGE[range].label.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                          <th className="px-6 py-3">Zdroj</th>
                          <th className="px-6 py-3 text-right">Zobrazenia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {referrers.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                              Zatiaľ žiadne zdroje.
                            </td>
                          </tr>
                        ) : (
                          referrers.map((row) => (
                            <tr key={row.host}>
                              <td className="px-6 py-3 text-white font-semibold">{row.host}</td>
                              <td className="px-6 py-3 text-right text-[#BD20D3] font-bold">{row.count}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card className="bg-[#020721]/60 border-white/10 rounded-3xl">
                  <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-white">Heatmapa kliknutí</CardTitle>
                      <CardDescription className="text-gray-400">
                        {pageLabel(selectedPage)} — {RANGE[range].label.toLowerCase()}
                      </CardDescription>
                    </div>
                    <Select value={selectedPage} onValueChange={setSelectedPage}>
                      <SelectTrigger className="w-full md:w-80 bg-black/40 border-white/15 text-white rounded-xl">
                        <SelectValue placeholder="Stránka" />
                      </SelectTrigger>
                      <SelectContent>
                        {pages.map((p) => (
                          <SelectItem key={p} value={p}>
                            {pageLabel(p)} ({p})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="relative max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/40">
                      <div className="relative" style={{ height: frameHeight }}>
                        <iframe
                          ref={iframeRef}
                          title="Heatmap preview"
                          src={selectedPage}
                          className="w-full border-0 pointer-events-none opacity-70"
                          style={{ height: frameHeight }}
                          onLoad={onFrameLoad}
                        />
                        <canvas
                          ref={canvasRef}
                          className="absolute top-0 left-0 pointer-events-none"
                          style={{ height: frameHeight, width: '100%' }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{heatPoints.length} klikov na tejto URL</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#020721]/60 border-white/10 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Návštevnosť — {RANGE[range].label.toLowerCase()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={visitsChart}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                          <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: '#0a0d1f', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Line type="monotone" dataKey="pageviews" stroke="#BD20D3" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#020721]/60 border-white/10 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="text-white">Priemerný čas na stránke</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeByPage}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="page" stroke="#9ca3af" fontSize={10} />
                          <YAxis stroke="#9ca3af" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#0a0d1f', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Bar dataKey="seconds" fill="#1A4BFF" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#020721]/60 border-white/10 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-white">Hĺbka scrollu — {pageLabel(selectedPage)}</CardTitle>
                    <CardDescription className="text-gray-400">Podiel sessioní, ktoré dosiahli daný prah</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '25 %', value: scrollDepth.p25 },
                      { label: '50 %', value: scrollDepth.p50 },
                      { label: '75 %', value: scrollDepth.p75 },
                      { label: '100 %', value: scrollDepth.p100 },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">{item.label}</p>
                        <p className="text-2xl font-extrabold text-white mt-1">{item.value} %</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[#020721]/60 border-white/10 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Najklikanejšie prvky</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                          <th className="px-6 py-3">Element</th>
                          <th className="px-6 py-3">Stránka</th>
                          <th className="px-6 py-3 text-right">Kliky</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {topElements.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                              Zatiaľ žiadne kliky. Odhlás sa z adminu, daj súhlas s cookies a prejdi verejné stránky.
                            </td>
                          </tr>
                        ) : (
                          topElements.map((row) => (
                            <tr key={`${row.page}-${row.selector}`}>
                              <td className="px-6 py-3 font-mono text-xs text-white/90">{row.selector}</td>
                              <td className="px-6 py-3">{pageLabel(row.page)}</td>
                              <td className="px-6 py-3 text-right font-bold text-[#BD20D3]">{row.count}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default AdminAnalytics;
