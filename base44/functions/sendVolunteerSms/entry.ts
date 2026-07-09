import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { volunteer_id, message } = await req.json();
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

function toE164(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  if (digits.length > 11) return '+' + digits;
  return phone;
}

async function sendTwilioSms(to, body) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!sid || !token || !from) throw new Error('Twilio credentials not configured');

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams();
  params.set('To', toE164(to));
  params.set('From', from);
  params.set('Body', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${sid}:${token}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Twilio API error');
  return data;
}