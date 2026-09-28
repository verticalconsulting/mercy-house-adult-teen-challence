import { createClientFromRequest } from 'npm:@base44/sdk@0.8.51';
import { verifyAutomationSecret } from '../../shared/security.ts';

const SHARED_DRIVE_ID = '0ACtAA90v7HENUk9PVA';
const ROOT_FOLDER_NAME = 'Intake Applications';

// Escape single quotes for Drive query strings
function escapeQ(value: string): string {
  return value.replace(/'/g, "\\'");
}

// Search for an existing folder by name within a parent in the shared Drive
async function findFolder(accessToken: string, name: string, parentId: string): Promise<string | null> {
  const q = `name = '${escapeQ(name)}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${escapeQ(parentId)}' in parents`;
  const params = new URLSearchParams({
    q,
    fields: 'files(id,name)',
    corpora: 'drive',
    driveId: SHARED_DRIVE_ID,
    includeItemsFromAllDrives: 'true',
    supportsAllDrives: 'true',
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

// Get or create a folder by name within a parent in the shared Drive
async function getOrCreateFolder(accessToken: string, name: string, parentId: string): Promise<string> {
  const existing = await findFolder(accessToken, name, parentId);
  if (existing) return existing;

  const res = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create folder "${name}": ${err}`);
  }
  const data = await res.json();
  return data.id;
}

function getMonthFolderName(): string {
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

function buildApplicationContent(app: any): string {
  const programLabel = app.application_type === 'mens_program' ? "Men's Program" : "Women's Program";
  return `MERCY HOUSE ADULT TEEN CHALLENGE — INTAKE APPLICATION
===============================================

Application ID: ${app.id}
Status: ${app.status}
Program: ${programLabel}
Submitted: ${app.submission_date || new Date(app.created_date).toLocaleDateString()}

PERSONAL INFORMATION
-------------------
Full Legal Name: ${app.full_legal_name}
Date of Birth: ${app.date_of_birth || 'N/A'}
Biological Sex: ${app.biological_sex || 'N/A'}
SSN: ${app.ssn || 'N/A'}
Address: ${app.address || ''}, ${app.city || ''}, ${app.state || ''} ${app.zip || ''}
Home Phone: ${app.home_phone || 'N/A'}
Cell Phone: ${app.cell_phone}
Email: ${app.email || 'N/A'}
Driver's License: ${app.drivers_license || 'N/A'}
Referral Source: ${app.referral_source || 'N/A'}

EMERGENCY CONTACT
----------------
Name: ${app.emergency_contact_name || 'N/A'}
Relationship: ${app.emergency_contact_relationship || 'N/A'}
Phone: ${app.emergency_contact_phone || 'N/A'}

LEGAL INFORMATION
-----------------
Under Legal Supervision: ${app.under_legal_supervision ? 'Yes' : 'No'}
Legally Mandated Treatment: ${app.legally_mandated_treatment ? 'Yes' : 'No'}
Pending Legal Matters: ${app.pending_legal_matters?.join(', ') || 'None'}
Sexual Offender Registry: ${app.sexual_offender_registry ? 'Yes' : 'No'}
Sexual Offense Charges: ${app.sexual_offense_charges ? 'Yes' : 'No'}
Arson Charges: ${app.arson_charges ? 'Yes' : 'No'}
Violent Offense Charges: ${app.violent_offense_charges ? 'Yes' : 'No'}

MEDICAL INFORMATION
-------------------
Health Insurance: ${app.has_health_insurance ? 'Yes' : 'No'}
Blood Type: ${app.blood_type || 'N/A'}
Legally Married: ${app.legally_married ? 'Yes' : 'No'}
Currently Treated by Physician: ${app.currently_treated_by_physician ? 'Yes' : 'No'}
Physician Details: ${app.physician_details || 'N/A'}
Manual Work Limitations: ${app.manual_work_limitations ? 'Yes' : 'No'}
Exercise Limitations: ${app.exercise_limitations ? 'Yes' : 'No'}
Recreational Limitations: ${app.recreational_limitations ? 'Yes' : 'No'}
Allergies: ${app.allergies || 'None'}
Mental Health Diagnosis: ${app.mental_health_diagnosis || 'None'}
Current Medications: ${app.current_medications || 'None'}
Possibly Pregnant: ${app.possibly_pregnant ? 'Yes' : 'No'}
Eating Disorder: ${app.eating_disorder ? 'Yes' : 'No'}

SUBSTANCE ABUSE
---------------
Previous Treatment Programs: ${app.previous_treatment_programs || 'None'}
Addiction Details: ${app.addiction_details || 'N/A'}

CONTACT PERSON
--------------
Name: ${app.contact_person_1_name || 'N/A'}
Relationship: ${app.contact_person_1_relationship || 'N/A'}
Phone: ${app.contact_person_1_phone || 'N/A'}
Email: ${app.contact_person_1_email || 'N/A'}

Signature: ${app.signature || 'N/A'}
`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reqBody = await req.json().catch(() => ({}));

    let applicationId: string;

    // Support both automation-triggered (workflow) and admin-triggered (manual) modes
    if (verifyAutomationSecret(reqBody)) {
      const { event, data } = reqBody;
      if (!event || event.type !== 'create' || event.entity_name !== 'Application' || !data?.id) {
        return Response.json({ error: 'Invalid trigger payload' }, { status: 400 });
      }
      applicationId = data.id;
    } else {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
      applicationId = reqBody.applicationId;
      if (!applicationId) {
        return Response.json({ error: 'Application ID required' }, { status: 400 });
      }
    }

    // Fetch application using service role (works in both modes)
    const app = await base44.asServiceRole.entities.Application.get(applicationId);
    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    // Skip if already uploaded to Drive
    if (app.drive_file_id) {
      return Response.json({
        success: true,
        message: 'Application already filed in Drive',
        fileId: app.drive_file_id,
      });
    }

    // Get Google Workspace access token (full drive scope)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googleworkspace');
    if (!accessToken) {
      return Response.json({ error: 'Google Workspace not authorized. Please connect the Google Workspace integration.' }, { status: 401 });
    }

    // Build folder structure: Intake Applications > [Program] > [Month]
    const rootFolderId = await getOrCreateFolder(accessToken, ROOT_FOLDER_NAME, SHARED_DRIVE_ID);
    const programName = app.application_type === 'mens_program' ? "Men's Program" : "Women's Program";
    const programFolderId = await getOrCreateFolder(accessToken, programName, rootFolderId);
    const monthFolderName = getMonthFolderName();
    const monthFolderId = await getOrCreateFolder(accessToken, monthFolderName, programFolderId);

    // Build file content
    const content = buildApplicationContent(app);
    const safeName = (app.full_legal_name || 'Applicant').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const fileName = `Application_${safeName}_${app.id.slice(-8)}.txt`;

    // Upload via multipart
    const boundary = '===============mh_intake_' + Date.now() + '==';
    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: fileName, mimeType: 'text/plain', parents: [monthFolderId] })}\r\n`;
    const filePart = `--${boundary}\r\nContent-Type: text/plain\r\n\r\n${content}\r\n--${boundary}--`;
    const body = metadataPart + filePart;

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body,
      }
    );

    if (!uploadRes.ok) {
      const error = await uploadRes.text();
      console.error('Drive upload error:', error);
      return Response.json({ error: 'Failed to upload to Google Drive' }, { status: 500 });
    }

    const driveFile = await uploadRes.json();

    // Save the Drive file ID to the application record
    await base44.asServiceRole.entities.Application.update(app.id, {
      drive_file_id: driveFile.id,
    });

    console.log(`Intake form filed: ${fileName} → ${ROOT_FOLDER_NAME} / ${programName} / ${monthFolderName}`);

    return Response.json({
      success: true,
      fileId: driveFile.id,
      fileName,
      folder: `${ROOT_FOLDER_NAME} / ${programName} / ${monthFolderName}`,
    });
  } catch (error) {
    console.error('Sync to Drive error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});