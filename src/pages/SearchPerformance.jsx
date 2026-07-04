import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MousePointerClick, Eye, TrendingUp, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchQueriesDisplay from '../components/SearchQueriesDisplay';

const RANGE_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '28 days', days: 28 },
  { label: '90 days', days: 90 },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-navy dark:text-gold">{value ?? '—'}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function fmt(n, decimals = 0) {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return Number(n).toFixed(decimals);
}

export default function SearchPerformance() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [range, setRange] = useState(28);
  const [data, setData] = useState(null);
  const [dimension, setDimension] = useState('query');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load sites on mount
  useEffect(() => {
    base44.functions.invoke('getSearchConsoleData', {})
      .then(res => {
        const list = res.data?.sites || [];
        setSites(list);
        if (list.length > 0) setSelectedSite(list[0].siteUrl);
      })
      .catch(e => setError(e.message));
  }, []);

  // Fetch data when site or range changes
  useEffect(() => {
    if (!selectedSite) return;
    setLoading(true);
    setError(null);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - range);
    base44.functions.invoke('getSearchConsoleData', {
      siteUrl: selectedSite,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      dimensions: [dimension],
    })
      .then(res => { setData(res.data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [selectedSite, range, dimension]);

  const totals = data?.totals || {};
  const trend = (data?.trend || []).map(r => ({
    date: r.keys?.[0] || '',
    clicks: r.clicks,
    impressions: r.impressions,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy dark:text-gold flex items-center gap-3">
            <BarChart2 className="w-8 h-8" />
            Search Performance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Google Search Console data for your ministry site</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {sites.length > 0 && (
            <select
              value={selectedSite}
              onChange={e => setSelectedSite(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm"
            >
              {sites.map(s => (
                <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
              ))}
            </select>
          )}
          <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            {RANGE_OPTIONS.map(opt => (
              <button
                key={opt.days}
                onClick={() => setRange(opt.days)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${range === opt.days ? 'bg-navy text-white dark:bg-gold dark:text-navy' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            {['query', 'page'].map(d => (
              <button
                key={d}
                onClick={() => setDimension(d)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${dimension === d ? 'bg-navy text-white dark:bg-gold dark:text-navy' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                By {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-navy dark:text-gold" />
          </div>
        )}

        {!loading && data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={MousePointerClick} label="Total Clicks" value={fmt(totals.clicks)} color="bg-navy" />
              <StatCard icon={Eye} label="Total Impressions" value={fmt(totals.impressions)} color="bg-gold" />
              <StatCard icon={TrendingUp} label="Avg. CTR" value={totals.ctr != null ? (totals.ctr * 100).toFixed(1) + '%' : '—'} color="bg-green-600" />
              <StatCard icon={Search} label="Avg. Position" value={totals.position != null ? Number(totals.position).toFixed(1) : '—'} color="bg-purple-600" />
            </div>

            {/* Trend Chart */}
            {trend.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Clicks &amp; Impressions Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="impressions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v, n) => [v.toLocaleString(), n === 'clicks' ? 'Clicks' : 'Impressions']} labelFormatter={d => `Date: ${d}`} />
                      <Area type="monotone" dataKey="impressions" stroke="hsl(var(--accent))" fill="url(#impressions)" strokeWidth={2} />
                      <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#clicks)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Top Queries / Pages Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">
                  Top {dimension === 'query' ? 'Queries' : 'Pages'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.rows.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No data available for this period.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                          <th className="pb-3 font-semibold text-slate-600 dark:text-slate-300">{dimension === 'query' ? 'Query' : 'Page'}</th>
                          <th className="pb-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Clicks</th>
                          <th className="pb-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Impressions</th>
                          <th className="pb-3 font-semibold text-slate-600 dark:text-slate-300 text-right">CTR</th>
                          <th className="pb-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.rows.map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="py-3 text-slate-700 dark:text-slate-200 max-w-xs truncate">{row.keys?.[0]}</td>
                            <td className="py-3 text-right font-medium text-navy dark:text-gold">{row.clicks?.toLocaleString()}</td>
                            <td className="py-3 text-right text-slate-600 dark:text-slate-300">{row.impressions?.toLocaleString()}</td>
                            <td className="py-3 text-right text-slate-600 dark:text-slate-300">{row.ctr != null ? (row.ctr * 100).toFixed(1) + '%' : '—'}</td>
                            <td className="py-3 text-right text-slate-600 dark:text-slate-300">{row.position != null ? Number(row.position).toFixed(1) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!loading && !data && !error && (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Select a site to load performance data.</p>
          </div>
        )}

        {/* Top Queries Section */}
        <div className="mt-12">
          <SearchQueriesDisplay />
        </div>
      </div>
    </div>
  );
}