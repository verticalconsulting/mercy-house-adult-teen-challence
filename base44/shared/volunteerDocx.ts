import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType,
} from "npm:docx@8.5.0";

// Builds the "Mercy House Teen Challenge — Volunteer Application" document that
// mirrors the printed template (Applicant Information, Other Information,
// References, Disclaimer and Signature, Consent and Release).

const PAGE_WIDTH = 10800; // letter width minus 0.5" margins, in dxa
const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const LINE = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
const SIZE = 20;

const str = (v: any) => (v === null || v === undefined ? '' : String(v).trim());
const box = (checked: boolean) => (checked ? "\u2612" : "\u2610");

function pretty(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
function list(values: any) {
  return Array.isArray(values) && values.length ? values.map((v) => pretty(String(v))).join(', ') : '';
}
function formatDate(value: any) {
  const s = str(value);
  if (!s) return '';
  const d = new Date(s.length === 10 ? `${s}T12:00:00` : s);
  if (isNaN(d.getTime())) return s;
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}
// "Judd Durward Moss" -> { last: "Moss", first: "Judd", mi: "D" }
function splitName(full: string) {
  const parts = str(full).split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { last: '', first: parts[0] || '', mi: '' };
  const last = parts[parts.length - 1];
  const first = parts[0];
  const mi = parts.length > 2 ? parts[1][0].toUpperCase() : '';
  return { last, first, mi };
}

function run(text: string, o: any = {}) {
  return new TextRun({ text, size: SIZE, font: "Arial", ...o });
}
function para(text: string, o: any = {}, p: any = {}) {
  return new Paragraph({ children: [run(text, o)], spacing: { after: 80 }, ...p });
}
function bar(text: string) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { type: ShadingType.CLEAR, fill: "5B5B5B", color: "auto" },
    spacing: { before: 200, after: 120 },
    children: [run(text, { bold: true, color: "FFFFFF", size: 22 })],
  });
}
function cell(children: Paragraph[], width: number, underline = false) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: NONE, left: NONE, right: NONE, bottom: underline ? LINE : NONE },
    margins: { top: 40, bottom: 20, left: 60, right: 60 },
    children,
  });
}
type Item = { label: string; value?: any; w: number; yesNo?: boolean | null };

// One table row of "Label ______" pairs. `w` is the pair's share of the row (sums to 100).
function fieldRow(items: Item[]) {
  const cells: TableCell[] = [];
  const widths: number[] = [];
  for (const it of items) {
    const total = Math.round((it.w / 100) * PAGE_WIDTH);
    const labelW = Math.min(Math.round(total * 0.5), it.label.length * 105 + 140);
    const valueW = total - labelW;
    widths.push(labelW, valueW);
    cells.push(cell([para(it.label, {}, { spacing: { after: 0 } })], labelW));
    if (it.yesNo !== undefined) {
      const v = it.yesNo;
      cells.push(cell([para(`${box(v === true)} YES     ${box(v === false)} NO`, {}, { spacing: { after: 0 } })], valueW));
    } else {
      const lines = str(it.value).split('\n');
      cells.push(cell(lines.map((l) => para(l, { bold: true }, { spacing: { after: 0 } })), valueW, true));
    }
  }
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ children: cells })],
  });
}
const gap = () => new Paragraph({ children: [], spacing: { after: 60 } });

export function buildVolunteerDocx(v: any): Document {
  const { last, first, mi } = splitName(v.full_name);
  const submitted = formatDate(v.created_date);
  const consent = v.background_check_consent === true;
  const kids: any[] = [];

  kids.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 60 },
    children: [run("Mercy House Teen Challenge", { bold: true, size: 40, color: "5B5B5B" })],
  }));
  kids.push(para("Volunteer Application", { bold: true, size: 26 }, { spacing: { before: 160, after: 80 } }));
  kids.push(para("Our mission is to provide adult men and women with an effective and comprehensive Christian faith-based solution to life-controlling and alcohol problems to become productive members of society. By applying biblical principles, Mercy House Adult and Teen Challenge endeavors to help men and women become mentally sound, emotionally balanced, socially adjusted, physically well, and spiritually alive."));
  kids.push(para("WE ARE RESTORING BROKEN FAMILIES ONE PERSON AT A TIME", { bold: true }, { alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 } }));

  // ---- Applicant Information ----
  kids.push(bar("Applicant Information"));
  kids.push(fieldRow([
    { label: "Full Name (Last, First, M.I.):", value: [last, first, mi && `${mi}.`].filter(Boolean).join(last && first ? ', ' : ' '), w: 68 },
    { label: "Date:", value: submitted, w: 32 },
  ]));
  kids.push(gap());
  kids.push(fieldRow([
    { label: "Address:", value: v.address, w: 70 },
    { label: "Apt/Unit #:", value: v.apartment, w: 30 },
  ]));
  kids.push(fieldRow([
    { label: "City:", value: v.city, w: 55 },
    { label: "State:", value: v.state, w: 20 },
    { label: "ZIP Code:", value: v.zip, w: 25 },
  ]));
  kids.push(gap());
  kids.push(fieldRow([
    { label: "Phone:", value: v.phone, w: 40 },
    { label: "Email:", value: v.email, w: 60 },
  ]));
  kids.push(gap());
  kids.push(fieldRow([
    { label: "Date Available:", value: formatDate(v.date_available), w: 30 },
    { label: "Social Security No.:", value: v.ssn ? 'On file' : '', w: 38 },
    { label: "Birthdate:", value: formatDate(v.date_of_birth), w: 32 },
  ]));
  kids.push(gap());
  kids.push(fieldRow([{ label: "Drivers License or ID#:", value: v.drivers_license_id, w: 100 }]));
  kids.push(gap());
  kids.push(fieldRow([{ label: "Are you a citizen of the United States?", yesNo: v.us_citizen ?? null, w: 100 }]));
  kids.push(fieldRow([
    { label: "Have you volunteered for us before?", yesNo: v.volunteered_before ?? null, w: 55 },
    { label: "If yes, when?", value: v.volunteered_before_when, w: 45 },
  ]));
  kids.push(fieldRow([{ label: "Have you ever been convicted of a felony?", yesNo: v.felony_convicted ?? null, w: 100 }]));
  kids.push(fieldRow([{ label: "If yes, explain:", value: v.felony_explanation, w: 100 }]));

  // ---- Other Information ----
  kids.push(bar("Other Information"));
  kids.push(fieldRow([
    { label: "Church Name:", value: v.church_name, w: 50 },
    { label: "How long have you attended?", value: v.church_attendance_length, w: 50 },
  ]));
  kids.push(gap());
  const about = str(v.about_yourself) || [
    str(v.why_volunteer) && `Why I want to volunteer: ${str(v.why_volunteer)}`,
    str(v.skills) && `Skills: ${str(v.skills)}`,
    str(v.previous_volunteer_experience) && `Previous experience: ${str(v.previous_volunteer_experience)}`,
  ].filter(Boolean).join('\n');
  kids.push(fieldRow([{ label: "Would you like to tell us anything about yourself?", value: about, w: 100 }]));

  // Details from the online application that the printed template has no line for.
  const extras: [string, string][] = [
    ["Preferred Campus", v.preferred_campus ? pretty(v.preferred_campus) : ''],
    ["Areas of Interest", list(v.areas_of_interest)],
    ["Availability", list(v.availability)],
    ["Emergency Contact", [v.emergency_contact_name, v.emergency_contact_relationship && `(${v.emergency_contact_relationship})`, v.emergency_contact_phone].filter(Boolean).join(' ')],
    ["Text Message Opt-In", v.sms_opt_in ? 'Yes' : 'No'],
  ];
  if (extras.some(([, val]) => val && val !== 'No')) {
    kids.push(bar("Additional Details from Online Application"));
    for (const [label, val] of extras) kids.push(fieldRow([{ label: `${label}:`, value: val, w: 100 }]));
  }

  kids.push(para("We are grateful for people like you who want to dedicate time to serve at our ministry. Our program would not be as successful if it were not for people in our local community giving of their time and money. While monetary donations are extremely helpful to keep our program running, you do not have to donate to be a blessing to our ministry.", {}, { spacing: { before: 160, after: 80 } }));

  // ---- References ----
  kids.push(bar("References"));
  kids.push(para("Please list two Professional References", { italics: true }));
  for (const n of [1, 2]) {
    kids.push(fieldRow([
      { label: "Full Name:", value: v[`reference_${n}_name`], w: 60 },
      { label: "Relationship:", value: v[`reference_${n}_relationship`], w: 40 },
    ]));
    kids.push(fieldRow([
      { label: "Company:", value: v[`reference_${n}_company`], w: 60 },
      { label: "Phone:", value: v[`reference_${n}_phone`], w: 40 },
    ]));
    kids.push(gap());
  }

  // ---- Disclaimer ----
  kids.push(bar("Disclaimer and Signature"));
  kids.push(para("I certify that my answers are true and complete to the best of my knowledge.", { italics: true }));
  kids.push(para("I understand that false or misleading information in my application may result in denial to volunteer.", { italics: true }));
  kids.push(fieldRow([
    { label: "Signature:", value: v.signature, w: 65 },
    { label: "Date:", value: formatDate(v.signature_date), w: 35 },
  ]));

  // ---- Consent ----
  kids.push(bar("Consent and Release for Background Information"));
  kids.push(para("I understand that as a volunteer of Mercy House Adult and Teen Challenge in the following locations, Georgetown, MS, Crystal Springs, MS, Byram, MS, Pearl, MS and/or Learned, MS, they will use the services of an outside agency to research and verify the information provided. MHTC will utilize various sources of information it deems appropriate. I hereby authorize a representative of MHTC to obtain information on my criminal background. I understand that this check must be done before I can volunteer or serve at any of the locations listed above. I also understand that refusal to provide all necessary information may result in Denial of volunteer status.", { italics: true }));
  kids.push(fieldRow([
    { label: "Signature:", value: v.background_signature || (consent ? 'Consent given electronically with online application' : ''), w: 65 },
    { label: "Date:", value: formatDate(v.background_signature_date) || (consent ? submitted : ''), w: 35 },
  ]));
  kids.push(gap());
  kids.push(para(`Application status: ${pretty(str(v.status) || 'pending')}   |   Record ID: ${v.id}`, { size: 16, color: "777777" }));

  return new Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
      children: kids,
    }],
  });
}

export async function volunteerDocxBytes(v: any): Promise<Uint8Array> {
  return new Uint8Array(await Packer.toBuffer(buildVolunteerDocx(v)));
}

export function volunteerFileName(v: any) {
  const safe = str(v.full_name).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Volunteer';
  return `${safe}_Volunteer_Application.docx`;
}

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Uploads the .docx into a Drive folder and returns the new file's id. */
export async function uploadVolunteerDocx(accessToken: string, folderId: string, name: string, bytes: Uint8Array): Promise<string> {
  const boundary = '===============mh_volunteer_' + Date.now() + '==';
  const head = new TextEncoder().encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, mimeType: DOCX, parents: [folderId] })}\r\n` +
    `--${boundary}\r\nContent-Type: ${DOCX}\r\n\r\n`,
  );
  const tail = new TextEncoder().encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(head.length + bytes.length + tail.length);
  body.set(head, 0);
  body.set(bytes, head.length);
  body.set(tail, head.length + bytes.length);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary="${boundary}"` },
    body,
  });
  if (!res.ok) throw new Error(`Drive upload failed (${res.status}): ${await res.text()}`);
  return (await res.json()).id;
}