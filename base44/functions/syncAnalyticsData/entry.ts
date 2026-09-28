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

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    // 1. Discover the first GA4 property via the Admin API
    const summariesRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const summariesData = await summariesRes.json();
    const accounts = summariesData.accountSummaries || [];
    let propertyId = null;
    let propertyName = null;
    // Prefer the main Mercy House ATC website property; fall back to the first
    // property under the Mercy House ATC account; fall back to the first property.
    const matchByName = (name, needle) =>
      (name || '').toLowerCase().includes(needle);
    for (const acct of accounts) {
      for (const p of (acct.propertySummaries || [])) {
        if (matchByName(p.displayName, 'mercy house adult teen challenge')) {
          propertyId = p.property.split('/')[1];
          propertyName = p.displayName || p.property;
          break;
        }
      }
      if (propertyId) break;
    }
    if (!propertyId) {
      for (const acct of accounts) {
        if (matchByName(acct.displayName, 'mercy house atc')) {
          const props = acct.propertySummaries || [];
          if (props.length > 0) {
            propertyId = props[0].property.split('/')[1];
            propertyName = props[0].displayName || props[0].property;
            break;
          }
        }
      }
    }
    if (!propertyId) {
      for (const acct of accounts) {
        const props = acct.propertySummaries || [];
        if (props.length > 0) {
          propertyId = props[0].property.split('/')[1];
          propertyName = props[0].displayName || props[0].property;
          break;
        }
      }
    }
    if (!propertyId) {
      return Response.json({ error: 'No Google Analytics 4 properties found' }, { status: 404 });
    }

    // 2. Date range: last 28 days ending yesterday
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 27);
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    const dateRange = { startDate, endDate };

    const dataApiBase = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

    // 3. Fetch overall totals
    const totalsRes = await fetch(dataApiBase, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [dateRange],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
        ],
      }),
    });
    const totalsData = await totalsRes.json();
    const totalsRow = totalsData.rows?.[0]?.metricValues || [];
    const totalUsers = parseInt(totalsRow[0]?.value || '0', 10);
    const totalSessions = parseInt(totalsRow[1]?.value || '0', 10);
    const pageViews = parseInt(totalsRow[2]?.value || '0', 10);
    const engagementRate = parseFloat(totalsRow[3]?.value || '0');
    const avgSessionDuration = parseFloat(totalsRow[4]?.value || '0');

    // 4. Fetch top pages
    const pagesRes = await fetch(dataApiBase, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [dateRange],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    });
    const pagesData = await pagesRes.json();
    const topPages = (pagesData.rows || []).map(row => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10),
    }));

    // 5. Fetch top traffic sources
    const sourcesRes = await fetch(dataApiBase, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [dateRange],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
    });
    const sourcesData = await sourcesRes.json();
    const topSources = (sourcesData.rows || []).map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value, 10),
    }));

    // 6. Fetch daily sessions trend
    const trendRes = await fetch(dataApiBase, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [dateRange],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
        limit: 28,
      }),
    });
    const trendData = await trendRes.json();
    const dailySessions = (trendData.rows || []).map(row => {
      const rawDate = row.dimensionValues[0].value; // YYYYMMDD
      const date = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      return { date, sessions: parseInt(row.metricValues[0].value, 10) };
    });

    // 7. Store the snapshot
    const snapshot = await base44.asServiceRole.entities.AnalyticsSnapshot.create({
      snapshot_date: endDate,
      property_id: propertyId,
      property_name: propertyName,
      total_users: totalUsers,
      total_sessions: totalSessions,
      page_views: pageViews,
      engagement_rate: engagementRate,
      avg_session_duration: avgSessionDuration,
      top_pages: topPages,
      top_sources: topSources,
      daily_sessions: dailySessions,
      date_range_days: 28,
    });

    console.log('Analytics snapshot stored:', snapshot.id, 'for property', propertyId, endDate);

    return Response.json({
      status: 'success',
      snapshot: {
        id: snapshot.id,
        snapshot_date: snapshot.snapshot_date,
        property_name: snapshot.property_name,
        total_users: snapshot.total_users,
        total_sessions: snapshot.total_sessions,
        page_views: snapshot.page_views,
        engagement_rate: snapshot.engagement_rate,
        avg_session_duration: snapshot.avg_session_duration,
        top_pages_count: topPages.length,
        top_sources_count: topSources.length,
      },
    });
  } catch (error) {
    console.error('Analytics sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});