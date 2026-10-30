import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { sanitizeHeader, verifyAutomationSecret } from '../../shared/security.ts';
import { volunteerDocxBytes, volunteerFileName, uploadVolunteerDocx } from '../../shared/volunteerDocx.ts';

const VOLUNTEER_FOLDER_ID = '1ODt9OQo1puP7y88HztmhzxpRzaAh5yXY';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reqBody = await req.json();

    // Trust boundary: the workflow invokes this function as its creator (an
    // app admin), so accept the admin user context, falling back to the
    // legacy automation secret. Prevents anonymous callers from triggering
    // Drive uploads and staff emails (CWE-306).
    if (!verifyAutomationSecret(reqBody)) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // The platform passes the entity trigger as the request body. Support
    // both the legacy { event, data } shape and the current { event_type,
    // entity_name, data } trigger shape.
    const event = reqBody.event || (reqBody.event_type ? { type: reqBody.event_type, entity_name: reqBody.entity_name } : null);
    const data = reqBody.data;

    // Only a genuine entity-automation "create" event for a Volunteer is
    // honored, and the record is re-fetched from the database so an
    // unauthenticated caller cannot inject arbitrary content into Drive
    // files or notification emails (CWE-306).
    if (!event || event.type !== 'create' || event.entity_name !== 'Volunteer' || !data?.id) {
      return Response.json({ error: 'Invalid trigger payload' }, { status: 400 });
    }

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(data.id);
    if (!volunteer) {
      return Response.json({ error: 'Volunteer record not found' }, { status: 400 });
    }
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    
    // Build the formatted .docx (Mercy House Volunteer Application template)
    const docxBytes = await volunteerDocxBytes(volunteer);
    const driveFile = {
      id: await uploadVolunteerDocx(accessToken, VOLUNTEER_FOLDER_ID, volunteerFileName(volunteer), docxBytes),
    };
    console.log('File uploaded to Drive:', driveFile.id);

    // Save the Drive file ID to the volunteer record for later reference
    await base44.asServiceRole.entities.Volunteer.update(volunteer.id, {
      drive_file_id: driveFile.id,
      notes: (volunteer.notes || '') + `\n[Drive ID: ${driveFile.id}]`
    });

    // Send emails via Gmail to external addresses
    const emailBody = `A new volunteer application has been submitted.\n\nName: ${volunteer.full_name}\nEmail: ${volunteer.email}\nPhone: ${volunteer.phone}\n\nPlease review in the employee portal.`;

    try {
      const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
      
      const recipients = ['accounting@mercyatc.com', 'tmcniss@mercyhouseatc.com'];
      for (const recipient of recipients) {
        const message = [
          `To: ${recipient}`,
          `Subject: New Volunteer Application: ${sanitizeHeader(volunteer.full_name)}`,
          'Content-Type: text/plain; charset="UTF-8"',
          'Content-Transfer-Encoding: 7bit',
          '',
          emailBody
        ].join('\r\n');

        const encodedMessage = btoa(message);
        
        await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${gmailToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedMessage
          })
        });
      }
      console.log('Emails sent for volunteer application:', volunteer.id);
    } catch (emailError) {
      console.warn('Failed to send notification emails:', emailError.message);
      // Don't fail the entire function if emails fail
    }

    return Response.json({ status: 'success', file_id: driveFile.id });
  } catch (error) {
    console.error('Error processing volunteer submission:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});