import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data, old_data } = await req.json();

    // Trust boundary: this handler moves Google Drive files and sends email
    // using the app's OAuth connectors. Only a genuine entity-automation
    // "update" event is honored, and the Drive file ID + recipient email are
    // read from the stored record (not the payload) so an unauthenticated
    // caller cannot move arbitrary Drive files or redirect the approval email
    // (CWE-306).
    if (!event || event.type !== 'update' || event.entity_name !== 'Volunteer' || !data?.id) {
      return Response.json({ error: 'Invalid trigger payload' }, { status: 400 });
    }

    // Only act on the approval transition (status changed TO 'approved'). Any
    // other update to a Volunteer record is a legitimate no-op — return
    // success so the platform does not log it as a failed execution.
    if (old_data?.status === 'approved') {
      return Response.json({ status: 'skipped', reason: 'not a new approval' });
    }

    const volunteer = await base44.asServiceRole.entities.Volunteer.get(data.id);
    if (!volunteer || volunteer.status !== 'approved') {
      return Response.json({ status: 'skipped', reason: 'volunteer not approved' });
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

    // Move file to the approved folder. Use the documented addParents query
    // parameter — setting `parents` in the PATCH body is not supported for
    // file updates and was causing the Drive API to reject the request.
    const approvedFolder = '1f5YYV7zoEbOoD2W4plurUhh2mzeACIun';
    const moveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?addParents=${approvedFolder}&supportsAllDrives=true&fields=id`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    );

    if (!moveRes.ok) {
      const moveErr = await moveRes.text();
      console.error('Drive move error:', moveRes.status, moveErr);
      return Response.json({ error: 'Failed to move file in Google Drive', details: moveErr }, { status: 500 });
    }

    console.log('File moved to approved folder:', driveFileId);

    // Send email to applicant
    if (volunteer.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
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