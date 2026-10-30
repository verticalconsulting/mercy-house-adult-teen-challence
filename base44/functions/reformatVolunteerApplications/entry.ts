import { createClientFromRequest } from 'npm:@base44/sdk@0.8.51';
import { verifyAutomationSecret } from '../../shared/security.ts';
import { volunteerDocxBytes, volunteerFileName, uploadVolunteerDocx } from '../../shared/volunteerDocx.ts';

const VOLUNTEER_FOLDER_ID = '1ODt9OQo1puP7y88HztmhzxpRzaAh5yXY';

// One-time backfill: re-files every existing volunteer application in the new
// Volunteer Application template. Original files in Drive are left untouched.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reqBody = await req.json().catch(() => ({}));

    if (!verifyAutomationSecret(reqBody)) {
      const user = await base44.auth.me().catch(() => null);
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const volunteers = await base44.asServiceRole.entities.Volunteer.list('created_date', 500);

    const results = [];
    for (const v of volunteers) {
      if (v.drive_file_id) {
        results.push({ name: v.full_name, skipped: 'already formatted' });
        continue;
      }
      const name = volunteerFileName(v);
      const fileId = await uploadVolunteerDocx(accessToken, VOLUNTEER_FOLDER_ID, name, await volunteerDocxBytes(v));
      await base44.asServiceRole.entities.Volunteer.update(v.id, {
        drive_file_id: fileId,
        notes: (v.notes || '') + `\n[Drive ID: ${fileId}]`,
      });
      results.push({ name: v.full_name, file: name, fileId });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    console.error('Volunteer reformat error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});