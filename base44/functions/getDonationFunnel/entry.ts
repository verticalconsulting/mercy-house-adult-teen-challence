import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { user = null; }
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    // Get the list of GA4 properties
    const accountsRes = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountsData = await accountsRes.json();
    console.log('GA Accounts:', JSON.stringify(accountsData));

    if (!accountsData.accountSummaries?.length) {
      return Response.json({ error: 'No Google Analytics properties found. Make sure GA4 is set up for your site.' }, { status: 404 });
    }

    // Use the first available property
    const propertyId = accountsData.accountSummaries[0].propertySummaries?.[0]?.property;
    if (!propertyId) {
      return Response.json({ error: 'No GA4 property found.' }, { status: 404 });
    }

    const propId = propertyId.replace('properties/', '');
    console.log('Using GA4 property:', propId);

    // Query page path data for donation-related pages over last 30 days
    const reportRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'bounceRate' }
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'pagePath',
              inListFilter: {
                values: ['/Donate', '/Donate/', '/Support', '/Support/']
              }
            }
          },
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 20
        })
      }
    );
    const reportData = await reportRes.json();
    console.log('GA Report:', JSON.stringify(reportData));

    // Also get event data for donation-related events
    const eventsRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }, { name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 50
        })
      }
    );
    const eventsData = await eventsRes.json();
    console.log('GA Events:', JSON.stringify(eventsData));

    // Get overall site traffic for funnel baseline
    const overallRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10
        })
      }
    );
    const overallData = await overallRes.json();

    return Response.json({
      propertyId: propId,
      pages: reportData,
      events: eventsData,
      topPages: overallData
    });
  } catch (error) {
    console.error('Error fetching GA data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});