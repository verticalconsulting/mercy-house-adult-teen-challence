import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow a time range from the frontend; default to current month ± buffer
    let timeMin, timeMax;
    try {
      const body = await req.json();
      timeMin = body.timeMin;
      timeMax = body.timeMax;
    } catch (_) { /* no body — use defaults */ }

    if (!timeMin) {
      const now = new Date();
      timeMin = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
    }
    if (!timeMax) {
      const now = new Date();
      timeMax = new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString();
    }

    // Fetch events from the Women's Center Google Calendar (shared connector)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const calendarId = 'marketing1@mercyhouseatc.com';

    let googleEvents = [];
    try {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
        + `?timeMin=${encodeURIComponent(timeMin)}`
        + `&timeMax=${encodeURIComponent(timeMax)}`
        + `&timeZone=${encodeURIComponent('America/Chicago')}`
        + `&singleEvents=true&orderBy=startTime&maxResults=250`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
      if (res.ok) {
        const data = await res.json();
        googleEvents = (data.items || []).filter(e => e.status !== 'cancelled');
      } else {
        console.error('Google Calendar API error:', res.status, await res.text());
      }
    } catch (e) {
      console.error('Google Calendar fetch failed:', e.message);
    }

    // Normalize events
    const events = googleEvents.map(e => {
      const startStr = e.start?.dateTime || e.start?.date;
      const endStr = e.end?.dateTime || e.end?.date;
      return {
        id: e.id,
        title: e.summary || '(Untitled event)',
        start: startStr,
        end: endStr,
        location: e.location || '',
        description: e.description || '',
        html_link: e.htmlLink || '',
        all_day: !e.start?.dateTime
      };
    }).filter(e => e.start);

    // Attach volunteer commitments by google_event_id
    const shifts = await base44.asServiceRole.entities.VolunteerShift.list('-event_date', 500);
    const byEvent = {};
    for (const s of shifts) {
      if (s.status === 'cancelled' || !s.google_event_id) continue;
      if (!byEvent[s.google_event_id]) byEvent[s.google_event_id] = [];
      byEvent[s.google_event_id].push(s);
    }

    const result = events.map(e => {
      const evShifts = byEvent[e.id] || [];
      const firstNames = evShifts.map(s => {
        const parts = (s.volunteer_name || '').split(' ').filter(Boolean);
        const first = parts[0] || '';
        const lastInitial = parts[1] ? parts[1][0] + '.' : '';
        return `${first} ${lastInitial}`.trim();
      });
      return {
        ...e,
        volunteer_count: evShifts.length,
        volunteer_first_names: firstNames
      };
    });

    return Response.json({ events: result });
  } catch (error) {
    console.error('getWomensCenterCalendar error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});