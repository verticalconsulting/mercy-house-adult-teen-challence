import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { sendTwilioSms } from '../../shared/twilioSms.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let user;
    try { user = await base44.auth.me(); } catch { user = null; }
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date();
    const in24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48 = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const shifts = await base44.asServiceRole.entities.VolunteerShift.filter({ status: 'scheduled', reminder_sent: false });

    const toRemind = shifts.filter(s => {
      if (!s.event_date) return false;
      const d = new Date(s.event_date);
      return d >= in24 && d <= in48;
    });

    let sent = 0;
    let failed = 0;

    for (const shift of toRemind) {
      try {
        const volunteer = await base44.asServiceRole.entities.Volunteer.get(shift.volunteer_id);
        if (!volunteer || !volunteer.phone) { failed++; continue; }

        const dateStr = new Date(shift.event_date).toLocaleString('en-US', {
          weekday: 'long', month: 'short', day: 'numeric',
          hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago'
        });

        const msg = `Mercy House Reminder: Volunteer shift for "${shift.event_title}" on ${dateStr}. Reply CONFIRM, CANCEL, or RESCHEDULE. View schedule: https://mercyhouseatc.com/WomensCenterCalendar | Questions? Call 855-893-7333. Msg&data rates may apply. Reply STOP to cancel.`;
        await sendTwilioSms(volunteer.phone, msg);

        await base44.asServiceRole.entities.VolunteerShift.update(shift.id, {
          reminder_sent: true,
          reminder_sent_date: new Date().toISOString()
        });
        sent++;
      } catch (e) {
        console.error('Reminder failed for shift', shift.id, e.message);
        failed++;
      }
    }

    return Response.json({ sent, failed, checked: shifts.length });
  } catch (error) {
    console.error('sendVolunteerReminders error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});