import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const events = await base44.asServiceRole.entities.Event.filter({ published: true }, 'event_date', 50);
    const now = new Date();
    const upcoming = events.filter(e => e.event_date && new Date(e.event_date) >= now);

    const shifts = await base44.asServiceRole.entities.VolunteerShift.list('-event_date', 500);
    const byEvent = {};
    for (const s of shifts) {
      if (s.status === 'cancelled') continue;
      if (!byEvent[s.event_id]) byEvent[s.event_id] = [];
      byEvent[s.event_id].push(s);
    }

    const result = upcoming.map(e => {
      const evShifts = byEvent[e.id] || [];
      const firstNames = evShifts.map(s => {
        const parts = (s.volunteer_name || '').split(' ').filter(Boolean);
        const first = parts[0] || '';
        const lastInitial = parts[1] ? parts[1][0] + '.' : '';
        return `${first} ${lastInitial}`.trim();
      });
      return {
        id: e.id,
        title: e.title,
        description: e.description,
        event_date: e.event_date,
        location: e.location,
        image_url: e.image_url,
        category: e.category,
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