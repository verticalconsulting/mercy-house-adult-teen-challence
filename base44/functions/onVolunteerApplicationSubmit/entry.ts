import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { sanitizeHeader } from '../../shared/security.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Trust boundary: this handler writes to Google Drive and sends email via
    // the app's OAuth connectors. The request payload is not trusted — only a
    // genuine entity-automation "create" event for a Volunteer is honored, and
    // the record is re-fetched from the database so an unauthenticated caller
    // cannot inject arbitrary content into Drive files or notification emails
    // (CWE-306).
    if (!event || event.type !== 'create' || event.entity_name !== 'Volunteer' || !data?.id) {
      return Response.json({ error: 'Invalid trigger payload' }, { status: 400 });
    }

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(data.id);
    if (!volunteer) {
      return Response.json({ error: 'Volunteer record not found' }, { status: 400 });
    }
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    
    // Create a text file with volunteer application details
    const fileContent = `VOLUNTEER APPLICATION SUBMISSION

Name: ${volunteer.full_name}
Email: ${volunteer.email}
Phone: ${volunteer.phone}
Date of Birth: ${volunteer.date_of_birth}
Address: ${volunteer.address}, ${volunteer.city}, ${volunteer.state} ${volunteer.zip}

Emergency Contact:
Name: ${volunteer.emergency_contact_name}
Phone: ${volunteer.emergency_contact_phone}
Relationship: ${volunteer.emergency_contact_relationship}

Availability: ${volunteer.availability?.join(', ') || 'Not specified'}
Areas of Interest: ${volunteer.areas_of_interest?.join(', ') || 'Not specified'}
Skills: ${volunteer.skills || 'None provided'}
Previous Experience: ${volunteer.previous_volunteer_experience || 'None provided'}
Why Volunteer: ${volunteer.why_volunteer || 'Not provided'}

Background Check Consent: ${volunteer.background_check_consent ? 'Yes' : 'No'}
Status: ${volunteer.status}

Application Submitted: ${new Date().toISOString()}
`;

    // Create metadata for the file
    const metadata = {
      name: `${volunteer.full_name}_Volunteer_Application.txt`,
      parents: ['1ODt9OQo1puP7y88HztmhzxpRzaAh5yXY']
    };

    // Create multipart body manually
    const boundary = '===============1234567890==';
    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    const filePart = `--${boundary}\r\nContent-Type: text/plain\r\n\r\n${fileContent}\r\n--${boundary}--`;
    const body = metadataPart + filePart;

    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`
      },
      body: body
    });

    if (!uploadRes.ok) {
      console.error('Drive upload error:', uploadRes.status, await uploadRes.text());
      return Response.json({ error: 'Failed to upload to Google Drive' }, { status: 500 });
    }

    const driveFile = await uploadRes.json();
    console.log('File uploaded to Drive:', driveFile.id);

    // Save the Drive file ID to the volunteer record for later reference
    await base44.asServiceRole.entities.Volunteer.update(volunteer.id, {
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