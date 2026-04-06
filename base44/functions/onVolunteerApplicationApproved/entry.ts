import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data, old_data } = await req.json();

    if (!data || !data.id) {
      return Response.json({ error: 'Invalid volunteer data' }, { status: 400 });
    }

    const volunteer = data;

    // Extract Drive file ID from notes
    const notesMatch = volunteer.notes?.match(/\[Drive ID: ([^\]]+)\]/);
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