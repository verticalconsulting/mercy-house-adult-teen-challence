import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    const body = await req.json().catch(() => ({}));
    const { siteUrl, startDate, endDate, dimensions = ['query'] } = body;

    // 1. List sites if no siteUrl provided
    if (!siteUrl) {
      const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const sitesData = await sitesRes.json();
      return Response.json({ sites: sitesData.siteEntry || [] });
    }

    // 2. Fetch search analytics
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 28);
      return d.toISOString().split('T')[0];
    })();

    const analyticsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: start,
          endDate: end,
          dimensions,
          rowLimit: 25,
        }),
      }
    );
    const analyticsData = await analyticsRes.json();

    // 3. Fetch overall totals (no dimensions)
    const totalsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate: start, endDate: end, dimensions: [] }),
      }
    );
    const totalsData = await totalsRes.json();

    // 4. Fetch daily trend (date dimension)
    const trendRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: start,
          endDate: end,
          dimensions: ['date'],
          rowLimit: 90,
        }),
      }
    );
    const trendData = await trendRes.json();

    return Response.json({
      rows: analyticsData.rows || [],
      totals: totalsData.rows?.[0] || {},
      trend: trendData.rows || [],
      startDate: start,
      endDate: end,
    });
  } catch (error) {
    console.error('Search Console error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});