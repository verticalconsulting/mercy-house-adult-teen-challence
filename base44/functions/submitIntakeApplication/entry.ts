import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { sanitizeHeader } from '../../shared/security.ts';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const formData = await req.json();

        // Save application to database (service role so public users can submit)
        const application = await base44.asServiceRole.entities.Application.create(formData);

        // --- Gmail notification ---
        try {
            const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
            const program = formData.application_type === 'mens_program' ? "Men's" : "Women's";
            const esc = (v) => String(v ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            const subject = `New ${program} Program Application - ${sanitizeHeader(formData.full_legal_name)}`;
            const bodyHtml = `
<h2>New Intake Application Received</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td><strong>Program</strong></td><td>${esc(program)} Campus</td></tr>
  <tr><td><strong>Name</strong></td><td>${esc(formData.full_legal_name)}</td></tr>
  <tr><td><strong>Date of Birth</strong></td><td>${esc(formData.date_of_birth || '—')}</td></tr>
  <tr><td><strong>Cell Phone</strong></td><td>${esc(formData.cell_phone)}</td></tr>
  <tr><td><strong>Email</strong></td><td>${esc(formData.email || '—')}</td></tr>
  <tr><td><strong>City / State</strong></td><td>${esc(formData.city || '—')}, ${esc(formData.state || '—')}</td></tr>
  <tr><td><strong>Condensed Submission</strong></td><td>${formData.condensed_mode ? 'Yes' : 'No'}</td></tr>
  <tr><td><strong>Application ID</strong></td><td>${esc(application.id)}</td></tr>
</table>
<p>Please review in the <strong>Employee Portal</strong>.</p>
`;
            const raw = buildMimeMessage('intake@mercyhouse.org', subject, bodyHtml);
            await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${gmailToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ raw })
            });
        } catch (emailErr) {
            console.error('Gmail error:', emailErr.message);
        }

        // --- Google Drive upload ---
        try {
            const { accessToken: driveToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
            const content = buildDriveContent(formData, application.id);
            const fileName = `Application_${formData.full_legal_name.replace(/\s+/g, '_')}_${application.id}.txt`;
            const fileMetadata = { name: fileName, mimeType: 'text/plain' };
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
            form.append('file', new Blob([content], { type: 'text/plain' }));
            const driveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${driveToken}` },
                body: form
            });
            if (!driveRes.ok) {
                const err = await driveRes.text();
                console.error('Drive upload error:', err);
            }
        } catch (driveErr) {
            console.error('Drive error:', driveErr.message);
        }

        return Response.json({ success: true, id: application.id });
    } catch (error) {
        console.error('submitIntakeApplication error:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

function buildDriveContent(app, id) {
    return `MERCY HOUSE INTAKE APPLICATION
================================
Application ID: ${id}
Program: ${app.application_type === 'mens_program' ? "Men's Program" : "Women's Program"}
Condensed Submission: ${app.condensed_mode ? 'Yes' : 'No'}
Submitted: ${new Date().toLocaleString()}

PERSONAL INFORMATION
--------------------
Name: ${app.full_legal_name}
Date of Birth: ${app.date_of_birth || 'Not provided'}
Biological Sex: ${app.biological_sex || 'Not provided'}
SSN: ${app.ssn || 'Not provided'}
Address: ${app.address || ''}, ${app.city || ''}, ${app.state || ''} ${app.zip || ''}
Cell Phone: ${app.cell_phone}
Home Phone: ${app.home_phone || '—'}
Email: ${app.email || '—'}
Driver's License: ${app.drivers_license || '—'}
Referral Source: ${app.referral_source || '—'}

EMERGENCY CONTACT
-----------------
Name: ${app.emergency_contact_name || '—'}
Relationship: ${app.emergency_contact_relationship || '—'}
Phone: ${app.emergency_contact_phone || '—'}

CONTACT PERSON
--------------
Name: ${app.contact_person_1_name || '—'}
Relationship: ${app.contact_person_1_relationship || '—'}
Phone: ${app.contact_person_1_phone || '—'}
Email: ${app.contact_person_1_email || '—'}

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
Blood Type: ${app.blood_type || '—'}
Legally Married: ${app.legally_married ? 'Yes' : 'No'}
Treated by Physician: ${app.currently_treated_by_physician ? 'Yes' : 'No'}
Physician Details: ${app.physician_details || '—'}
Manual Work Limitations: ${app.manual_work_limitations ? 'Yes' : 'No'}
Exercise Limitations: ${app.exercise_limitations ? 'Yes' : 'No'}
Recreational Limitations: ${app.recreational_limitations ? 'Yes' : 'No'}
Allergies: ${app.allergies || 'None'}
Mental Health Diagnosis: ${app.mental_health_diagnosis || 'None'}
Current Medications: ${app.current_medications || 'None'}
Possibly Pregnant: ${app.possibly_pregnant ? 'Yes' : 'No'}
Eating Disorder: ${app.eating_disorder ? 'Yes' : 'No'}

SUBSTANCE ABUSE & TREATMENT HISTORY
------------------------------------
Previous Treatment Programs: ${app.previous_treatment_programs || 'Not provided'}
Addiction Details: ${app.addiction_details || 'Not provided'}

SIGNATURE
---------
Signature: ${app.signature}
Date: ${app.submission_date}
`;
}

function buildMimeMessage(to, subject, htmlBody) {
    const message = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        htmlBody
    ].join('\r\n');
    return btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}