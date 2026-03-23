import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

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

        const applications = await base44.entities.Application.filter({ id: applicationId });
        const app = applications[0];

        if (!app) {
            return Response.json({ error: 'Application not found' }, { status: 404 });
        }

        const doc = new jsPDF();
        let y = 20;

        // Title
        doc.setFontSize(18);
        doc.text('Mercy House Application', 20, y);
        y += 10;

        // Metadata
        doc.setFontSize(10);
        doc.text(`Application ID: ${app.id}`, 20, y);
        y += 6;
        doc.text(`Status: ${app.status}`, 20, y);
        y += 6;
        doc.text(`Program: ${app.application_type === 'mens_program' ? "Men's" : "Women's"}`, 20, y);
        y += 10;

        // Section helper
        const addSection = (title, fields) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.text(title, 20, y);
            y += 8;
            doc.setFontSize(10);

            fields.forEach(({ label, value }) => {
                if (value && value !== 'undefined' && value !== 'null') {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`${label}:`, 20, y);
                    const lines = doc.splitTextToSize(String(value), 170);
                    doc.text(lines, 60, y);
                    y += 6 * lines.length;
                }
            });
            y += 5;
        };

        // Personal Information
        addSection('Personal Information', [
            { label: 'Name', value: app.full_legal_name },
            { label: 'DOB', value: app.date_of_birth },
            { label: 'Sex', value: app.biological_sex },
            { label: 'SSN', value: app.ssn },
            { label: 'Address', value: `${app.address}, ${app.city}, ${app.state} ${app.zip}` },
            { label: 'Cell Phone', value: app.cell_phone },
            { label: 'Email', value: app.email },
            { label: 'Driver\'s License', value: app.drivers_license }
        ]);

        // Legal Information
        addSection('Legal Information', [
            { label: 'Under Legal Supervision', value: app.under_legal_supervision ? 'Yes' : 'No' },
            { label: 'Legally Mandated Treatment', value: app.legally_mandated_treatment ? 'Yes' : 'No' },
            { label: 'Pending Legal Matters', value: app.pending_legal_matters?.join(', ') || 'None' },
            { label: 'Sexual Offender Registry', value: app.sexual_offender_registry ? 'Yes' : 'No' }
        ]);

        // Medical Information
        addSection('Medical Information', [
            { label: 'Health Insurance', value: app.has_health_insurance ? 'Yes' : 'No' },
            { label: 'Blood Type', value: app.blood_type },
            { label: 'Allergies', value: app.allergies },
            { label: 'Current Medications', value: app.current_medications },
            { label: 'Mental Health Diagnosis', value: app.mental_health_diagnosis }
        ]);

        // Addiction Details
        addSection('Substance Abuse', [
            { label: 'Previous Treatment', value: app.previous_treatment_programs },
            { label: 'Addiction Details', value: app.addiction_details }
        ]);

        const pdfBytes = doc.output('arraybuffer');

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=application_${app.full_legal_name.replace(/\s/g, '_')}.pdf`
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});