import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { sendTwilioSms } from '../../shared/twilioSms.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const volunteer_ids = body.volunteer_ids;
    const message = body.message;

    if (!Array.isArray(volunteer_ids) || volunteer_ids.length === 0) {
      return Response.json({ error: 'volunteer_ids must be a non-empty array' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const errors = [];

    for (const id of volunteer_ids) {
      try {
        const volunteer = await base44.asServiceRole.entities.Volunteer.get(id);
        if (!volunteer || !volunteer.phone) { skipped++; continue; }
        // Respect SMS opt-in: only text volunteers who consented.
        if (volunteer.sms_opt_in !== true) { skipped++; continue; }

        await sendTwilioSms(volunteer.phone, message.trim());
        sent++;
      } catch (e) {
        console.error('Bulk SMS failed for volunteer', id, e.message);
        failed++;
        errors.push({ id, error: e.message });
      }
    }

    return Response.json({ sent, failed, skipped, total: volunteer_ids.length, errors });
  } catch (error) {
    console.error('sendBulkVolunteerSms error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});