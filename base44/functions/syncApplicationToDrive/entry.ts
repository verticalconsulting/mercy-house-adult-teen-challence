import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { applicationId } = await req.json();

        if (!applicationId) {
            return Response.json({ error: 'Application ID required' }, { status: 400 });
        }

        // Get access token for Google Drive
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');

        if (!accessToken) {
            return Response.json({ error: 'Google Drive not authorized. Please connect Google Drive integration first.' }, { status: 401 });
        }

        // Fetch application
        const applications = await base44.entities.Application.filter({ id: applicationId });
        const app = applications[0];

        if (!app) {
            return Response.json({ error: 'Application not found' }, { status: 404 });
        }

        // Create text content for the application
        const content = `
MERCY HOUSE APPLICATION
========================

Application ID: ${app.id}
Status: ${app.status}
Program: ${app.application_type === 'mens_program' ? "Men's Program" : "Women's Program"}
Submitted: ${new Date(app.created_date).toLocaleString()}

PERSONAL INFORMATION
-------------------
Name: ${app.full_legal_name}
Date of Birth: ${app.date_of_birth}
Biological Sex: ${app.biological_sex}
SSN: ${app.ssn}
Address: ${app.address}, ${app.city}, ${app.state} ${app.zip}
Cell Phone: ${app.cell_phone}
Email: ${app.email}
Driver's License: ${app.drivers_license}

EMERGENCY CONTACT
----------------
Name: ${app.emergency_contact_name}
Relationship: ${app.emergency_contact_relationship}
Phone: ${app.emergency_contact_phone}

LEGAL INFORMATION
-----------------
Under Legal Supervision: ${app.under_legal_supervision ? 'Yes' : 'No'}
Legally Mandated Treatment: ${app.legally_mandated_treatment ? 'Yes' : 'No'}
Pending Legal Matters: ${app.pending_legal_matters?.join(', ') || 'None'}
Sexual Offender Registry: ${app.sexual_offender_registry ? 'Yes' : 'No'}

MEDICAL INFORMATION
-------------------
Health Insurance: ${app.has_health_insurance ? 'Yes' : 'No'}
Blood Type: ${app.blood_type || 'N/A'}
Allergies: ${app.allergies || 'None'}
Current Medications: ${app.current_medications || 'None'}
Mental Health Diagnosis: ${app.mental_health_diagnosis || 'None'}

SUBSTANCE ABUSE
---------------
Previous Treatment Programs: ${app.previous_treatment_programs || 'None'}
Addiction Details: ${app.addiction_details || 'N/A'}
`;

        // Create file in Google Drive
        const fileName = `Application_${app.full_legal_name.replace(/\s/g, '_')}_${app.id}.txt`;
        
        const fileMetadata = {
            name: fileName,
            mimeType: 'text/plain'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
        form.append('file', new Blob([content], { type: 'text/plain' }));

        const driveResponse = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: form
            }
        );

        if (!driveResponse.ok) {
            const error = await driveResponse.text();
            console.error('Drive upload error:', error);
            return Response.json({ error: 'Failed to upload to Google Drive' }, { status: 500 });
        }

        const driveFile = await driveResponse.json();

        return Response.json({
            success: true,
            fileId: driveFile.id,
            fileName: fileName
        });
    } catch (error) {
        console.error('Sync error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});