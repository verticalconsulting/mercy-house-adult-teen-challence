import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendTwilioSms } from '../../shared/twilioSms.ts';

// Triggered by the "Volunteer Calendar Sync" workflow whenever the connected
// Google Calendar (the volunteer-activities calendar) changes. Google Calendar
// webhooks carry no payload — only a signal that something changed — so this
// handler runs an incremental sync (syncToken) to discover the actual changed
// events, mirrors each into an Event entity, and emails + SMS-notifies every
// volunteer assigned to that calendar event (VolunteerShift.google_event_id).

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data || {};
    const meta = data._provider_meta || {};
    const resourceState = meta['x-goog-resource-state'];

    // 'sync' is the initial handshake ack from Google — nothing to do yet.
    if (resourceState === 'sync') {
      return Response.json({ status: 'sync_ack' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load the persisted sync token (entity, NOT env — env vars don't persist).
    const existing = await base44.asServiceRole.entities.SyncState.filter({ provider: 'googlecalendar' });
    const syncRecord = existing.length > 0 ? existing[0] : null;

    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&singleEvents=true';
    if (syncRecord?.sync_token) {
      url += `&syncToken=${encodeURIComponent(syncRecord.sync_token)}`;
    } else {
      // First sync: pull recent events only.
      url += '&timeMin=' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    let res = await fetch(url, { headers: authHeader });
    if (res.status === 410) {
      // syncToken expired — restart with a fresh timeMin window.
      url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&singleEvents=true&timeMin=' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      res = await fetch(url, { headers: authHeader });
    }
    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ status: 'api_error', details: errText }, { status: 502 });
    }

    // Drain all pages — nextSyncToken only appears on the last page.
    const allItems = [];
    let pageData = await res.json();
    let newSyncToken = null;
    while (true) {
      allItems.push(...(pageData.items || []));
      if (pageData.nextSyncToken) newSyncToken = pageData.nextSyncToken;
      if (!pageData.nextPageToken) break;
      const nextRes = await fetch(url + `&pageToken=${encodeURIComponent(pageData.nextPageToken)}`, { headers: authHeader });
      if (!nextRes.ok) break;
      pageData = await nextRes.json();
    }

    let mirrored = 0;
    let notified = 0;

    for (const ev of allItems) {
      const cancelled = ev.status === 'cancelled';
      const startISO = ev.start?.dateTime || ev.start?.date || null;
      const endISO = ev.end?.dateTime || ev.end?.date || null;
      const title = ev.summary || 'Volunteer Activity';

      // 1) Mirror the calendar event into an Event entity (upsert by google_event_id).
      const existingEvents = await base44.asServiceRole.entities.Event.filter({ google_event_id: ev.id });
      const existingEvent = existingEvents.length > 0 ? existingEvents[0] : null;

      if (cancelled) {
        if (existingEvent) {
          await base44.asServiceRole.entities.Event.update(existingEvent.id, { published: false });
        }
      } else {
        const payload = {
          google_event_id: ev.id,
          title,
          description: ev.description || '',
          event_date: startISO,
          end_date: endISO,
          location: ev.location || '',
          category: 'community_event',
          published: true
        };
        if (existingEvent) {
          await base44.asServiceRole.entities.Event.update(existingEvent.id, payload);
        } else {
          await base44.asServiceRole.entities.Event.create(payload);
        }
        mirrored++;
      }

      // 2) Notify volunteers assigned to this calendar event.
      const shifts = await base44.asServiceRole.entities.VolunteerShift.filter({ google_event_id: ev.id });
      for (const shift of shifts) {
        try {
          const volunteer = await base44.asServiceRole.entities.Volunteer.get(shift.volunteer_id);
          if (!volunteer) continue;

          // Keep the shift's denormalized title/date in sync with the calendar.
          if (!cancelled) {
            await base44.asServiceRole.entities.VolunteerShift.update(shift.id, {
              event_title: title,
              event_date: startISO || shift.event_date
            });
          }

          const shiftDate = shift.event_date || startISO;
          const dateStr = shiftDate
            ? new Date(shiftDate).toLocaleString('en-US', {
                weekday: 'long', month: 'short', day: 'numeric',
                hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago'
              })
            : '(date TBD)';

          let smsBody;
          let emailSubject;
          let emailBody;
          if (cancelled) {
            smsBody = `Mercy House: The volunteer activity "${shift.event_title}" has been CANCELLED. No action needed. Questions? Call 855-893-7333. Reply STOP to cancel.`;
            emailSubject = `Volunteer Activity Cancelled: ${shift.event_title}`;
            emailBody = `Dear ${volunteer.full_name},\n\nThe volunteer activity "${shift.event_title}" has been cancelled. No further action is needed from you at this time.\n\nIf you have questions, please call 855-893-7333.\n\nThank you,\nMercy House Team`;
          } else {
            smsBody = `Mercy House Update: Your volunteer shift "${title}" is scheduled for ${dateStr}. Reply CONFIRM, CANCEL, or RESCHEDULE. View: https://mercyhouseatc.com/WomensCenterCalendar | Questions? Call 855-893-7333. Msg&data rates may apply. Reply STOP to cancel.`;
            emailSubject = `Volunteer Shift Update: ${title}`;
            emailBody = `Dear ${volunteer.full_name},\n\nYour volunteer shift has been updated:\n\nActivity: ${title}\nWhen: ${dateStr}${ev.location ? `\nWhere: ${ev.location}` : ''}\n\nPlease reply CONFIRM, CANCEL, or RESCHEDULE to ${volunteer.phone ? 'the SMS we just sent' : 'our team'}. You can also view the schedule at https://mercyhouseatc.com/WomensCenterCalendar.\n\nThank you for serving with Mercy House!\n\nMercy House Team`;
          }

          if (volunteer.phone) {
            await sendTwilioSms(volunteer.phone, smsBody).catch((e) => console.error('SMS failed', volunteer.id, e.message));
          }
          if (volunteer.email) {
            // SendEmail only reaches registered app users; non-registered
            // addresses are rejected by the platform — log and continue.
            await base44.integrations.Core.SendEmail({
              to: volunteer.email,
              subject: emailSubject,
              body: emailBody
            }).catch((e) => console.warn('Email skipped for', volunteer.email, '-', e.message));
          }
          notified++;
        } catch (e) {
          console.error('Notify failed for shift', shift.id, e.message);
        }
      }
    }

    // Persist the new sync token AFTER successful processing.
    if (newSyncToken) {
      if (syncRecord) {
        await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { sync_token: newSyncToken });
      } else {
        await base44.asServiceRole.entities.SyncState.create({ sync_token: newSyncToken, provider: 'googlecalendar' });
      }
    }

    return Response.json({ status: 'success', changed: allItems.length, mirrored, notified });
  } catch (error) {
    console.error('syncVolunteerCalendar error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});