import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { user = null; }
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    // Get list of properties
    const propertiesResponse = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const propertiesData = await propertiesResponse.json();
    
    if (!propertiesData.siteEntry || propertiesData.siteEntry.length === 0) {
      return Response.json({ error: 'No GSC properties found' }, { status: 404 });
    }

    // Use the first property
    const siteUrl = propertiesData.siteEntry[0].siteUrl;
    const encodedSiteUrl = encodeURIComponent(siteUrl);

    // Fetch top queries for the last 3 months
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    const queriesResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 20,
          orderBy: [{ columnName: 'clicks', sortOrder: 'DESCENDING' }]
        })
      }
    );

    const queryData = await queriesResponse.json();

    if (!queryData.rows) {
      return Response.json({ queries: [], siteUrl });
    }

    const queries = queryData.rows.map(row => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: (row.ctr * 100).toFixed(2),
      position: row.position.toFixed(1)
    }));

    return Response.json({ queries, siteUrl });
  } catch (error) {
    console.error('GSC Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});