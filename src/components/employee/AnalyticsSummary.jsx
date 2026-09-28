import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MousePointerClick, Eye, Clock, Activity, RefreshCw, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

function fmt(n) {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return Number(n).toLocaleString();
}

function fmtDuration(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AnalyticsSummary() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: snapshots, isLoading, isError } = useQuery({
    queryKey: ['analyticsSnapshots'],
    queryFn: () => base44.entities.AnalyticsSnapshot.filter({}, { sort: '-created_date', limit: 1 }),
    initialData: [],
  });

  const latest = snapshots?.items?.[0] || snapshots?.[0] || null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await base44.functions.invoke('syncAnalyticsData', {});
      if (res.data?.status === 'success') {
        toast.success('Analytics data synced');
        queryClient.invalidateQueries({ queryKey: ['analyticsSnapshots'] });
      } else {
        toast.error(res.data?.error || 'Sync failed');
      }
    } catch (e) {
      toast.error(e.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Users (28d)', value: fmt(latest?.total_users), color: 'bg-navy' },
    { icon: MousePointerClick, label: 'Sessions', value: fmt(latest?.total_sessions), color: 'bg-gold' },
    { icon: Eye, label: 'Page Views', value: fmt(latest?.page_views), color: 'bg-purple-600' },
    { icon: Activity, label: 'Engagement', value: latest?.engagement_rate != null ? (latest.engagement_rate * 100).toFixed(0) + '%' : '—', color: 'bg-green-600' },
    { icon: Clock, label: 'Avg. Session', value: fmtDuration(latest?.avg_session_duration), color: 'bg-blue-600' },
  ];

  const chartData = latest?.daily_sessions?.map(d => ({
    date: d.date.slice(5), // MM-DD
    sessions: d.sessions,
  })) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-navy dark:text-gold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Website Traffic & Engagement
        </CardTitle>
        <Button
          onClick={handleSync}
          disabled={syncing || isLoading}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          {syncing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm py-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Failed to load analytics data.
          </div>
        ) : !latest ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
            <p>No data synced yet. Click "Sync Now" to fetch from Google Analytics.</p>
            <p className="text-xs mt-1">A daily auto-sync runs at 9am Central.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${s.color} shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.label}</p>
                      <p className="text-base font-bold text-navy dark:text-gold">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {chartData.length > 1 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mb-4">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Daily Sessions Trend</p>
                <div style={{ height: 140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" stroke="rgba(100,116,139,0.6)" />
                      <YAxis tick={{ fontSize: 10 }} stroke="rgba(100,116,139,0.6)" width={30} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        labelStyle={{ fontWeight: 600 }}
                      />
                      <Line type="monotone" dataKey="sessions" stroke="#2F4E6F" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-3">
              {latest.top_pages && latest.top_pages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Top Pages</p>
                  <div className="space-y-1">
                    {latest.top_pages.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 dark:text-slate-300 truncate mr-2 max-w-[200px]">{p.page}</span>
                        <span className="font-bold text-navy dark:text-gold shrink-0">{fmt(p.views)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {latest.top_sources && latest.top_sources.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Top Traffic Sources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {latest.top_sources.slice(0, 6).map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-navy-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-navy dark:text-slate-200"
                      >
                        {s.source}
                        <span className="font-bold text-gold-accessible">{s.sessions}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
              {latest.property_name} · Snapshot for {latest.snapshot_date} · Synced {format(new Date(latest.created_date), 'MMM d, h:mm a')}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}