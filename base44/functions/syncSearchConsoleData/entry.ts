import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { verifyAutomationSecret } from '../../shared/security.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reqBody = await req.json().catch(() => ({}));

    // Auth: either the workflow automation secret or an admin user (manual sync).
    const isAutomation = verifyAutomationSecret(reqBody);
    if (!isAutomation) {
      let user;
      try { user = await base44.auth.me(); } catch { user = null; }
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    // 1. List sites — pick the first property
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const sitesData = await sitesRes.json();
    const sites = sitesData.siteEntry || [];
    if (sites.length === 0) {
      return Response.json({ error: 'No Search Console properties found' }, { status: 404 });
    }
    const siteUrl = sites[0].siteUrl;
    const encodedSiteUrl = encodeURIComponent(siteUrl);

    // 2. Date range: last 28 days ending yesterday (GSC data has 1-2 day delay)
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 27);
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    // 3. Fetch overall totals (no dimensions)
    const totalsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: [] }),
      }
    );
    const totalsData = await totalsRes.json();
    const totals = totalsData.rows?.[0] || {};

    // 4. Fetch top queries by clicks
    const queriesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 20,
          orderBy: [{ columnName: 'clicks', sortOrder: 'DESCENDING' }],
        }),
      }
    );
    const queriesData = await queriesRes.json();
    const topQueries = (queriesData.rows || []).map(row => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));

    // 5. Store the snapshot
    const snapshot = await base44.asServiceRole.entities.SearchConsoleSnapshot.create({
      snapshot_date: endDate,
      site_url: siteUrl,
      total_clicks: totals.clicks || 0,
      total_impressions: totals.impressions || 0,
      avg_ctr: totals.ctr || 0,
      avg_position: totals.position || 0,
      top_queries: topQueries,
      date_range_days: 28,
    });

    console.log('Search Console snapshot stored:', snapshot.id, 'for', siteUrl, endDate);

    return Response.json({
      status: 'success',
      snapshot: {
        id: snapshot.id,
        snapshot_date: snapshot.snapshot_date,
        site_url: snapshot.site_url,
        total_clicks: snapshot.total_clicks,
        total_impressions: snapshot.total_impressions,
        avg_ctr: snapshot.avg_ctr,
        avg_position: snapshot.avg_position,
        top_queries_count: topQueries.length,
      },
    });
  } catch (error) {
    console.error('Search Console sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});