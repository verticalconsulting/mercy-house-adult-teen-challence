import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { sendTwilioSms } from '../../shared/twilioSms.ts';

Deno.serve(async (req) => {
  let volunteer_id;
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    volunteer_id = body.volunteer_id;
    const message = body.message;
    if (!volunteer_id || !message) {
      return Response.json({ error: 'volunteer_id and message are required' }, { status: 400 });
    }

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(volunteer_id);
    if (!volunteer || !volunteer.phone) {
      return Response.json({ error: 'Volunteer phone not found' }, { status: 404 });
    }

    const result = await sendTwilioSms(volunteer.phone, message);
    return Response.json({ success: true, sid: result.sid });
  } catch (error) {
    console.error('sendVolunteerSms error:', error.message, '| volunteer_id:', volunteer_id);
    return Response.json({ error: error.message }, { status: 500 });
  }
});