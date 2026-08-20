import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, ChevronLeft, ChevronRight, Send, Heart, BookOpen, Users } from 'lucide-react';

const STEPS = [
  { name: 'Personal', icon: Heart },
  { name: 'Health', icon: Heart },
  { name: 'Christian Background', icon: Users },
  { name: 'Testimony & Questions', icon: BookOpen },
  { name: 'Education & Work', icon: BookOpen },
  { name: 'Legal History', icon: BookOpen },
  { name: 'Internship & References', icon: BookOpen },
  { name: 'Review & Sign', icon: CheckCircle }
];

const EMPTY = {
  full_name: '', email: '', phone: '', date_of_birth: '', address: '', city: '', state: '', zip: '',
  marital_status: '', children: '',
  has_health_insurance: false, current_medications: '', allergies: '', physical_limitations: '',
  mental_health_history: '', physician_name_phone: '',
  how_long_christian: '', baptized: false, salvation_testimony: '', church_background: '',
  church_name: '', church_address: '', pastor_name: '', pastor_phone: '', member_since: '',
  involved_in_ministry: false, ministry_involvement_details: '',
  testimony: '', diversity_response: '', why_internship: '', strengths_weaknesses: '', how_heard: '',
  education_level: '', school_name: '', graduation_year: '', field_of_study: '', additional_education: '',
  current_employer: '', current_position: '', work_experience: '', years_experience: '', skills: '',
  ever_arrested: false, arrest_details: '', under_legal_supervision: false, probation_parole_details: '',
  pending_legal_matters: false, pending_legal_details: '', criminal_charges: false, criminal_charges_details: '',
  sexual_offender_registry: false, legally_mandated_treatment: false, drivers_license: '',
  preferred_start_date: '', availability: '', emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '',
  reference_1_name: '', reference_1_relationship: '', reference_1_phone: '', reference_1_email: '',
  reference_2_name: '', reference_2_relationship: '', reference_2_phone: '', reference_2_email: '',
  signature: '', signature_date: ''
};

function Field({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-navy dark:text-gold font-medium">{label}{required && <span className="text-red-500"> *</span>}</Label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls = 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600';

export default function Internship() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e.target ? e.target.value : e }));
  const setBool = (key) => (checked) => setData((d) => ({ ...d, [key]: checked }));

  const submitMutation = useMutation({
    mutationFn: (payload) => base44.entities.InternshipApplication.create({
      ...payload,
      submission_date: new Date().toISOString().slice(0, 10),
      status: 'pending'
    }),
    onSuccess: () => setSubmitted(true),
    onError: (err) => alert('Submission failed: ' + (err?.message || 'Unknown error'))
  });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!data.full_name || !data.email || !data.phone || !data.testimony) {
      alert('Please ensure full name, email, phone, and your testimony are completed before submitting.');
      return;
    }
    if (!data.signature) { alert('Please type your full name as your signature to confirm.'); return; }
    submitMutation.mutate({ ...data, signature_date: data.signature_date || new Date().toISOString().slice(0, 10) });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10">
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">Application Received</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Thank you for applying to the Mercy House internship program. We've received your application and will be in touch soon. A staff member will review your submission and contact you at the email you provided.
          </p>
          <p className="text-sm text-slate-500 mb-8">If you have questions, reach us at (601) 720-3718 or info@mercyhouseatc.com.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-navy dark:bg-gold text-white dark:text-navy hover:bg-navy/90 dark:hover:bg-gold/90">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-950 py-16 text-center text-white">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult Teen Challenge</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Internship Application</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Step into a Christ-centered ministry and grow through hands-on service, discipleship, and leadership development.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step indicator */}
        <div className="mb-10">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setStep(i)}
                className={`flex-1 text-center text-xs font-medium transition-colors ${i === step ? 'text-navy dark:text-gold' : 'text-slate-400'}`}
              >
                <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full mb-1 border-2 ${i === step ? 'border-gold bg-gold/10' : i < step ? 'border-green-500 bg-green-500/10' : 'border-slate-300 dark:border-slate-600'}`}>
                  {i < step ? <CheckCircle className="w-4 h-4 text-green-600" /> : <s.icon className="w-4 h-4" />}
                </span>
                <span className="hidden sm:block">{s.name}</span>
              </button>
            ))}
          </div>
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 md:p-10">
          {/* STEP 0 — Personal */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Personal Information</h2>
              <Field label="Full Legal Name" required><Input className={inputCls} value={data.full_name} onChange={set('full_name')} /></Field>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Email" required><Input type="email" className={inputCls} value={data.email} onChange={set('email')} /></Field>
                <Field label="Phone" required><Input className={inputCls} value={data.phone} onChange={set('phone')} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Date of Birth"><Input type="date" className={inputCls} value={data.date_of_birth} onChange={set('date_of_birth')} /></Field>
                <Field label="Marital Status">
                  <Select value={data.marital_status} onValueChange={set('marital_status')}>
                    <SelectTrigger className={inputCls}><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {['single','married','divorced','widowed','separated'].map((v) => <SelectItem key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Street Address"><Input className={inputCls} value={data.address} onChange={set('address')} /></Field>
              <div className="grid md:grid-cols-3 gap-5">
                <Field label="City"><Input className={inputCls} value={data.city} onChange={set('city')} /></Field>
                <Field label="State"><Input className={inputCls} value={data.state} onChange={set('state')} /></Field>
                <Field label="ZIP"><Input className={inputCls} value={data.zip} onChange={set('zip')} /></Field>
              </div>
              <Field label="Children (names & ages, if any)"><Input className={inputCls} value={data.children} onChange={set('children')} /></Field>
            </div>
          )}

          {/* STEP 1 — Health */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Health Information</h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="ins" checked={data.has_health_insurance} onCheckedChange={setBool('has_health_insurance')} />
                <Label htmlFor="ins">I currently have health insurance</Label>
              </div>
              <Field label="Current Medications"><Textarea className={inputCls} value={data.current_medications} onChange={set('current_medications')} rows={2} /></Field>
              <Field label="Allergies (medication, food, environmental)"><Textarea className={inputCls} value={data.allergies} onChange={set('allergies')} rows={2} /></Field>
              <Field label="Physical or Dietary Limitations"><Textarea className={inputCls} value={data.physical_limitations} onChange={set('physical_limitations')} rows={2} /></Field>
              <Field label="Mental Health History / Treatment"><Textarea className={inputCls} value={data.mental_health_history} onChange={set('mental_health_history')} rows={2} /></Field>
              <Field label="Current Physician (name & phone)"><Input className={inputCls} value={data.physician_name_phone} onChange={set('physician_name_phone')} /></Field>
            </div>
          )}

          {/* STEP 2 — Christian Background & Church */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Christian Background & Church Membership</h2>
              <Field label="How long have you been a Christian?"><Input className={inputCls} value={data.how_long_christian} onChange={set('how_long_christian')} /></Field>
              <div className="flex items-center space-x-2">
                <Checkbox id="bap" checked={data.baptized} onCheckedChange={setBool('baptized')} />
                <Label htmlFor="bap">I have been baptized</Label>
              </div>
              <Field label="Salvation Experience (brief summary)"><Textarea className={inputCls} value={data.salvation_testimony} onChange={set('salvation_testimony')} rows={3} /></Field>
              <Field label="Church Background / Denomination"><Input className={inputCls} value={data.church_background} onChange={set('church_background')} /></Field>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Local Church Membership</h3>
                <Field label="Church Name"><Input className={inputCls} value={data.church_name} onChange={set('church_name')} /></Field>
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  <Field label="Church Address"><Input className={inputCls} value={data.church_address} onChange={set('church_address')} /></Field>
                  <Field label="Member Since (how long)"><Input className={inputCls} value={data.member_since} onChange={set('member_since')} /></Field>
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  <Field label="Pastor's Name"><Input className={inputCls} value={data.pastor_name} onChange={set('pastor_name')} /></Field>
                  <Field label="Pastor's Phone"><Input className={inputCls} value={data.pastor_phone} onChange={set('pastor_phone')} /></Field>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="min" checked={data.involved_in_ministry} onCheckedChange={setBool('involved_in_ministry')} />
                  <Label htmlFor="min">I am involved in ministry at my church</Label>
                </div>
                {data.involved_in_ministry && (
                  <div className="mt-4">
                    <Field label="Areas of Ministry Involvement"><Textarea className={inputCls} value={data.ministry_involvement_details} onChange={set('ministry_involvement_details')} rows={2} /></Field>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Testimony & Questions */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Testimony & Open Questions</h2>
              <Field label="Your Personal Testimony / Faith Story" required>
                <Textarea className={inputCls} value={data.testimony} onChange={set('testimony')} rows={5} placeholder="Share your faith journey and how God has worked in your life…" />
              </Field>
              <Field label="How do you value diversity (such as racial or socioeconomic differences or varying beliefs) and what is your method of working alongside those of diversity?">
                <Textarea className={inputCls} value={data.diversity_response} onChange={set('diversity_response')} rows={5} />
              </Field>
              <Field label="Why do you want to participate in this internship?"><Textarea className={inputCls} value={data.why_internship} onChange={set('why_internship')} rows={3} /></Field>
              <Field label="What are your strengths and weaknesses?"><Textarea className={inputCls} value={data.strengths_weaknesses} onChange={set('strengths_weaknesses')} rows={3} /></Field>
              <Field label="How did you hear about the internship?"><Input className={inputCls} value={data.how_heard} onChange={set('how_heard')} /></Field>
            </div>
          )}

          {/* STEP 4 — Education & Work */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Education & Work Experience</h2>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Education</h3>
                <Field label="Highest Level of Education Completed"><Input className={inputCls} value={data.education_level} onChange={set('education_level')} placeholder="e.g., High School Diploma, Bachelor's Degree" /></Field>
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  <Field label="School / College Last Attended"><Input className={inputCls} value={data.school_name} onChange={set('school_name')} /></Field>
                  <Field label="Graduation Year"><Input type="number" className={inputCls} value={data.graduation_year} onChange={set('graduation_year')} /></Field>
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  <Field label="Field of Study"><Input className={inputCls} value={data.field_of_study} onChange={set('field_of_study')} /></Field>
                  <Field label="Additional Education / Certifications"><Input className={inputCls} value={data.additional_education} onChange={set('additional_education')} /></Field>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Work Experience</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Current Employer"><Input className={inputCls} value={data.current_employer} onChange={set('current_employer')} /></Field>
                  <Field label="Current Position"><Input className={inputCls} value={data.current_position} onChange={set('current_position')} /></Field>
                </div>
                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  <Field label="Years of Work Experience"><Input className={inputCls} value={data.years_experience} onChange={set('years_experience')} /></Field>
                  <Field label="Special Skills / Qualifications"><Input className={inputCls} value={data.skills} onChange={set('skills')} /></Field>
                </div>
                <div className="mt-4">
                  <Field label="Work History Summary"><Textarea className={inputCls} value={data.work_experience} onChange={set('work_experience')} rows={3} /></Field>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Legal History */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Legal History</h2>
              <p className="text-sm text-slate-500">Please answer honestly. A disclosure does not automatically disqualify you.</p>
              <div className="space-y-4">
                {[
                  ['ever_arrested', 'arrest_details', 'Have you ever been arrested?'],
                  ['under_legal_supervision', 'probation_parole_details', 'Are you currently under legal supervision (probation or parole)?'],
                  ['pending_legal_matters', 'pending_legal_details', 'Do you have any pending legal matters (warrants, court appearances, charges)?'],
                  ['criminal_charges', 'criminal_charges_details', 'Have you ever been charged with a crime?'],
                  ['sexual_offender_registry', null, 'Are you listed on any sexual offender registry?'],
                  ['legally_mandated_treatment', null, 'Are you under any court-mandated treatment?']
                ].map(([boolKey, detailKey, label]) => (
                  <div key={boolKey} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={boolKey} checked={data[boolKey]} onCheckedChange={setBool(boolKey)} />
                      <Label htmlFor={boolKey}>{label}</Label>
                    </div>
                    {data[boolKey] && detailKey && (
                      <Textarea className={inputCls} placeholder="Please explain…" rows={2}
                        value={data[detailKey]} onChange={(e) => setData((d) => ({ ...d, [detailKey]: e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
              <Field label="Driver's License Status">
                <Select value={data.drivers_license} onValueChange={set('drivers_license')}>
                  <SelectTrigger className={inputCls}><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {['yes','no','expired','suspended'].map((v) => <SelectItem key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {/* STEP 6 — Internship & References */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Internship Details & References</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Preferred Start Date"><Input type="date" className={inputCls} value={data.preferred_start_date} onChange={set('preferred_start_date')} /></Field>
                <Field label="Availability / Preferred Duration"><Input className={inputCls} value={data.availability} onChange={set('availability')} /></Field>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Emergency Contact</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Name"><Input className={inputCls} value={data.emergency_contact_name} onChange={set('emergency_contact_name')} /></Field>
                  <Field label="Phone"><Input className={inputCls} value={data.emergency_contact_phone} onChange={set('emergency_contact_phone')} /></Field>
                  <Field label="Relationship"><Input className={inputCls} value={data.emergency_contact_relationship} onChange={set('emergency_contact_relationship')} /></Field>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Reference 1</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Name"><Input className={inputCls} value={data.reference_1_name} onChange={set('reference_1_name')} /></Field>
                  <Field label="Relationship"><Input className={inputCls} value={data.reference_1_relationship} onChange={set('reference_1_relationship')} /></Field>
                  <Field label="Phone"><Input className={inputCls} value={data.reference_1_phone} onChange={set('reference_1_phone')} /></Field>
                  <Field label="Email"><Input className={inputCls} value={data.reference_1_email} onChange={set('reference_1_email')} /></Field>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-navy dark:text-gold mb-4">Reference 2</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Name"><Input className={inputCls} value={data.reference_2_name} onChange={set('reference_2_name')} /></Field>
                  <Field label="Relationship"><Input className={inputCls} value={data.reference_2_relationship} onChange={set('reference_2_relationship')} /></Field>
                  <Field label="Phone"><Input className={inputCls} value={data.reference_2_phone} onChange={set('reference_2_phone')} /></Field>
                  <Field label="Email"><Input className={inputCls} value={data.reference_2_email} onChange={set('reference_2_email')} /></Field>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 — Review & Sign */}
          {step === 7 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy dark:text-gold">Review & Sign</h2>
              <p className="text-sm text-slate-500">
                Please review your responses using the steps above. By typing your name below, you confirm that the information provided is true and accurate to the best of your knowledge.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Name:</strong> {data.full_name || '—'}</p>
                <p><strong>Email:</strong> {data.email || '—'}</p>
                <p><strong>Phone:</strong> {data.phone || '—'}</p>
                <p><strong>Church:</strong> {data.church_name || '—'}</p>
                <p><strong>Education:</strong> {data.education_level || '—'}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Signature (type your full name)" required>
                  <Input className={inputCls} value={data.signature} onChange={set('signature')} />
                </Field>
                <Field label="Date"><Input type="date" className={inputCls} value={data.signature_date} onChange={set('signature_date')} /></Field>
              </div>
              <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="w-full bg-gold hover:bg-gold-accessible hover:text-white text-navy-950 font-bold py-3">
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? 'Submitting…' : 'Submit Application'}
              </Button>
            </div>
          )}

          {/* Nav buttons */}
          {step < 7 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={next} className="bg-navy dark:bg-gold text-white dark:text-navy hover:bg-navy/90 dark:hover:bg-gold/90">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
          {step === 7 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={back}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}