import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const rawBody = await req.text();
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');

    const valid = await validateTwilioSignature(req, rawBody, authToken);
    if (!valid) {
      return Response.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const params = new URLSearchParams(rawBody);
    const from = params.get('From') || '';
    const body = (params.get('Body') || '').trim().toUpperCase();

    const base44 = createClientFromRequest(req);

    // Match volunteer by phone (last 10 digits)
    const norm = (p) => (p || '').replace(/\D/g, '').slice(-10);
    const fromNorm = norm(from);
    const volunteers = await base44.asServiceRole.entities.Volunteer.list('-created_date', 500);
    const volunteer = volunteers.find(v => norm(v.phone) === fromNorm);

    if (!volunteer) {
      return twimlResponse("We couldn't find a volunteer with this number. Call us at 855-893-7333. — Mercy House");
    }

    // Find upcoming scheduled/confirmed shifts
    const shifts = await base44.asServiceRole.entities.VolunteerShift.filter({ volunteer_id: volunteer.id });
    const now = new Date();
    const upcoming = shifts
      .filter(s => s.status === 'scheduled' || s.status === 'confirmed')
      .filter(s => s.event_date && new Date(s.event_date) >= now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    if (upcoming.length === 0) {
      return twimlResponse(`Hi ${volunteer.full_name.split(' ')[0]}, we don't have an upcoming shift for you. Questions? Call 855-893-7333. — Mercy House`);
    }

    const shift = upcoming[0];
    let reply = '';
    const stamp = new Date().toISOString();

    if (['CANCEL', 'C', 'CANCELLED', 'NO', 'STOP'].includes(body)) {
      await base44.asServiceRole.entities.VolunteerShift.update(shift.id, {
        status: 'cancelled',
        notes: (shift.notes || '') + `\nCancelled via SMS reply on ${stamp}`
      });
      reply = `Your shift for "${shift.event_title}" has been cancelled. Thank you for letting us know. — Mercy House`;
    } else if (['RESCHEDULE', 'R', 'CHANGE', 'RESCHED'].includes(body) || body.startsWith('RESCHED')) {
      await base44.asServiceRole.entities.VolunteerShift.update(shift.id, {
        status: 'reschedule_requested',
        notes: (shift.notes || '') + `\nReschedule requested via SMS on ${stamp}`
      });
      reply = `We received your request to reschedule "${shift.event_title}". Our team will contact you to pick a new date. — Mercy House`;
    } else if (['CONFIRM', 'YES', 'Y', 'CONFIRMED'].includes(body)) {
      await base44.asServiceRole.entities.VolunteerShift.update(shift.id, { status: 'confirmed' });
      reply = `Thanks for confirming your shift for "${shift.event_title}". See you there! — Mercy House`;
    } else if (body === 'HELP') {
      reply = `Reply CONFIRM, CANCEL, or RESCHEDULE for your next shift. Call 855-893-7333 for help. — Mercy House`;
    } else {
      reply = `Reply CONFIRM, CANCEL, or RESCHEDULE for your next shift ("${shift.event_title}"). Or call 855-893-7333. — Mercy House`;
    }

    return twimlResponse(reply);
  } catch (error) {
    console.error('volunteerSmsWebhook error:', error.message);
    return twimlResponse('Sorry, we had trouble processing your message. Please call 855-893-7333. — Mercy House');
  }
});

async function validateTwilioSignature(req, body, authToken) {
  const signature = req.headers.get('X-Twilio-Signature');
  if (!signature || !authToken) return false;

  const url = new URL(req.url).href;
  const params = new URLSearchParams(body);
  const sortedKeys = [...params.keys()].sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + (params.get(key) || '');
  }

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(authToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));

  if (computed.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

function twimlResponse(message) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
  return new Response(xml, { status: 200, headers: { 'Content-Type': 'text/xml' } });
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}