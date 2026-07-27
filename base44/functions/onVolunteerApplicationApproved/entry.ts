import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Trust boundary: this handler moves Google Drive files and sends email
    // using the app's OAuth connectors. The request payload is not trusted —
    // only a genuine entity-automation "update" event for a Volunteer that is
    // actually approved in the database is acted on, and the Drive file ID and
    // recipient email are read from the stored record (not the payload). This
    // prevents an unauthenticated caller from moving arbitrary Drive files or
    // redirecting the approval email (CWE-306).
    if (!event || event.type !== 'update' || event.entity_name !== 'Volunteer' || !data?.id) {
      return Response.json({ error: 'Invalid trigger payload' }, { status: 400 });
    }

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(data.id);
    if (!volunteer || volunteer.status !== 'approved') {
      return Response.json({ error: 'Volunteer not approved' }, { status: 400 });
    }

    // Extract Drive file ID from the stored notes; validate the charset to
    // avoid path manipulation in the Drive API URL.
    const notesMatch = volunteer.notes?.match(/\[Drive ID: ([A-Za-z0-9_-]+)\]/);
    const driveFileId = notesMatch ? notesMatch[1] : null;

    if (!driveFileId) {
      console.warn('No Drive file ID found for volunteer:', volunteer.id);
      return Response.json({ error: 'Drive file ID not found' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Move file to approved folder
    const moveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?supportsAllDrives=true`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parents: ['1f5YYV7zoEbOoD2W4plurUhh2mzeACIun']
        })
      }
    );

    if (!moveRes.ok) {
      console.error('Drive move error:', moveRes.status, await moveRes.text());
      return Response.json({ error: 'Failed to move file in Google Drive' }, { status: 500 });
    }

    console.log('File moved to approved folder:', driveFileId);

    // Send email to applicant
    if (volunteer.email) {
      await base44.integrations.Core.SendEmail({
        to: volunteer.email,
        subject: 'Your Volunteer Application Has Been Approved',
        body: `Dear ${volunteer.full_name},\n\nGreat news! Your volunteer application has been approved.\n\nWe look forward to having you join our team. A member of our staff will be in touch shortly with next steps.\n\nThank you for your interest in Mercy House!\n\nBest regards,\nMercy House Team`
      });

      console.log('Approval email sent to:', volunteer.email);
    }

    return Response.json({ status: 'success', file_id: driveFileId });
  } catch (error) {
    console.error('Error processing volunteer approval:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});