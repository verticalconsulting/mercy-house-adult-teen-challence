import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MousePointerClick, Eye, TrendingUp, Search, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function fmt(n, decimals = 0) {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return Number(n).toFixed(decimals);
}

export default function SearchConsoleSummary() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: snapshots, isLoading, isError } = useQuery({
    queryKey: ['searchConsoleSnapshots'],
    queryFn: () => base44.entities.SearchConsoleSnapshot.filter({}, { sort: '-created_date', limit: 1 }),
    initialData: [],
  });

  const latest = snapshots?.items?.[0] || snapshots?.[0] || null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await base44.functions.invoke('syncSearchConsoleData', {});
      if (res.data?.status === 'success') {
        toast.success('Search Console data synced');
        queryClient.invalidateQueries({ queryKey: ['searchConsoleSnapshots'] });
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
    { icon: MousePointerClick, label: 'Clicks (28d)', value: fmt(latest?.total_clicks), color: 'bg-navy' },
    { icon: Eye, label: 'Impressions', value: fmt(latest?.total_impressions), color: 'bg-gold' },
    { icon: TrendingUp, label: 'Avg. CTR', value: latest?.avg_ctr != null ? (latest.avg_ctr * 100).toFixed(1) + '%' : '—', color: 'bg-green-600' },
    { icon: Search, label: 'Avg. Position', value: latest?.avg_position != null ? Number(latest.avg_position).toFixed(1) : '—', color: 'bg-purple-600' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-navy dark:text-gold flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Performance
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
            Failed to load search data.
          </div>
        ) : !latest ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
            <p>No data synced yet. Click "Sync Now" to fetch from Google Search Console.</p>
            <p className="text-xs mt-1">A daily auto-sync runs at 9am Central.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${s.color} shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.label}</p>
                      <p className="text-lg font-bold text-navy dark:text-gold">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {latest.top_queries && latest.top_queries.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Top Queries</p>
                <div className="flex flex-wrap gap-1.5">
                  {latest.top_queries.slice(0, 8).map((q, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-navy-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-navy dark:text-slate-200"
                    >
                      {q.query}
                      <span className="font-bold text-gold-accessible">{q.clicks}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
              Snapshot for {latest.snapshot_date} · Synced {format(new Date(latest.created_date), 'MMM d, h:mm a')}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}