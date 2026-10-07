import { createClientFromRequest } from 'npm:@base44/sdk@0.8.51';
import { verifyAutomationSecret } from '../../shared/security.ts';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle
} from "npm:docx@8.5.0";

const SHARED_DRIVE_ID = '0ACtAA90v7HENUk9PVA';
const ROOT_FOLDER_NAME = 'Intake Applications';

const MEDICAL_CONDITIONS = [
  { value: 'asthma', label: 'Asthma' },
  { value: 'back_problems', label: 'Back Problems' },
  { value: 'celiac_disease', label: 'Celiac Disease' },
  { value: 'colitis', label: 'Colitis' },
  { value: 'crohns_disease', label: "Crohn's Disease" },
  { value: 'diabetes_type1', label: 'Diabetes Type 1' },
  { value: 'diabetes_type2', label: 'Diabetes Type 2' },
  { value: 'fetal_alcohol_syndrome', label: 'Fetal Alcohol Syndrome' },
  { value: 'gastric_bypass_surgery', label: 'Gastric Bypass Surgery' },
  { value: 'head_trauma_tbi', label: 'Head Trauma/TBI' },
  { value: 'heart_attack_stroke', label: 'Heart attack/Stroke' },
  { value: 'hepatitis', label: 'Hepatitis' },
  { value: 'high_blood_pressure', label: 'High Blood Pressure' },
  { value: 'hiv_aids', label: 'HIV/AIDS' },
  { value: 'pancreatitis', label: 'Pancreatitis' },
  { value: 'respiratory_problems', label: 'Respiratory Problems' },
  { value: 'seizure_disorder', label: 'Seizure Disorder/Withdrawal' },
  { value: 'sti_std', label: 'STI/STD' },
  { value: 'tuberculosis', label: 'Tuberculosis' },
];

const MENTAL_HEALTH_CONDITIONS = [
  { value: 'add_adhd', label: 'ADD/ADHD' },
  { value: 'anorexia', label: 'Anorexia' },
  { value: 'anti_social_personality', label: 'Anti-Social Personality Disorder' },
  { value: 'anxiety_panic', label: 'Anxiety Disorder/Panic Attacks' },
  { value: 'autism_aspergers', label: 'Autism/Asperger\u2019s' },
  { value: 'bipolar', label: 'Bipolar Disorder' },
  { value: 'borderline_personality', label: 'Borderline Personality Disorder' },
  { value: 'bulimia', label: 'Bulimia' },
  { value: 'depression', label: 'Depression' },
  { value: 'dissociative_identity', label: 'Dissociative Identity Disorder' },
  { value: 'narcissistic_personality', label: 'Narcissistic Personality Disorder' },
  { value: 'personality_disorder', label: 'Personality Disorder' },
  { value: 'ptsd_trauma', label: 'PTSD/Trauma' },
  { value: 'rape', label: 'Rape' },
  { value: 'schizoaffective', label: 'Schizoaffective Disorder' },
  { value: 'schizophrenia', label: 'Schizophrenia' },
  { value: 'sexual_abuse', label: 'Sexual Abuse' },
  { value: 'suicide_thoughts', label: 'Suicide Thoughts/Attempts' },
  { value: 'hallucinations', label: 'Hallucinations' },
];

function escapeQ(value: string): string {
  return value.replace(/'/g, "\\'");
}

async function findFolder(accessToken: string, name: string, parentId: string): Promise<string | null> {
  const q = `name = '${escapeQ(name)}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${escapeQ(parentId)}' in parents`;
  const params = new URLSearchParams({
    q, fields: 'files(id,name)', corpora: 'drive', driveId: SHARED_DRIVE_ID,
    includeItemsFromAllDrives: 'true', supportsAllDrives: 'true',
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

async function getOrCreateFolder(accessToken: string, name: string, parentId: string): Promise<string> {
  const existing = await findFolder(accessToken, name, parentId);
  if (existing) return existing;
  const res = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }),
  });
  if (!res.ok) throw new Error(`Failed to create folder "${name}": ${await res.text()}`);
  return (await res.json()).id;
}

function getMonthFolderName(): string {
  const now = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ---- docx helpers ----
const CK = (checked: boolean) => checked ? "\u2611" : "\u2610";
const NA = (v: any) => (v === null || v === undefined || v === '') ? 'N/A' : String(v);

function field(label: string, value: any): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: NA(value), size: 22 }),
    ],
    spacing: { after: 60 },
  });
}

function heading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26 })],
    spacing: { before: 280, after: 120 },
    border: { bottom: { color: "AAAAAA", space: 1, style: BorderStyle.SINGLE, size: 6 } },
  });
}

function body(text: string): Paragraph {
  return new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 80 } });
}

function buildDocx(app: any): Document {
  const programLabel = app.application_type === 'mens_program' ? "Men's Program" : "Women's Program";
  const children: Paragraph[] = [];

  // Title block
  children.push(new Paragraph({
    children: [new TextRun({ text: "MERCY HOUSE TEEN CHALLENGE", bold: true, size: 32 })],
    alignment: AlignmentType.CENTER, spacing: { after: 40 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Student Application \u2014 \u201cStrictly Confidential\u201d', italics: true, size: 24 })],
    alignment: AlignmentType.CENTER, spacing: { after: 40 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Program: ${programLabel}`, size: 22 })],
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
  }));

  // PERSONAL DATA
  children.push(heading("PERSONAL DATA AND INFORMATION"));
  children.push(field("Name", app.full_legal_name));
  children.push(field("Date", app.submission_date));
  children.push(field("Address", app.address));
  children.push(field("City", app.city));
  children.push(field("State", app.state));
  children.push(field("Zip Code", app.zip));
  children.push(field("Telephone (Residence)", app.home_phone));
  children.push(field("Telephone (Cell)", app.cell_phone));
  children.push(field("M/F Gender at Birth", app.biological_sex));
  children.push(field("Social Security No.", app.ssn));
  children.push(field("Birth Date", app.date_of_birth));
  children.push(field("Age", app.age));
  children.push(field("Email", app.email));
  children.push(field("Driver's License", app.drivers_license));
  if (app.drivers_license === 'yes') {
    children.push(field("Driver's License Number", app.drivers_license_number));
    children.push(field("License State", app.drivers_license_state));
  }
  if (app.drivers_license_explanation) {
    children.push(field("If no, explain", app.drivers_license_explanation));
  }

  // REFERRAL
  children.push(heading("WHO HAS REFERRED YOU TO TEEN CHALLENGE?"));
  children.push(field("Name", app.referral_name || app.referral_source));
  children.push(field("Relationship", app.referral_relationship));
  children.push(field("Address", app.referral_address));

  // MEDICAL HISTORY
  children.push(heading("Medical History Form"));
  children.push(field("Name", app.full_legal_name));
  children.push(field("DOB", app.date_of_birth));
  children.push(new Paragraph({ children: [new TextRun({ text: "Medical History (mark all diagnosed):", bold: true, size: 22 })], spacing: { before: 120, after: 60 } }));
  for (const c of MEDICAL_CONDITIONS) {
    children.push(new Paragraph({
      children: [new TextRun({ text: `${CK(app.medical_history_conditions?.includes(c.value))} ${c.label}`, size: 22 })],
      spacing: { after: 30 },
    }));
  }
  children.push(new Paragraph({ children: [new TextRun({ text: "Mental Health History (mark all diagnosed):", bold: true, size: 22 })], spacing: { before: 120, after: 60 } }));
  for (const c of MENTAL_HEALTH_CONDITIONS) {
    let line = `${CK(app.mental_health_conditions?.includes(c.value))} ${c.label}`;
    if (c.value === 'anorexia' && app.mental_health_conditions?.includes('anorexia')) {
      line += `  (active? ${CK(!!app.anorexia_active)} Yes)`;
    }
    if (c.value === 'bulimia' && app.mental_health_conditions?.includes('bulimia')) {
      line += `  (active? ${CK(!!app.bulimia_active)} Yes)`;
    }
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })], spacing: { after: 30 } }));
  }
  children.push(body("If a dental or medical need arises, it is my duty to contact a staff member immediately."));
  children.push(field("Signature", app.medical_history_signature));
  children.push(field("Date", app.medical_history_date));

  // EMERGENCY MEDICAL CARE CONSENT
  children.push(heading("EMERGENCY MEDICAL CARE CONSENT FORM"));
  children.push(field("Name of New Student", app.full_legal_name));
  children.push(field("Drug/Food/Environmental Allergies", app.allergies));
  children.push(new Paragraph({ children: [new TextRun({ text: "Emergency Contact 1:", bold: true, size: 22 })], spacing: { before: 100, after: 40 } }));
  children.push(field("Name", app.emergency_contact_name));
  children.push(field("Address", [app.emergency_contact_1_address, app.emergency_contact_1_city, app.emergency_contact_1_state, app.emergency_contact_1_zip].filter(Boolean).join(", ")));
  children.push(field("Phone", app.emergency_contact_phone));
  children.push(field("Relationship", app.emergency_contact_relationship));
  children.push(new Paragraph({ children: [new TextRun({ text: "Emergency Contact 2:", bold: true, size: 22 })], spacing: { before: 100, after: 40 } }));
  children.push(field("Name", app.emergency_contact_2_name));
  children.push(field("Address", [app.emergency_contact_2_address, app.emergency_contact_2_city, app.emergency_contact_2_state, app.emergency_contact_2_zip].filter(Boolean).join(", ")));
  children.push(field("Phone", app.emergency_contact_2_phone));
  children.push(field("Relationship", app.emergency_contact_2_relationship));
  children.push(field("Signature of Student", app.emergency_consent_signature));
  children.push(field("Date", app.emergency_consent_date));
  children.push(body("**This form expires upon graduation or discharge of the student from Mercy House Teen Challenge"));

  // CORRESPONDENCE AUTHORIZATION
  children.push(heading("Correspondence, Phone, & Visitation Authorization"));
  children.push(field("Student's name", app.full_legal_name));
  children.push(field("Date", app.submission_date));
  const corr = app.correspondence_auth || [];
  for (let i = 0; i < 5; i++) {
    const e = corr[i] || {};
    children.push(new Paragraph({
      children: [new TextRun({ text: `${i + 1}) Name: ${e.name || ''}    Relationship: ${e.relationship || ''}`, size: 22 })],
      spacing: { before: 60, after: 30 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: `   Phone: ${e.phone || ''}    Approved: ${CK(e.approved === true)} Yes  ${CK(e.approved === false)} No`, size: 22 })],
      spacing: { after: 30 },
    }));
  }

  // MEDICAL & DENTAL ACKNOWLEDGEMENT
  children.push(heading("MEDICAL & DENTAL ACKNOWLEDGEMENT"));
  children.push(body("I understand that during my stay at Mercy House Teen Challenge, I will be required to follow all program guidelines and expectations. I may be asked to participate in physically demanding activities, and I affirm that I am in good physical health and do not currently require dental care. I also acknowledge that if a pre existing illness or medical condition limits my ability to participate fully in the program, I may be required to leave until the condition is resolved and medical or dental clearance to return is provided by a licensed Medical Doctor or Dentist."));
  children.push(field("Acknowledged", app.medical_dental_acknowledged ? "Yes" : "No"));
  children.push(field("Student's signature", app.medical_dental_signature));
  children.push(field("Date", app.medical_dental_date));

  // INTAKE FEE AGREEMENT
  children.push(heading("Intake Fee Agreement Form"));
  children.push(body("Mercy House Adult and Teen Challenge is not a free program. I understand this is a twelve month minimum program with a required program fee of $1,000, which must be paid in full by the end of Third Phase. Payment arrangements may be made on a case by case basis, and families are requested to assist with program costs when able."));
  const feeOpts = [
    { value: 'paid_full', label: 'Paid in Full $1,000.00' },
    { value: '250_down_75_monthly', label: '$250 down plus $75/monthly for 10 months' },
    { value: '10_payments_100', label: '10 payments of $100/monthly' },
    { value: 'financial_hardship', label: 'Financial Hardship' },
  ];
  for (const o of feeOpts) {
    children.push(new Paragraph({ children: [new TextRun({ text: `${CK(app.intake_fee_option === o.value)} ${o.label}`, size: 22 })], spacing: { after: 30 } }));
  }
  children.push(field("Acknowledged", app.intake_fee_acknowledged ? "Yes" : "No"));
  if (app.intake_fee_hardship_explanation) children.push(field("Hardship Explanation", app.intake_fee_hardship_explanation));
  children.push(field("Signature", app.intake_fee_signature));
  children.push(field("Date", app.intake_fee_date));

  // STUDENT'S RIGHTS
  children.push(heading("STUDENT'S RIGHTS"));
  children.push(body("As an incoming student at Mercy House Teen Challenge, you are hereby advised of your rights in this program. This is a voluntary program, and you are free to leave at any time. There will be no restraints used at any time. The student has the right to personal privacy, humane and safe environments, and to be treated with dignity. No student shall be deprived of civil rights by reason of treatment. The student shall not be discriminated against. The student shall have the right to inspect his record. The student will have the right to a grievance procedure."));
  children.push(field("Acknowledged", app.student_rights_acknowledged ? "Yes" : "No"));
  children.push(field("Student's signature", app.student_rights_signature));
  children.push(field("Date", app.student_rights_date));

  // CIVIL RIGHTS WAIVER
  children.push(heading("CIVIL RIGHTS WAIVER ACKNOWLEDGMENT"));
  children.push(body("I understand that I have civil rights, including the right to confidential communication by phone and mail and the right to practice the religion of my choice. I acknowledge that Mercy House Teen Challenge is an evangelical Christian discipleship ministry serving individuals with life controlling problems. As such, I understand and agree to participate in Christian religious activities coordinated by the ministry as part of the program. I voluntarily consent to these procedures and acknowledge that I fully understand my rights and any limitations placed upon them while participating in the program."));
  children.push(field("Acknowledged", app.civil_rights_acknowledged ? "Yes" : "No"));
  children.push(field("Student's signature", app.civil_rights_signature));
  children.push(field("Date", app.civil_rights_date));

  // MARKETING AUTHORIZATION
  children.push(heading("AUTHORIZATION TO USE/DISCLOSE PROTECTED INFORMATION FOR MARKETING"));
  children.push(body("I hereby authorize Mercy House Adult and Teen Challenge (MHATC) and its sublicenses, affiliates, and legal representatives to use and/or disclose protected information including my recovery story for promotional, inspirational, educational and/or informational purposes. I specifically authorize the use and/or disclosure of my name, details about my addiction, recovery, and my story, my appearance on camera, in still photos, or video footage for use in publications, web sites, audio, video, television commercial, advertising, or film. I agree that any images provided by me or recorded of me in whole or part become the sole property of MHATC in perpetuity."));
  children.push(field("Authorized", app.marketing_authorized ? "Yes" : "No"));
  children.push(field("Student Signature", app.marketing_signature));
  children.push(field("Date", app.marketing_date));

  // DRUG TESTING POLICY
  children.push(heading("ALCOHOL, DRUG AND TOBACCO TESTING POLICY"));
  children.push(body("Mercy House Teen Challenge reserves the right to conduct random drug testing. Students are expected to remain committed to their recovery and to follow all program rules, including a strict policy prohibiting the use of drugs or tobacco products of any kind. If staff reasonably suspect that a student is under the influence of a mood altering substance or has used tobacco products, the student may be directed to report to the staff on duty and voluntarily submit to a urine drug screening. If the test indicates substance use, this will be considered grounds for immediate dismissal."));
  children.push(field("Acknowledged", app.drug_testing_acknowledged ? "Yes" : "No"));
  children.push(field("Student's signature", app.drug_testing_signature));
  children.push(field("Date", app.drug_testing_date));

  // VOCATIONAL TRAINING
  children.push(heading("STUDENT ACKNOWLEDGEMENT AND AGREEMENT REGARDING VOCATIONAL TRAINING"));
  children.push(body("I understand that as a Mercy House Teen Challenge student, I am not responsible for paying monthly living expenses. Any revenue generated through work performed while enrolled in the program will belong to Mercy House Teen Challenge. I understand that admission requires participation in the program's Work Therapy and Vocational Training component. I acknowledge that all work assignments are part of vocational training and are performed solely for my personal development, recovery, and readiness to return to the workforce. I am not considered an employee of Mercy House Teen Challenge."));
  children.push(field("Acknowledged", app.vocational_training_acknowledged ? "Yes" : "No"));
  children.push(field("Student Signature", app.vocational_training_signature));
  children.push(field("Date", app.vocational_training_date));

  // ADDITIONAL MEDICAL INFO
  children.push(heading("ADDITIONAL MEDICAL INFORMATION"));
  children.push(field("Health Insurance", app.has_health_insurance ? "Yes" : "No"));
  children.push(field("Blood Type", app.blood_type));
  children.push(field("Legally Married", app.legally_married ? "Yes" : "No"));
  children.push(field("Currently Treated by Physician", app.currently_treated_by_physician ? "Yes" : "No"));
  children.push(field("Physician Details", app.physician_details));
  children.push(field("Manual Work Limitations", app.manual_work_limitations ? "Yes" : "No"));
  children.push(field("Exercise Limitations", app.exercise_limitations ? "Yes" : "No"));
  children.push(field("Recreational Limitations", app.recreational_limitations ? "Yes" : "No"));
  children.push(field("Mental Health Diagnosis (notes)", app.mental_health_diagnosis));
  children.push(field("Current Medications", app.current_medications));
  if (app.application_type === 'womens_program') children.push(field("Possibly Pregnant", app.possibly_pregnant ? "Yes" : "No"));
  children.push(field("Eating Disorder", app.eating_disorder ? "Yes" : "No"));

  // LEGAL
  children.push(heading("LEGAL INFORMATION"));
  children.push(field("Under Legal Supervision", app.under_legal_supervision ? "Yes" : "No"));
  children.push(field("Legally Mandated Treatment", app.legally_mandated_treatment ? "Yes" : "No"));
  children.push(field("Pending Legal Matters", app.pending_legal_matters?.join(", ") || "None"));
  children.push(field("Sexual Offender Registry", app.sexual_offender_registry ? "Yes" : "No"));
  children.push(field("Sexual Offense Charges", app.sexual_offense_charges ? "Yes" : "No"));
  children.push(field("Arson Charges", app.arson_charges ? "Yes" : "No"));
  children.push(field("Violent Offense Charges", app.violent_offense_charges ? "Yes" : "No"));

  // SUBSTANCE ABUSE
  children.push(heading("SUBSTANCE ABUSE & TREATMENT HISTORY"));
  children.push(field("Previous Treatment Programs", app.previous_treatment_programs));
  children.push(field("Addiction Details", app.addiction_details));

  // CONTACT PERSON
  children.push(heading("CONTACT PERSON"));
  children.push(field("Name", app.contact_person_1_name));
  children.push(field("Relationship", app.contact_person_1_relationship));
  children.push(field("Phone", app.contact_person_1_phone));
  children.push(field("Email", app.contact_person_1_email));

  // SIGNATURE
  children.push(heading("APPLICATION SIGNATURE"));
  children.push(field("Signature", app.signature));
  children.push(field("Date", app.submission_date));
  children.push(field("Condensed Submission", app.condensed_mode ? "Yes" : "No"));
  children.push(field("Application ID", app.id));

  return new Document({ sections: [{ children }] });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reqBody = await req.json().catch(() => ({}));
    let applicationId: string;

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
      if (!applicationId) return Response.json({ error: 'Application ID required' }, { status: 400 });
    }

    const app = await base44.asServiceRole.entities.Application.get(applicationId);
    if (!app) return Response.json({ error: 'Application not found' }, { status: 404 });

    if (app.drive_file_id) {
      return Response.json({ success: true, message: 'Application already filed in Drive', fileId: app.drive_file_id });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googleworkspace');
    if (!accessToken) {
      return Response.json({ error: 'Google Workspace not authorized.' }, { status: 401 });
    }

    const rootFolderId = await getOrCreateFolder(accessToken, ROOT_FOLDER_NAME, SHARED_DRIVE_ID);
    const programName = app.application_type === 'mens_program' ? "Men's Program" : "Women's Program";
    const programFolderId = await getOrCreateFolder(accessToken, programName, rootFolderId);
    const monthFolderName = getMonthFolderName();
    const monthFolderId = await getOrCreateFolder(accessToken, monthFolderName, programFolderId);

    // Generate .docx
    const doc = buildDocx(app);
    const docxBuffer = await Packer.toBuffer(doc);
    const docxBytes = new Uint8Array(docxBuffer);

    const safeName = (app.full_legal_name || 'Applicant').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const fileName = `Application_${safeName}_${app.id.slice(-8)}.docx`;

    // Multipart upload to Drive
    const boundary = '===============mh_intake_' + Date.now() + '==';
    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: fileName, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', parents: [monthFolderId] })}\r\n`;
    const fileHeader = `--${boundary}\r\nContent-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n`;
    const bodyBytes = new TextEncoder().encode(metadataPart + fileHeader);
    const tailBytes = new TextEncoder().encode(`\r\n--${boundary}--`);

    const fullBody = new Uint8Array(bodyBytes.length + docxBytes.length + tailBytes.length);
    fullBody.set(bodyBytes, 0);
    fullBody.set(docxBytes, bodyBytes.length);
    fullBody.set(tailBytes, bodyBytes.length + docxBytes.length);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body: fullBody,
      }
    );

    if (!uploadRes.ok) {
      const error = await uploadRes.text();
      console.error('Drive upload error:', error);
      return Response.json({ error: 'Failed to upload to Google Drive' }, { status: 500 });
    }

    const driveFile = await uploadRes.json();
    await base44.asServiceRole.entities.Application.update(app.id, { drive_file_id: driveFile.id });

    console.log(`Intake form filed: ${fileName} → ${ROOT_FOLDER_NAME} / ${programName} / ${monthFolderName}`);

    return Response.json({
      success: true, fileId: driveFile.id, fileName,
      folder: `${ROOT_FOLDER_NAME} / ${programName} / ${monthFolderName}`,
    });
  } catch (error) {
    console.error('Sync to Drive error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});