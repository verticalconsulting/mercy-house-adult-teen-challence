import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { sanitizeHeader } from '../../shared/security.ts';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const formData = await req.json();

        // Allowlist of applicant-suppliable fields only. Iterate the allowlist
        // (not the request body) so no attacker-controlled key can ever reach the
        // create() sink — prevents mass assignment of administrative fields like
        // status / assigned_to, and blocks prototype-pollution keys (__proto__).
        const ALLOWED_FIELDS = [
            'application_type', 'full_legal_name', 'date_of_birth', 'age', 'biological_sex',
            'ssn', 'address', 'city', 'state', 'zip', 'home_phone', 'cell_phone',
            'email', 'drivers_license', 'drivers_license_number', 'drivers_license_state',
            'drivers_license_explanation', 'referral_source',
            'referral_name', 'referral_relationship', 'referral_address',
            'contact_person_1_name', 'contact_person_1_relationship',
            'contact_person_1_phone', 'contact_person_1_email',
            'under_legal_supervision', 'legally_mandated_treatment',
            'pending_legal_matters', 'sexual_offender_registry',
            'sexual_offense_charges', 'arson_charges', 'violent_offense_charges',
            'has_health_insurance', 'blood_type', 'legally_married',
            'emergency_contact_name', 'emergency_contact_phone',
            'emergency_contact_relationship',
            'emergency_contact_1_address', 'emergency_contact_1_city',
            'emergency_contact_1_state', 'emergency_contact_1_zip',
            'emergency_contact_2_name', 'emergency_contact_2_phone',
            'emergency_contact_2_relationship', 'emergency_contact_2_address',
            'emergency_contact_2_city', 'emergency_contact_2_state', 'emergency_contact_2_zip',
            'emergency_consent_signature', 'emergency_consent_date',
            'currently_treated_by_physician', 'physician_details',
            'manual_work_limitations', 'exercise_limitations', 'recreational_limitations',
            'allergies', 'mental_health_diagnosis', 'current_medications',
            'possibly_pregnant', 'eating_disorder',
            'medical_history_conditions', 'mental_health_conditions',
            'anorexia_active', 'bulimia_active',
            'medical_history_signature', 'medical_history_date',
            'correspondence_auth',
            'medical_dental_acknowledged', 'medical_dental_signature', 'medical_dental_date',
            'intake_fee_option', 'intake_fee_acknowledged', 'intake_fee_hardship_explanation', 'intake_fee_signature', 'intake_fee_date',
            'student_rights_acknowledged', 'student_rights_signature', 'student_rights_date',
            'civil_rights_acknowledged', 'civil_rights_signature', 'civil_rights_date',
            'marketing_authorized', 'marketing_signature', 'marketing_date',
            'drug_testing_acknowledged', 'drug_testing_signature', 'drug_testing_date',
            'vocational_training_acknowledged', 'vocational_training_signature', 'vocational_training_date',
            'previous_treatment_programs', 'addiction_details', 'signature',
            'submission_date', 'description', 'condensed_mode'
        ];
        const sanitized = {};
        for (const key of ALLOWED_FIELDS) {
            if (key in formData) sanitized[key] = formData[key];
        }
        // Administrative fields are always controlled by staff — never by submitter.
        sanitized.status = 'pending';

        // Save application to database (service role so public users can submit)
        const application = await base44.asServiceRole.entities.Application.create(sanitized);

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
            const raw = buildMimeMessage('intake@mercyhouse.com', subject, bodyHtml);
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

        // Google Drive .docx sync is handled by the "Intake Application Drive Sync"
        // workflow, which fires on Application create and calls syncApplicationToDrive.
        // That function generates a .docx mirroring the master application form and
        // files it in the shared team Drive (Intake Applications > Program > Month).

        return Response.json({ success: true, id: application.id });
    } catch (error) {
        console.error('submitIntakeApplication error:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

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