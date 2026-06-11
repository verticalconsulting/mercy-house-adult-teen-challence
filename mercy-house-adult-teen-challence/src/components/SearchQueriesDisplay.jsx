import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';

export default function SearchQueriesDisplay() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await base44.functions.invoke('getSearchConsoleQueries', {});
        setQueries(response.data.queries || []);
        setSiteUrl(response.data.siteUrl || '');
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch search console data');
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="flex items-center gap-3 py-6 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy dark:text-gold">
          <TrendingUp className="w-5 h-5" />
          Top Search Queries (Last 90 Days)
        </CardTitle>
        {siteUrl && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{siteUrl}</p>}
      </CardHeader>
      <CardContent>
        {queries.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 text-center py-8">No search data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Query</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Clicks</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Impressions</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">CTR</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Avg. Position</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">{q.query}</td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">{q.clicks.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">{q.impressions.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">{q.ctr}%</td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}