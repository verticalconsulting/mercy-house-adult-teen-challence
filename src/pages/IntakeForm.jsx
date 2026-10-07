import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, Info, AlertCircle, Phone, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import IntakeFeePayment from '../components/IntakeFeePayment';
import MedicalHistoryGrid from '../components/intake/MedicalHistoryGrid';

const validatePhone = (phone) => {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};
const validateEmail = (email) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" aria-live="polite">
      <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />{message}
    </p>
  );
}

function FormField({ id, label, required, error, hint, children }) {
  return (
    <div>
      <Label htmlFor={id} className="text-base font-medium text-slate-700 dark:text-slate-200">
        {label}{required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        {!required && <span className="text-slate-400 text-xs ml-1">(optional)</span>}
      </Label>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{hint}</p>}
      {children}
      <FieldError message={error} />
    </div>
  );
}

const ACKNOWLEDGEMENTS = [
  { field: 'medical_dental_acknowledged', label: 'Medical & Dental Acknowledgement', text: 'I affirm I am in good physical health, do not currently require dental care, and understand I may be required to leave if a pre-existing condition limits my participation until medical/dental clearance is provided.' },
  { field: 'intake_fee_acknowledged', label: 'Intake Fee Agreement', text: 'I understand this is a 12-month minimum program with a $1,000 program fee, payable by the end of Third Phase. Payment arrangements may be made on a case-by-case basis.' },
  { field: 'student_rights_acknowledged', label: "Student's Rights", text: 'I understand this is a voluntary program, I am free to leave at any time, and I have the right to personal privacy, dignity, inspection of my record, and a grievance procedure.' },
  { field: 'civil_rights_acknowledged', label: 'Civil Rights Waiver', text: 'I acknowledge Mercy House is an evangelical Christian discipleship ministry and I agree to participate in Christian religious activities. I understand staff may regulate and monitor my communications for a period as determined by program staff.' },
  { field: 'marketing_authorized', label: 'Marketing Authorization', text: 'I authorize MHATC to use my name, recovery story, and likeness for promotional, inspirational, and educational purposes. I understand I may revoke this at any time in writing.' },
  { field: 'drug_testing_acknowledged', label: 'Alcohol, Drug & Tobacco Testing Policy', text: 'I understand Mercy House reserves the right to conduct random drug testing, and that a positive test or use of tobacco products is grounds for immediate dismissal.' },
  { field: 'vocational_training_acknowledged', label: 'Vocational Training Agreement', text: 'I understand work assignments are part of vocational training for my personal development, I am not an employee, and will not receive wages or compensation for work performed in the program.' },
];

export default function IntakeForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [condensedMode, setCondensedMode] = useState(false);
  const [errors, setErrors] = useState({});
  const intakeStartedFired = useRef(false);

  useEffect(() => {
    try { base44.analytics.track({ eventName: 'intake_form_viewed' }); } catch (_) {}
  }, []);

  const handleFirstFocus = () => {
    if (intakeStartedFired.current) return;
    intakeStartedFired.current = true;
    try { base44.analytics.track({ eventName: 'intake_form_started' }); } catch (_) {}
  };

  const [formData, setFormData] = useState({
    application_type: 'mens_program',
    full_legal_name: '', date_of_birth: '', age: '', biological_sex: 'male', ssn: '',
    address: '', city: '', state: '', zip: '', home_phone: '', cell_phone: '', email: '',
    drivers_license: '', drivers_license_number: '', drivers_license_state: '', drivers_license_explanation: '',
    referral_source: '', referral_name: '', referral_relationship: '', referral_address: '',
    contact_person_1_name: '', contact_person_1_relationship: '', contact_person_1_phone: '', contact_person_1_email: '',
    under_legal_supervision: false, legally_mandated_treatment: false, pending_legal_matters: [],
    sexual_offender_registry: false, sexual_offense_charges: false, arson_charges: false, violent_offense_charges: false,
    has_health_insurance: false, blood_type: '', legally_married: false,
    emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '',
    emergency_contact_1_address: '', emergency_contact_1_city: '', emergency_contact_1_state: '', emergency_contact_1_zip: '',
    emergency_contact_2_name: '', emergency_contact_2_phone: '', emergency_contact_2_relationship: '',
    emergency_contact_2_address: '', emergency_contact_2_city: '', emergency_contact_2_state: '', emergency_contact_2_zip: '',
    emergency_consent_signature: '', emergency_consent_date: '',
    currently_treated_by_physician: false, physician_details: '',
    manual_work_limitations: false, exercise_limitations: false, recreational_limitations: false,
    allergies: '', mental_health_diagnosis: '', current_medications: '',
    possibly_pregnant: false, eating_disorder: false,
    medical_history_conditions: [], mental_health_conditions: [], anorexia_active: false, bulimia_active: false,
    medical_history_signature: '', medical_history_date: '',
    correspondence_auth: Array.from({ length: 5 }, () => ({ name: '', relationship: '', phone: '', approved: null })),
    medical_dental_acknowledged: false, medical_dental_signature: '', medical_dental_date: '',
    intake_fee_option: '', intake_fee_hardship_explanation: '', intake_fee_signature: '', intake_fee_date: '',
    intake_fee_acknowledged: false,
    student_rights_acknowledged: false, student_rights_signature: '', student_rights_date: '',
    civil_rights_acknowledged: false, civil_rights_signature: '', civil_rights_date: '',
    marketing_authorized: false, marketing_signature: '', marketing_date: '',
    drug_testing_acknowledged: false, drug_testing_signature: '', drug_testing_date: '',
    vocational_training_acknowledged: false, vocational_training_signature: '', vocational_training_date: '',
    previous_treatment_programs: '', addiction_details: '',
    signature: '', submission_date: new Date().toISOString().split('T')[0], condensed_mode: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('intake_prefill');
      if (saved) { const parsed = JSON.parse(saved); setFormData(prev => ({ ...prev, ...parsed })); }
    } catch (_) {}
    if (!formData.state) {
      try {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
          setFormData(prev => ({ ...prev, city: prev.city || data.city || '', state: prev.state || data.region_code || '', zip: prev.zip || data.postal || '' }));
        }).catch(() => {});
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const toSave = { full_legal_name: formData.full_legal_name, cell_phone: formData.cell_phone, email: formData.email, city: formData.city, state: formData.state, zip: formData.zip };
    try { localStorage.setItem('intake_prefill', JSON.stringify(toSave)); } catch (_) {}
  }, [formData.full_legal_name, formData.cell_phone, formData.email, formData.city, formData.state, formData.zip]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };
  const updatePhone = (field, value) => updateField(field, formatPhone(value));
  const toggleArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }));
  };
  const togglePendingLegal = (value) => toggleArray('pending_legal_matters', value);
  const updateCorrespondence = (idx, key, value) => {
    setFormData(prev => {
      const updated = [...prev.correspondence_auth];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, correspondence_auth: updated };
    });
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!formData.full_legal_name.trim()) newErrors.full_legal_name = 'Full legal name is required.';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required.';
      if (!formData.cell_phone.trim()) newErrors.cell_phone = 'Cell phone is required.';
      else if (!validatePhone(formData.cell_phone)) newErrors.cell_phone = 'Please enter a valid 10-digit phone number.';
      if (formData.home_phone && !validatePhone(formData.home_phone)) newErrors.home_phone = 'Please enter a valid 10-digit phone number.';
      if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address.';
      if (formData.contact_person_1_phone && !validatePhone(formData.contact_person_1_phone)) newErrors.contact_person_1_phone = 'Please enter a valid 10-digit phone number.';
    }
    if (s === 3) {
      if (formData.emergency_contact_phone && !validatePhone(formData.emergency_contact_phone)) newErrors.emergency_contact_phone = 'Please enter a valid 10-digit phone number.';
      if (formData.emergency_contact_2_phone && !validatePhone(formData.emergency_contact_2_phone)) newErrors.emergency_contact_2_phone = 'Please enter a valid 10-digit phone number.';
    }
    if (s === 5) {
      if (!formData.signature.trim()) newErrors.signature = 'Signature is required to submit.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    setLoading(true);
    try {
      // Propagate main signature/date to all acknowledgement sections
      const today = formData.submission_date;
      const payload = {
        ...formData,
        condensed_mode: condensedMode,
        medical_history_signature: formData.medical_history_signature || formData.signature,
        medical_history_date: formData.medical_history_date || today,
        emergency_consent_signature: formData.emergency_consent_signature || formData.signature,
        emergency_consent_date: formData.emergency_consent_date || today,
        medical_dental_signature: formData.medical_dental_signature || formData.signature,
        medical_dental_date: formData.medical_dental_date || today,
        intake_fee_signature: formData.intake_fee_signature || formData.signature,
        intake_fee_date: formData.intake_fee_date || today,
        intake_fee_acknowledged: !!formData.intake_fee_option,
        student_rights_signature: formData.student_rights_signature || formData.signature,
        student_rights_date: formData.student_rights_date || today,
        civil_rights_signature: formData.civil_rights_signature || formData.signature,
        civil_rights_date: formData.civil_rights_date || today,
        marketing_signature: formData.marketing_signature || formData.signature,
        marketing_date: formData.marketing_date || today,
        drug_testing_signature: formData.drug_testing_signature || formData.signature,
        drug_testing_date: formData.drug_testing_date || today,
        vocational_training_signature: formData.vocational_training_signature || formData.signature,
        vocational_training_date: formData.vocational_training_date || today,
      };
      await base44.functions.invoke('submitIntakeApplication', payload);
      localStorage.removeItem('intake_prefill');
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit. Please try again or call (601) 720-3718.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = condensedMode ? 2 : 5;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <Card className="text-center p-12">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">Application Submitted!</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              Thank you for taking this important step. Our intake team will review your application and contact you within 24–48 hours.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Mercy House Adult Teen Challenge<br />1110 Mary St, PO Box 266<br />Georgetown, MS 39078<br />Intake Coordinator: (601) 720-3718
            </p>
          </Card>
          <div>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4 text-sm font-medium">
              Optional: Pay your $1,000 intake fee now to secure your spot — or wait until you hear from our team.
            </p>
            <IntakeFeePayment applicantName={formData.full_legal_name} applicantEmail={formData.email} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-2xl bg-navy dark:bg-slate-950 text-white overflow-hidden shadow-lg">
          <div className="px-6 py-10 md:px-12 md:py-14 text-center">
            <Heart className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Get Help Now — We&rsquo;re Here for You</h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-6 leading-relaxed">
              You don&rsquo;t have to do this alone. We&rsquo;re waiting on you and ready to help. Call us right now, or fill out the form below and our intake team will get back to you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+16017203718" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-bold text-navy-950 shadow-cta transition-colors hover:bg-gold-accessible hover:text-white">
                <Phone className="w-5 h-5" aria-hidden="true" />Call (601) 720-3718
              </a>
              <Link to="/freedom-from-addiction-starts-here" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-white/70 px-6 py-2 font-bold text-white transition-colors hover:bg-white hover:text-navy">
                Learn More About Getting Help<ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-300">Confidential · Free to call · Faith-based, never preachy</p>
          </div>
        </section>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-2">Confidential Intake Application</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-1">Mercy House Adult Teen Challenge</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Step {step} of {totalSteps} — {Math.round((step / totalSteps) * 100)}% complete</p>
          <div className="mt-2 flex justify-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${step} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
              <div key={s} className={`h-2 w-16 sm:w-20 rounded-full transition-colors ${s <= step ? 'bg-gold' : 'bg-slate-300 dark:bg-slate-700'}`} />
            ))}
          </div>
          <p className="mt-3 text-sm text-green-700 dark:text-green-400 font-medium">✓ Low cost program — Financial help available</p>
        </div>

        {step === 1 && (
          <Card className="mb-6 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 dark:text-blue-200 text-base">Need a shorter form?</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    If the full form is too long, you can submit a condensed version with just the essential information. Our staff will follow up by phone to collect additional details.
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox id="condensed_mode" checked={condensedMode} onCheckedChange={(checked) => { setCondensedMode(checked); updateField('condensed_mode', checked); }} />
                    <Label htmlFor="condensed_mode" className="text-base text-blue-800 dark:text-blue-200 cursor-pointer">
                      Use condensed form (name, phone, program — staff will call me)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} onFocusCapture={handleFirstFocus} noValidate aria-label="Intake application form">
          {/* ===== CONDENSED MODE ===== */}
          {condensedMode && step === 1 && (
            <Card>
              <CardHeader><CardTitle className="text-navy dark:text-gold">Essential Information</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-base font-semibold">Which program are you applying for? <span className="text-red-500">*</span></Label>
                  <RadioGroup value={formData.application_type} onValueChange={(v) => updateField('application_type', v)} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-3"><RadioGroupItem value="mens_program" id="mens_c" /><Label htmlFor="mens_c" className="text-base cursor-pointer">Men's Campus</Label></div>
                    <div className="flex items-center space-x-3"><RadioGroupItem value="womens_program" id="womens_c" /><Label htmlFor="womens_c" className="text-base cursor-pointer">Women's Campus</Label></div>
                  </RadioGroup>
                </div>
                <FormField id="full_legal_name_c" label="Full Legal Name" required error={errors.full_legal_name}>
                  <Input id="full_legal_name_c" value={formData.full_legal_name} onChange={e => updateField('full_legal_name', e.target.value)} placeholder="Your full name" aria-required="true" className="text-base mt-1" autoComplete="name" />
                </FormField>
                <FormField id="cell_phone_c" label="Best Phone Number to Reach You" required error={errors.cell_phone} hint="We'll call you to complete your application.">
                  <Input id="cell_phone_c" type="tel" value={formData.cell_phone} onChange={e => updatePhone('cell_phone', e.target.value)} placeholder="(555) 555-5555" aria-required="true" className="text-base mt-1" autoComplete="tel" inputMode="tel" />
                </FormField>
                <FormField id="dob_c" label="Date of Birth" required error={errors.date_of_birth}>
                  <Input id="dob_c" type="date" value={formData.date_of_birth} onChange={e => updateField('date_of_birth', e.target.value)} aria-required="true" className="text-base mt-1" autoComplete="bday" />
                </FormField>
                <FormField id="email_c" label="Email Address" error={errors.email}>
                  <Input id="email_c" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="you@example.com" className="text-base mt-1" autoComplete="email" inputMode="email" />
                </FormField>
                <div className="bg-navy/5 dark:bg-gold/10 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300">
                  <p>After you submit, our intake coordinator will call you to gather additional information. You can also reach us directly at <strong>(601) 720-3718</strong>.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {condensedMode && step === 2 && (
            <Card>
              <CardHeader><CardTitle className="text-navy dark:text-gold">Review &amp; Submit</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-1">
                  <p><strong>Program:</strong> {formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}</p>
                  <p><strong>Name:</strong> {formData.full_legal_name || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {formData.cell_phone || 'Not provided'}</p>
                  <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">By signing below, I authorize Mercy House Adult Teen Challenge to contact me and begin my intake process.</p>
                <FormField id="signature_c" label="Signature (Type your full name)" required error={errors.signature}>
                  <Input id="signature_c" value={formData.signature} onChange={e => updateField('signature', e.target.value)} placeholder="Type your full legal name" aria-required="true" className="text-base mt-1" />
                </FormField>
              </CardContent>
            </Card>
          )}

          {/* ===== FULL FORM — STEP 1: Personal Data ===== */}
          {!condensedMode && step === 1 && (
            <>
              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Program Selection</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={formData.application_type} onValueChange={(v) => updateField('application_type', v)}>
                    <div className="flex items-center space-x-3 mb-3"><RadioGroupItem value="mens_program" id="mens" /><Label htmlFor="mens" className="text-base cursor-pointer">Men's Campus</Label></div>
                    <div className="flex items-center space-x-3"><RadioGroupItem value="womens_program" id="womens" /><Label htmlFor="womens" className="text-base cursor-pointer">Women's Campus</Label></div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Personal Data &amp; Information <span className="text-sm font-normal text-slate-500">— Confidential</span></CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <FormField id="full_legal_name" label="Full Legal Name" required error={errors.full_legal_name}>
                    <Input id="full_legal_name" value={formData.full_legal_name} onChange={e => updateField('full_legal_name', e.target.value)} placeholder="Enter your full legal name" aria-required="true" className="text-base mt-1" autoComplete="name" />
                  </FormField>
                  <div className="grid md:grid-cols-3 gap-5">
                    <FormField id="dob" label="Date of Birth" required error={errors.date_of_birth}>
                      <Input id="dob" type="date" value={formData.date_of_birth} onChange={e => updateField('date_of_birth', e.target.value)} aria-required="true" className="text-base mt-1" autoComplete="bday" />
                    </FormField>
                    <FormField id="age" label="Age">
                      <Input id="age" type="number" value={formData.age} onChange={e => updateField('age', e.target.value ? parseInt(e.target.value) : '')} className="text-base mt-1" inputMode="numeric" />
                    </FormField>
                    <div>
                      <Label htmlFor="bio_sex" className="text-base font-medium text-slate-700 dark:text-slate-200">M/F Gender at Birth <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Select value={formData.biological_sex} onValueChange={v => updateField('biological_sex', v)}>
                        <SelectTrigger id="bio_sex" className="mt-1 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <FormField id="ssn" label="Social Security Number" hint="Used for enrollment records only">
                    <Input id="ssn" value={formData.ssn} onChange={e => updateField('ssn', e.target.value)} placeholder="XXX-XX-XXXX" className="text-base mt-1" autoComplete="off" />
                  </FormField>
                  <FormField id="address" label="Street Address">
                    <Input id="address" value={formData.address} onChange={e => updateField('address', e.target.value)} placeholder="Street address" className="text-base mt-1" autoComplete="street-address" />
                  </FormField>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div><Label htmlFor="city" className="text-base font-medium text-slate-700 dark:text-slate-200">City</Label><Input id="city" value={formData.city} onChange={e => updateField('city', e.target.value)} className="text-base mt-1" autoComplete="address-level2" /></div>
                    <div><Label htmlFor="state" className="text-base font-medium text-slate-700 dark:text-slate-200">State</Label><Input id="state" value={formData.state} onChange={e => updateField('state', e.target.value)} className="text-base mt-1" autoComplete="address-level1" maxLength={2} /></div>
                    <div><Label htmlFor="zip" className="text-base font-medium text-slate-700 dark:text-slate-200">ZIP</Label><Input id="zip" value={formData.zip} onChange={e => updateField('zip', e.target.value)} className="text-base mt-1" autoComplete="postal-code" inputMode="numeric" maxLength={5} /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="home_phone" label="Home Phone (Residence)" error={errors.home_phone}>
                      <Input id="home_phone" type="tel" value={formData.home_phone} onChange={e => updatePhone('home_phone', e.target.value)} placeholder="(555) 555-5555" className="text-base mt-1" autoComplete="tel" inputMode="tel" />
                    </FormField>
                    <FormField id="cell_phone" label="Cell Phone" required error={errors.cell_phone}>
                      <Input id="cell_phone" type="tel" value={formData.cell_phone} onChange={e => updatePhone('cell_phone', e.target.value)} placeholder="(555) 555-5555" aria-required="true" className="text-base mt-1" autoComplete="tel" inputMode="tel" />
                    </FormField>
                  </div>
                  <FormField id="email" label="Email Address" error={errors.email}>
                    <Input id="email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="you@example.com" className="text-base mt-1" autoComplete="email" inputMode="email" />
                  </FormField>
                  <div>
                    <Label className="text-base font-medium text-slate-700 dark:text-slate-200 mb-2 block">Driver's License</Label>
                    <RadioGroup value={formData.drivers_license} onValueChange={v => updateField('drivers_license', v)}>
                      <div className="flex flex-wrap gap-4">
                        {['yes', 'no', 'expired', 'suspended'].map(v => (
                          <div key={v} className="flex items-center space-x-2"><RadioGroupItem value={v} id={`dl_${v}`} /><Label htmlFor={`dl_${v}`} className="text-base cursor-pointer capitalize">{v}</Label></div>
                        ))}
                      </div>
                    </RadioGroup>
                    {formData.drivers_license === 'yes' && (
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <FormField id="dl_number" label="Driver's License Number"><Input id="dl_number" value={formData.drivers_license_number} onChange={e => updateField('drivers_license_number', e.target.value)} className="text-base mt-1" /></FormField>
                        <FormField id="dl_state" label="License State"><Input id="dl_state" value={formData.drivers_license_state} onChange={e => updateField('drivers_license_state', e.target.value)} className="text-base mt-1" maxLength={2} /></FormField>
                      </div>
                    )}
                    {formData.drivers_license === 'no' && (
                      <FormField id="dl_explain" label="If no, please explain"><Textarea id="dl_explain" value={formData.drivers_license_explanation} onChange={e => updateField('drivers_license_explanation', e.target.value)} rows={2} className="text-base mt-1" /></FormField>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Who Has Referred You to Teen Challenge?</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="ref_name" label="Name"><Input id="ref_name" value={formData.referral_name} onChange={e => updateField('referral_name', e.target.value)} className="text-base mt-1" /></FormField>
                    <FormField id="ref_rel" label="Relationship"><Input id="ref_rel" value={formData.referral_relationship} onChange={e => updateField('referral_relationship', e.target.value)} className="text-base mt-1" /></FormField>
                  </div>
                  <FormField id="ref_addr" label="Address"><Input id="ref_addr" value={formData.referral_address} onChange={e => updateField('referral_address', e.target.value)} className="text-base mt-1" /></FormField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-navy dark:text-gold">Contact Person <span className="text-sm font-normal text-slate-500">(optional)</span></CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Someone we can contact about your application status</p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><Label htmlFor="contact1_name" className="text-base font-medium text-slate-700 dark:text-slate-200">Name</Label><Input id="contact1_name" value={formData.contact_person_1_name} onChange={e => updateField('contact_person_1_name', e.target.value)} className="text-base mt-1" /></div>
                    <div><Label htmlFor="contact1_rel" className="text-base font-medium text-slate-700 dark:text-slate-200">Relationship</Label><Input id="contact1_rel" value={formData.contact_person_1_relationship} onChange={e => updateField('contact_person_1_relationship', e.target.value)} className="text-base mt-1" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="contact1_phone" label="Phone" error={errors.contact_person_1_phone}>
                      <Input id="contact1_phone" type="tel" value={formData.contact_person_1_phone} onChange={e => updatePhone('contact_person_1_phone', e.target.value)} className="text-base mt-1" inputMode="tel" />
                    </FormField>
                    <FormField id="contact1_email" label="Email" error={errors.contact_person_1_email}>
                      <Input id="contact1_email" type="email" value={formData.contact_person_1_email} onChange={e => updateField('contact_person_1_email', e.target.value)} className="text-base mt-1" inputMode="email" />
                    </FormField>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ===== STEP 2: Medical History ===== */}
          {!condensedMode && step === 2 && (
            <Card>
              <CardHeader><CardTitle className="text-navy dark:text-gold">Medical History Form</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Mark all conditions you have been diagnosed with. This information is kept confidential and used only for program placement.</p>
                <MedicalHistoryGrid
                  medicalSelected={formData.medical_history_conditions}
                  mentalSelected={formData.mental_health_conditions}
                  onToggleMedical={(v) => toggleArray('medical_history_conditions', v)}
                  onToggleMental={(v) => toggleArray('mental_health_conditions', v)}
                  anorexiaActive={formData.anorexia_active}
                  bulimiaActive={formData.bulimia_active}
                  onUpdate={updateField}
                />
                <div className="border-t pt-5 space-y-5">
                  <FormField id="allergies" label="Drug/Food/Environmental Allergies">
                    <Textarea id="allergies" value={formData.allergies} onChange={e => updateField('allergies', e.target.value)} rows={2} placeholder="List all known allergies, or write N/A" className="text-base mt-1" />
                  </FormField>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><Label htmlFor="blood_type" className="text-base font-medium text-slate-700 dark:text-slate-200">Blood Type</Label><Input id="blood_type" value={formData.blood_type} onChange={e => updateField('blood_type', e.target.value)} placeholder="e.g., O+" className="text-base mt-1" /></div>
                    <div className="flex items-center space-x-3 pt-6"><Checkbox id="insurance" checked={formData.has_health_insurance} onCheckedChange={c => updateField('has_health_insurance', c)} /><Label htmlFor="insurance" className="text-base cursor-pointer">I have health insurance</Label></div>
                  </div>
                  <div className="flex items-center space-x-3"><Checkbox id="married" checked={formData.legally_married} onCheckedChange={c => updateField('legally_married', c)} /><Label htmlFor="married" className="text-base cursor-pointer">Legally Married</Label></div>
                  <div className="flex items-start space-x-3"><Checkbox id="physician" checked={formData.currently_treated_by_physician} onCheckedChange={c => updateField('currently_treated_by_physician', c)} className="mt-0.5" /><Label htmlFor="physician" className="text-base leading-relaxed cursor-pointer">I am currently being treated by a physician</Label></div>
                  {formData.currently_treated_by_physician && (
                    <FormField id="physician_details" label="Physician Details"><Textarea id="physician_details" value={formData.physician_details} onChange={e => updateField('physician_details', e.target.value)} rows={2} className="text-base mt-1" /></FormField>
                  )}
                  <fieldset>
                    <legend className="text-base font-medium text-slate-700 dark:text-slate-200 mb-2">Physical Limitations <span className="text-slate-400 text-xs font-normal">(check if any apply)</span></legend>
                    <p className="text-sm text-slate-500 mb-3">Would any injury or illness affect your ability to participate in:</p>
                    {[
                      { id: 'manual_work', field: 'manual_work_limitations', label: 'Manual Work (includes 35–40 hrs/week of vocational training)' },
                      { id: 'exercise', field: 'exercise_limitations', label: 'Exercise Programs' },
                      { id: 'recreation', field: 'recreational_limitations', label: 'Recreational Activities' },
                    ].map(item => (
                      <div key={item.id} className="flex items-start space-x-3 mb-2"><Checkbox id={item.id} checked={formData[item.field]} onCheckedChange={c => updateField(item.field, c)} className="mt-0.5" /><Label htmlFor={item.id} className="text-base leading-relaxed cursor-pointer">{item.label}</Label></div>
                    ))}
                  </fieldset>
                  <FormField id="mental_health_notes" label="Mental Health Diagnosis (additional notes)"><Textarea id="mental_health_notes" value={formData.mental_health_diagnosis} onChange={e => updateField('mental_health_diagnosis', e.target.value)} rows={3} placeholder="List any diagnosis from a doctor, including date and treatment" className="text-base mt-1" /></FormField>
                  <FormField id="medications" label="Current Medications"><Textarea id="medications" value={formData.current_medications} onChange={e => updateField('current_medications', e.target.value)} rows={3} placeholder="List all prescriptions including dose, frequency, and reason" className="text-base mt-1" /></FormField>
                  {formData.application_type === 'womens_program' && (
                    <div className="flex items-center space-x-3"><Checkbox id="pregnant" checked={formData.possibly_pregnant} onCheckedChange={c => updateField('possibly_pregnant', c)} /><Label htmlFor="pregnant" className="text-base cursor-pointer">I may currently be pregnant</Label></div>
                  )}
                  <div className="flex items-start space-x-3"><Checkbox id="eating_disorder" checked={formData.eating_disorder} onCheckedChange={c => updateField('eating_disorder', c)} className="mt-0.5" /><Label htmlFor="eating_disorder" className="text-base leading-relaxed cursor-pointer">Have you experienced an eating disorder (anorexia or bulimia)?</Label></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ===== STEP 3: Emergency Contacts + Correspondence ===== */}
          {!condensedMode && step === 3 && (
            <>
              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Emergency Medical Care Consent</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">List two individuals to be contacted in case of emergency.</p>
                  <div className="border-l-4 border-gold pl-4 space-y-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">Emergency Contact 1</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label htmlFor="emerg1_name" className="text-base font-medium">Name</Label><Input id="emerg1_name" value={formData.emergency_contact_name} onChange={e => updateField('emergency_contact_name', e.target.value)} className="text-base mt-1" /></div>
                      <FormField id="emerg1_phone" label="Phone" error={errors.emergency_contact_phone}><Input id="emerg1_phone" type="tel" value={formData.emergency_contact_phone} onChange={e => updatePhone('emergency_contact_phone', e.target.value)} placeholder="(555) 555-5555" className="text-base mt-1" inputMode="tel" /></FormField>
                      <div><Label htmlFor="emerg1_rel" className="text-base font-medium">Relationship</Label><Input id="emerg1_rel" value={formData.emergency_contact_relationship} onChange={e => updateField('emergency_contact_relationship', e.target.value)} className="text-base mt-1" /></div>
                    </div>
                    <FormField id="emerg1_addr" label="Address"><Input id="emerg1_addr" value={formData.emergency_contact_1_address} onChange={e => updateField('emergency_contact_1_address', e.target.value)} placeholder="Street" className="text-base mt-1" /></FormField>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label htmlFor="emerg1_city" className="text-base font-medium">City</Label><Input id="emerg1_city" value={formData.emergency_contact_1_city} onChange={e => updateField('emergency_contact_1_city', e.target.value)} className="text-base mt-1" /></div>
                      <div><Label htmlFor="emerg1_state" className="text-base font-medium">State</Label><Input id="emerg1_state" value={formData.emergency_contact_1_state} onChange={e => updateField('emergency_contact_1_state', e.target.value)} className="text-base mt-1" maxLength={2} /></div>
                      <div><Label htmlFor="emerg1_zip" className="text-base font-medium">ZIP</Label><Input id="emerg1_zip" value={formData.emergency_contact_1_zip} onChange={e => updateField('emergency_contact_1_zip', e.target.value)} className="text-base mt-1" maxLength={5} /></div>
                    </div>
                  </div>
                  <div className="border-l-4 border-navy-light pl-4 space-y-4">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">Emergency Contact 2</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label htmlFor="emerg2_name" className="text-base font-medium">Name</Label><Input id="emerg2_name" value={formData.emergency_contact_2_name} onChange={e => updateField('emergency_contact_2_name', e.target.value)} className="text-base mt-1" /></div>
                      <FormField id="emerg2_phone" label="Phone" error={errors.emergency_contact_2_phone}><Input id="emerg2_phone" type="tel" value={formData.emergency_contact_2_phone} onChange={e => updatePhone('emergency_contact_2_phone', e.target.value)} placeholder="(555) 555-5555" className="text-base mt-1" inputMode="tel" /></FormField>
                      <div><Label htmlFor="emerg2_rel" className="text-base font-medium">Relationship</Label><Input id="emerg2_rel" value={formData.emergency_contact_2_relationship} onChange={e => updateField('emergency_contact_2_relationship', e.target.value)} className="text-base mt-1" /></div>
                    </div>
                    <FormField id="emerg2_addr" label="Address"><Input id="emerg2_addr" value={formData.emergency_contact_2_address} onChange={e => updateField('emergency_contact_2_address', e.target.value)} placeholder="Street" className="text-base mt-1" /></FormField>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div><Label htmlFor="emerg2_city" className="text-base font-medium">City</Label><Input id="emerg2_city" value={formData.emergency_contact_2_city} onChange={e => updateField('emergency_contact_2_city', e.target.value)} className="text-base mt-1" /></div>
                      <div><Label htmlFor="emerg2_state" className="text-base font-medium">State</Label><Input id="emerg2_state" value={formData.emergency_contact_2_state} onChange={e => updateField('emergency_contact_2_state', e.target.value)} className="text-base mt-1" maxLength={2} /></div>
                      <div><Label htmlFor="emerg2_zip" className="text-base font-medium">ZIP</Label><Input id="emerg2_zip" value={formData.emergency_contact_2_zip} onChange={e => updateField('emergency_contact_2_zip', e.target.value)} className="text-base mt-1" maxLength={5} /></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-navy dark:text-gold">Correspondence, Phone, &amp; Visitation Authorization</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">List up to 5 people authorized for correspondence, phone calls, and visitation. Mark whether each is approved.</p>
                  {formData.correspondence_auth.map((entry, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{idx + 1}</p>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div><Label htmlFor={`corr_${idx}_name`} className="text-sm font-medium">Name</Label><Input id={`corr_${idx}_name`} value={entry.name} onChange={e => updateCorrespondence(idx, 'name', e.target.value)} className="text-base mt-1" /></div>
                        <div><Label htmlFor={`corr_${idx}_rel`} className="text-sm font-medium">Relationship</Label><Input id={`corr_${idx}_rel`} value={entry.relationship} onChange={e => updateCorrespondence(idx, 'relationship', e.target.value)} className="text-base mt-1" /></div>
                        <div><Label htmlFor={`corr_${idx}_phone`} className="text-sm font-medium">Phone</Label><Input id={`corr_${idx}_phone`} type="tel" value={entry.phone} onChange={e => updateCorrespondence(idx, 'phone', formatPhone(e.target.value))} className="text-base mt-1" inputMode="tel" /></div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mr-3">Approved:</Label>
                        <label className="mr-4 inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name={`corr_${idx}_approved`} checked={entry.approved === true} onChange={() => updateCorrespondence(idx, 'approved', true)} className="w-4 h-4" /> Yes
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name={`corr_${idx}_approved`} checked={entry.approved === false} onChange={() => updateCorrespondence(idx, 'approved', false)} className="w-4 h-4" /> No
                        </label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* ===== STEP 4: Legal + Substance Abuse ===== */}
          {!condensedMode && step === 4 && (
            <>
              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Legal History</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">All legal history is kept confidential and is used only for program placement decisions.</p>
                  {[
                    { id: 'legal_super', field: 'under_legal_supervision', label: 'Are you currently or will you be under legal supervision?' },
                    { id: 'mandated', field: 'legally_mandated_treatment', label: 'Are you legally mandated to participate in a drug recovery program?' },
                    { id: 'sex_offender', field: 'sexual_offender_registry', label: 'Are you required to register as a Sexual Offender?' },
                    { id: 'sex_offense', field: 'sexual_offense_charges', label: 'Do you have any pending charges or convictions of a sexual offense?' },
                    { id: 'arson', field: 'arson_charges', label: 'Do you have any pending charges or convictions of arson?' },
                    { id: 'violent', field: 'violent_offense_charges', label: 'Do you have any pending charges or convictions of violent offenses?' },
                  ].map(item => (
                    <div key={item.id} className="flex items-start space-x-3"><Checkbox id={item.id} checked={formData[item.field]} onCheckedChange={c => updateField(item.field, c)} className="mt-0.5" /><Label htmlFor={item.id} className="text-base leading-relaxed cursor-pointer">{item.label}</Label></div>
                  ))}
                  <fieldset>
                    <legend className="text-base font-medium text-slate-700 dark:text-slate-200 mb-3">Pending Legal Matters <span className="text-slate-400 text-xs">(check all that apply)</span></legend>
                    <div className="space-y-3">
                      {[
                        { value: 'arrest_warrant', label: 'Arrest Warrant' },
                        { value: 'court_appearance', label: 'Court Appearance' },
                        { value: 'criminal_charges', label: 'Criminal Charges' },
                        { value: 'sentencing', label: 'Sentencing' },
                      ].map(item => (
                        <div key={item.value} className="flex items-center space-x-3"><Checkbox id={item.value} checked={formData.pending_legal_matters.includes(item.value)} onCheckedChange={() => togglePendingLegal(item.value)} /><Label htmlFor={item.value} className="text-base cursor-pointer">{item.label}</Label></div>
                      ))}
                    </div>
                  </fieldset>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-navy dark:text-gold">Substance Abuse &amp; Treatment History</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <FormField id="prev_treatment" label="Previous Treatment Programs" hint="Include dates, program/facility names, and reason for leaving">
                    <Textarea id="prev_treatment" value={formData.previous_treatment_programs} onChange={e => updateField('previous_treatment_programs', e.target.value)} rows={4} className="text-base mt-1" />
                  </FormField>
                  <FormField id="addiction_details" label="Current Addiction Details" hint="Substance type, length of use, quantity, method, last use date, and why you are applying">
                    <Textarea id="addiction_details" value={formData.addiction_details} onChange={e => updateField('addiction_details', e.target.value)} rows={6} className="text-base mt-1" />
                  </FormField>
                </CardContent>
              </Card>
            </>
          )}

          {/* ===== STEP 5: Acknowledgements + Signature ===== */}
          {!condensedMode && step === 5 && (
            <>
              <Card className="mb-6">
                <CardHeader><CardTitle className="text-navy dark:text-gold">Acknowledgements &amp; Agreements</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Please review and acknowledge each of the following agreements. Your signature at the end applies to all acknowledged sections.</p>
                  {ACKNOWLEDGEMENTS.map(item => (
                    <div key={item.field} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox id={item.field} checked={formData[item.field]} onCheckedChange={c => updateField(item.field, c)} className="mt-0.5" />
                        <div>
                          <Label htmlFor={item.field} className="text-base font-semibold cursor-pointer">{item.label}</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                      {item.field === 'intake_fee_acknowledged' && formData[item.field] && (
                        <div className="mt-3 ml-7 space-y-2">
                          <Label className="text-sm font-medium">Payment Option</Label>
                          <RadioGroup value={formData.intake_fee_option} onValueChange={v => updateField('intake_fee_option', v)}>
                            <div className="space-y-2">
                              {[
                                { value: 'paid_full', label: 'Paid in Full $1,000.00' },
                                { value: '250_down_75_monthly', label: '$250 down plus $75/monthly for 10 months' },
                                { value: '10_payments_100', label: '10 payments of $100/monthly' },
                                { value: 'financial_hardship', label: 'Financial Hardship (please explain below)' },
                              ].map(o => (
                                <div key={o.value} className="flex items-center space-x-2"><RadioGroupItem value={o.value} id={`fee_${o.value}`} /><Label htmlFor={`fee_${o.value}`} className="text-sm cursor-pointer">{o.label}</Label></div>
                              ))}
                            </div>
                          </RadioGroup>
                          {formData.intake_fee_option === 'financial_hardship' && (
                            <Textarea value={formData.intake_fee_hardship_explanation} onChange={e => updateField('intake_fee_hardship_explanation', e.target.value)} rows={3} placeholder="Please explain your financial hardship" className="text-base mt-2" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-navy dark:text-gold">Review &amp; Submit</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-1 text-sm">
                    <p><strong>Name:</strong> {formData.full_legal_name || 'Not provided'}</p>
                    <p><strong>DOB:</strong> {formData.date_of_birth || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {formData.cell_phone || 'Not provided'}</p>
                    <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                    <p><strong>Program:</strong> {formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    By signing below, I certify that all information provided is true and accurate to the best of my knowledge. My signature applies to all acknowledged agreements above.
                  </p>
                  <FormField id="signature" label="Signature (Type your full name)" required error={errors.signature}>
                    <Input id="signature" value={formData.signature} onChange={e => updateField('signature', e.target.value)} placeholder="Type your full legal name" aria-required="true" className="text-base mt-1" />
                  </FormField>
                  <div><Label className="text-base font-medium">Date</Label><Input value={formData.submission_date} readOnly className="bg-slate-100 dark:bg-slate-700 text-base mt-1" /></div>
                  <div className="bg-navy dark:bg-slate-950 text-white p-4 rounded-lg text-center text-sm">
                    <p className="font-semibold">Submit Application To:</p>
                    <p className="mt-1">Mercy House Adult Teen Challenge</p>
                    <p>1110 Mary St, PO Box 266, Georgetown, MS 39078</p>
                    <p>Intake Coordinator: (601) 720-3718</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-semibold">
                <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />Previous
              </Button>
            ) : <div />}
            {step < totalSteps ? (
              <Button type="button" onClick={handleNext} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                Next<ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy px-10 py-6 text-lg font-bold shadow-xl">
                {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />Submitting…</>) : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}