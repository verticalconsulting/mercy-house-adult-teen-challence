import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Validation helpers
const validatePhone = (phone) => {
  if (!phone) return true; // optional unless marked required
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};

const validateEmail = (email) => {
  if (!email) return true; // optional
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
      <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function FormField({ id, label, required, error, hint, children }) {
  return (
    <div>
      <Label htmlFor={id} className="text-base font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        {!required && <span className="text-slate-400 text-xs ml-1">(optional)</span>}
      </Label>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{hint}</p>}
      {children}
      <FieldError message={error} />
    </div>
  );
}

export default function IntakeForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [condensedMode, setCondensedMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    application_type: 'mens_program',
    full_legal_name: '',
    date_of_birth: '',
    biological_sex: 'male',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    home_phone: '',
    cell_phone: '',
    email: '',
    drivers_license: '',
    referral_source: '',
    contact_person_1_name: '',
    contact_person_1_relationship: '',
    contact_person_1_phone: '',
    contact_person_1_email: '',
    under_legal_supervision: false,
    legally_mandated_treatment: false,
    pending_legal_matters: [],
    sexual_offender_registry: false,
    sexual_offense_charges: false,
    arson_charges: false,
    violent_offense_charges: false,
    has_health_insurance: false,
    blood_type: '',
    legally_married: false,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    currently_treated_by_physician: false,
    physician_details: '',
    manual_work_limitations: false,
    exercise_limitations: false,
    recreational_limitations: false,
    allergies: '',
    mental_health_diagnosis: '',
    current_medications: '',
    possibly_pregnant: false,
    eating_disorder: false,
    previous_treatment_programs: '',
    addiction_details: '',
    signature: '',
    submission_date: new Date().toISOString().split('T')[0],
    condensed_mode: false
  });

  // Prefill from cookies/localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('intake_prefill');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (_) {}

    // Try geolocation-based state prefill
    if (!formData.state) {
      try {
        fetch('https://ipapi.co/json/')
          .then(r => r.json())
          .then(data => {
            setFormData(prev => ({
              ...prev,
              city: prev.city || data.city || '',
              state: prev.state || data.region_code || '',
              zip: prev.zip || data.postal || ''
            }));
          })
          .catch(() => {});
      } catch (_) {}
    }
  }, []);

  // Save partial progress
  useEffect(() => {
    const toSave = {
      full_legal_name: formData.full_legal_name,
      cell_phone: formData.cell_phone,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    };
    try { localStorage.setItem('intake_prefill', JSON.stringify(toSave)); } catch (_) {}
  }, [formData.full_legal_name, formData.cell_phone, formData.email, formData.city, formData.state, formData.zip]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updatePhone = (field, value) => {
    updateField(field, formatPhone(value));
  };

  const togglePendingLegal = (value) => {
    setFormData(prev => ({
      ...prev,
      pending_legal_matters: prev.pending_legal_matters.includes(value)
        ? prev.pending_legal_matters.filter(m => m !== value)
        : [...prev.pending_legal_matters, value]
    }));
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!formData.full_legal_name.trim()) newErrors.full_legal_name = 'Full legal name is required.';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required.';
      if (!formData.cell_phone.trim()) {
        newErrors.cell_phone = 'Cell phone is required.';
      } else if (!validatePhone(formData.cell_phone)) {
        newErrors.cell_phone = 'Please enter a valid 10-digit phone number.';
      }
      if (formData.home_phone && !validatePhone(formData.home_phone)) {
        newErrors.home_phone = 'Please enter a valid 10-digit phone number.';
      }
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
      }
      if (formData.contact_person_1_phone && !validatePhone(formData.contact_person_1_phone)) {
        newErrors.contact_person_1_phone = 'Please enter a valid 10-digit phone number.';
      }
      if (formData.contact_person_1_email && !validateEmail(formData.contact_person_1_email)) {
        newErrors.contact_person_1_email = 'Please enter a valid email address.';
      }
    }
    if (s === 3) {
      if (formData.emergency_contact_phone && !validatePhone(formData.emergency_contact_phone)) {
        newErrors.emergency_contact_phone = 'Please enter a valid 10-digit phone number.';
      }
    }
    if (s === 4) {
      if (!formData.signature.trim()) newErrors.signature = 'Signature is required to submit.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      const payload = { ...formData, condensed_mode: condensedMode };
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

  const totalSteps = condensedMode ? 2 : 4;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center p-12">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              Thank you for taking this important step. Our intake team will review your application and contact you within 24–48 hours.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Mercy House Adult &amp; Teen Challenge<br />
              1110 Mary St, PO Box 266<br />
              Georgetown, MS 39078<br />
              Intake Coordinator: (601) 720-3718
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-2">
            Confidential Intake Application
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-1">
            Mercy House Adult &amp; Teen Challenge of Mississippi
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Step {step} of {totalSteps} — {Math.round((step / totalSteps) * 100)}% complete
          </p>
          <div
            className="mt-2 flex justify-center gap-2"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${step} of ${totalSteps}`}
          >
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
              <div
                key={s}
                className={`h-2 w-16 sm:w-20 rounded-full transition-colors ${s <= step ? 'bg-gold' : 'bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-green-700 dark:text-green-400 font-medium">✓ Free program — No cost to apply</p>
        </div>

        {/* Condensed Mode Toggle */}
        {step === 1 && (
          <Card className="mb-6 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 dark:text-blue-200 text-base">Need a shorter form?</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    If the full form is too long or difficult, you can submit a condensed version with just the essential information. Our staff will follow up by phone to collect additional details.
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                      id="condensed_mode"
                      checked={condensedMode}
                      onCheckedChange={(checked) => {
                        setCondensedMode(checked);
                        updateField('condensed_mode', checked);
                      }}
                    />
                    <Label htmlFor="condensed_mode" className="text-base text-blue-800 dark:text-blue-200 cursor-pointer">
                      Use condensed form (name, phone, program — staff will call me)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Intake application form">
          {/* ===== CONDENSED MODE ===== */}
          {condensedMode && step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">Essential Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-base font-semibold">Which program are you applying for? <span className="text-red-500">*</span></Label>
                  <RadioGroup value={formData.application_type} onValueChange={(v) => updateField('application_type', v)} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="mens_program" id="mens_c" />
                      <Label htmlFor="mens_c" className="text-base cursor-pointer">Men's Campus</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="womens_program" id="womens_c" />
                      <Label htmlFor="womens_c" className="text-base cursor-pointer">Women's Campus</Label>
                    </div>
                  </RadioGroup>
                </div>

                <FormField id="full_legal_name_c" label="Full Legal Name" required error={errors.full_legal_name}>
                  <Input
                    id="full_legal_name_c"
                    value={formData.full_legal_name}
                    onChange={e => updateField('full_legal_name', e.target.value)}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-invalid={!!errors.full_legal_name}
                    className="text-base mt-1"
                    autoComplete="name"
                  />
                </FormField>

                <FormField id="cell_phone_c" label="Best Phone Number to Reach You" required error={errors.cell_phone}
                  hint="We'll call you to complete your application.">
                  <Input
                    id="cell_phone_c"
                    type="tel"
                    value={formData.cell_phone}
                    onChange={e => updatePhone('cell_phone', e.target.value)}
                    placeholder="(555) 555-5555"
                    aria-required="true"
                    aria-invalid={!!errors.cell_phone}
                    className="text-base mt-1"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </FormField>

                <FormField id="dob_c" label="Date of Birth" required error={errors.date_of_birth}>
                  <Input
                    id="dob_c"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={e => updateField('date_of_birth', e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.date_of_birth}
                    className="text-base mt-1"
                    autoComplete="bday"
                  />
                </FormField>

                <FormField id="email_c" label="Email Address" error={errors.email}>
                  <Input
                    id="email_c"
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className="text-base mt-1"
                    autoComplete="email"
                    inputMode="email"
                  />
                </FormField>

                <div className="bg-navy/5 dark:bg-gold/10 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300">
                  <p>After you submit, our intake coordinator will call you to gather additional information. You can also reach us directly at <strong>(601) 720-3718</strong>.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {condensedMode && step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">Review &amp; Submit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-1">
                  <p><strong>Program:</strong> {formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}</p>
                  <p><strong>Name:</strong> {formData.full_legal_name || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {formData.cell_phone || 'Not provided'}</p>
                  <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  By signing below, I authorize Mercy House Adult &amp; Teen Challenge of Mississippi to contact me and begin my intake process. I understand staff will follow up by phone to gather additional information.
                </p>
                <FormField id="signature_c" label="Signature (Type your full name)" required error={errors.signature}>
                  <Input
                    id="signature_c"
                    value={formData.signature}
                    onChange={e => updateField('signature', e.target.value)}
                    placeholder="Type your full legal name"
                    aria-required="true"
                    aria-invalid={!!errors.signature}
                    className="text-base mt-1"
                  />
                </FormField>
              </CardContent>
            </Card>
          )}

          {/* ===== FULL FORM ===== */}
          {!condensedMode && step === 1 && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Program Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.application_type} onValueChange={(v) => updateField('application_type', v)}>
                    <div className="flex items-center space-x-3 mb-3">
                      <RadioGroupItem value="mens_program" id="mens" />
                      <Label htmlFor="mens" className="text-base cursor-pointer">Men's Campus</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="womens_program" id="womens" />
                      <Label htmlFor="womens" className="text-base cursor-pointer">Women's Campus</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Personal Information <span className="text-sm font-normal text-slate-500">— Confidential</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField id="full_legal_name" label="Full Legal Name" required error={errors.full_legal_name}>
                    <Input id="full_legal_name" value={formData.full_legal_name} onChange={e => updateField('full_legal_name', e.target.value)}
                      placeholder="Enter your full legal name" aria-required="true" aria-invalid={!!errors.full_legal_name}
                      className="text-base mt-1" autoComplete="name" />
                  </FormField>

                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="dob" label="Date of Birth" required error={errors.date_of_birth}>
                      <Input id="dob" type="date" value={formData.date_of_birth} onChange={e => updateField('date_of_birth', e.target.value)}
                        aria-required="true" aria-invalid={!!errors.date_of_birth} className="text-base mt-1" autoComplete="bday" />
                    </FormField>
                    <div>
                      <Label htmlFor="bio_sex" className="text-base font-medium text-slate-700 dark:text-slate-200">
                        Biological Sex <span className="text-slate-400 text-xs">(optional)</span>
                      </Label>
                      <Select value={formData.biological_sex} onValueChange={v => updateField('biological_sex', v)}>
                        <SelectTrigger id="bio_sex" className="mt-1 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <FormField id="ssn" label="Social Security Number" hint="Used for enrollment records only">
                    <Input id="ssn" value={formData.ssn} onChange={e => updateField('ssn', e.target.value)}
                      placeholder="XXX-XX-XXXX" className="text-base mt-1" autoComplete="off" />
                  </FormField>

                  <FormField id="address" label="Street Address">
                    <Input id="address" value={formData.address} onChange={e => updateField('address', e.target.value)}
                      placeholder="Street address" className="text-base mt-1" autoComplete="street-address" />
                  </FormField>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-base font-medium text-slate-700 dark:text-slate-200">City <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Input id="city" value={formData.city} onChange={e => updateField('city', e.target.value)} className="text-base mt-1" autoComplete="address-level2" />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-base font-medium text-slate-700 dark:text-slate-200">State <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Input id="state" value={formData.state} onChange={e => updateField('state', e.target.value)} className="text-base mt-1" autoComplete="address-level1" maxLength={2} />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-base font-medium text-slate-700 dark:text-slate-200">ZIP <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Input id="zip" value={formData.zip} onChange={e => updateField('zip', e.target.value)} className="text-base mt-1" autoComplete="postal-code" inputMode="numeric" maxLength={5} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="home_phone" label="Home Phone" error={errors.home_phone}>
                      <Input id="home_phone" type="tel" value={formData.home_phone} onChange={e => updatePhone('home_phone', e.target.value)}
                        placeholder="(555) 555-5555" aria-invalid={!!errors.home_phone} className="text-base mt-1" autoComplete="tel" inputMode="tel" />
                    </FormField>
                    <FormField id="cell_phone" label="Cell Phone" required error={errors.cell_phone}>
                      <Input id="cell_phone" type="tel" value={formData.cell_phone} onChange={e => updatePhone('cell_phone', e.target.value)}
                        placeholder="(555) 555-5555" aria-required="true" aria-invalid={!!errors.cell_phone} className="text-base mt-1" autoComplete="tel" inputMode="tel" />
                    </FormField>
                  </div>

                  <FormField id="email" label="Email Address" error={errors.email}>
                    <Input id="email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)}
                      placeholder="you@example.com" aria-invalid={!!errors.email} className="text-base mt-1" autoComplete="email" inputMode="email" />
                  </FormField>

                  <div>
                    <Label className="text-base font-medium text-slate-700 dark:text-slate-200 mb-2 block">
                      Driver's License <span className="text-slate-400 text-xs">(optional)</span>
                    </Label>
                    <RadioGroup value={formData.drivers_license} onValueChange={v => updateField('drivers_license', v)}>
                      <div className="flex flex-wrap gap-4">
                        {['yes', 'no', 'expired', 'suspended'].map(v => (
                          <div key={v} className="flex items-center space-x-2">
                            <RadioGroupItem value={v} id={`dl_${v}`} />
                            <Label htmlFor={`dl_${v}`} className="text-base cursor-pointer capitalize">{v}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <FormField id="referral" label="How were you referred to us?">
                    <Input id="referral" value={formData.referral_source} onChange={e => updateField('referral_source', e.target.value)}
                      placeholder="Friend, doctor, church, internet…" className="text-base mt-1" />
                  </FormField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Contact Person <span className="text-sm font-normal text-slate-500">(optional)</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Someone we can contact about your application status</p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contact1_name" className="text-base font-medium text-slate-700 dark:text-slate-200">Name <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Input id="contact1_name" value={formData.contact_person_1_name} onChange={e => updateField('contact_person_1_name', e.target.value)} className="text-base mt-1" autoComplete="off" />
                    </div>
                    <div>
                      <Label htmlFor="contact1_rel" className="text-base font-medium text-slate-700 dark:text-slate-200">Relationship <span className="text-slate-400 text-xs">(optional)</span></Label>
                      <Input id="contact1_rel" value={formData.contact_person_1_relationship} onChange={e => updateField('contact_person_1_relationship', e.target.value)} className="text-base mt-1" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField id="contact1_phone" label="Phone" error={errors.contact_person_1_phone}>
                      <Input id="contact1_phone" type="tel" value={formData.contact_person_1_phone}
                        onChange={e => updatePhone('contact_person_1_phone', e.target.value)}
                        placeholder="(555) 555-5555" aria-invalid={!!errors.contact_person_1_phone} className="text-base mt-1" inputMode="tel" />
                    </FormField>
                    <FormField id="contact1_email" label="Email" error={errors.contact_person_1_email}>
                      <Input id="contact1_email" type="email" value={formData.contact_person_1_email}
                        onChange={e => updateField('contact_person_1_email', e.target.value)}
                        placeholder="contact@example.com" aria-invalid={!!errors.contact_person_1_email} className="text-base mt-1" inputMode="email" />
                    </FormField>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!condensedMode && step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">Legal History</CardTitle>
              </CardHeader>
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
                  <div key={item.id} className="flex items-start space-x-3">
                    <Checkbox id={item.id} checked={formData[item.field]} onCheckedChange={c => updateField(item.field, c)} className="mt-0.5" />
                    <Label htmlFor={item.id} className="text-base leading-relaxed cursor-pointer">{item.label}</Label>
                  </div>
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
                      <div key={item.value} className="flex items-center space-x-3">
                        <Checkbox id={item.value} checked={formData.pending_legal_matters.includes(item.value)} onCheckedChange={() => togglePendingLegal(item.value)} />
                        <Label htmlFor={item.value} className="text-base cursor-pointer">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          )}

          {!condensedMode && step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Mercy House is committed to helping students become physically, mentally, and spiritually whole. We are not a medical program. You are responsible for any fees for medical treatment.
                </p>

                <div className="flex items-center space-x-3">
                  <Checkbox id="insurance" checked={formData.has_health_insurance} onCheckedChange={c => updateField('has_health_insurance', c)} />
                  <Label htmlFor="insurance" className="text-base cursor-pointer">I have health insurance</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="blood_type" className="text-base font-medium text-slate-700 dark:text-slate-200">
                      Blood Type <span className="text-slate-400 text-xs">(optional)</span>
                    </Label>
                    <Input id="blood_type" value={formData.blood_type} onChange={e => updateField('blood_type', e.target.value)} placeholder="e.g., O+" className="text-base mt-1" />
                  </div>
                  <div className="flex items-center space-x-3 pt-6">
                    <Checkbox id="married" checked={formData.legally_married} onCheckedChange={c => updateField('legally_married', c)} />
                    <Label htmlFor="married" className="text-base cursor-pointer">Legally Married</Label>
                  </div>
                </div>

                <fieldset className="border-t pt-5">
                  <legend className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-3">Emergency Contact <span className="text-slate-400 text-xs font-normal">(optional)</span></legend>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emerg_name" className="text-base font-medium">Name</Label>
                      <Input id="emerg_name" value={formData.emergency_contact_name} onChange={e => updateField('emergency_contact_name', e.target.value)} className="text-base mt-1" autoComplete="off" />
                    </div>
                    <FormField id="emerg_phone" label="Phone" error={errors.emergency_contact_phone}>
                      <Input id="emerg_phone" type="tel" value={formData.emergency_contact_phone}
                        onChange={e => updatePhone('emergency_contact_phone', e.target.value)}
                        placeholder="(555) 555-5555" aria-invalid={!!errors.emergency_contact_phone} className="text-base mt-1" inputMode="tel" />
                    </FormField>
                    <div>
                      <Label htmlFor="emerg_rel" className="text-base font-medium">Relationship</Label>
                      <Input id="emerg_rel" value={formData.emergency_contact_relationship} onChange={e => updateField('emergency_contact_relationship', e.target.value)} className="text-base mt-1" />
                    </div>
                  </div>
                </fieldset>

                <div className="flex items-start space-x-3">
                  <Checkbox id="physician" checked={formData.currently_treated_by_physician} onCheckedChange={c => updateField('currently_treated_by_physician', c)} className="mt-0.5" />
                  <Label htmlFor="physician" className="text-base leading-relaxed cursor-pointer">I am currently being treated by a physician</Label>
                </div>

                {formData.currently_treated_by_physician && (
                  <div>
                    <Label htmlFor="physician_details" className="text-base font-medium">Physician Details <span className="text-slate-400 text-xs">(optional)</span></Label>
                    <Textarea id="physician_details" value={formData.physician_details} onChange={e => updateField('physician_details', e.target.value)} rows={2} className="text-base mt-1" />
                  </div>
                )}

                <fieldset>
                  <legend className="text-base font-medium text-slate-700 dark:text-slate-200 mb-2">Physical Limitations <span className="text-slate-400 text-xs font-normal">(check if any apply)</span></legend>
                  <p className="text-sm text-slate-500 mb-3">Would any injury or illness affect your ability to participate in:</p>
                  {[
                    { id: 'manual_work', field: 'manual_work_limitations', label: 'Manual Work (includes 35–40 hrs/week of vocational training)' },
                    { id: 'exercise', field: 'exercise_limitations', label: 'Exercise Programs' },
                    { id: 'recreation', field: 'recreational_limitations', label: 'Recreational Activities' },
                  ].map(item => (
                    <div key={item.id} className="flex items-start space-x-3 mb-2">
                      <Checkbox id={item.id} checked={formData[item.field]} onCheckedChange={c => updateField(item.field, c)} className="mt-0.5" />
                      <Label htmlFor={item.id} className="text-base leading-relaxed cursor-pointer">{item.label}</Label>
                    </div>
                  ))}
                </fieldset>

                <div>
                  <Label htmlFor="allergies" className="text-base font-medium">Allergies <span className="text-slate-400 text-xs">(optional)</span></Label>
                  <Textarea id="allergies" value={formData.allergies} onChange={e => updateField('allergies', e.target.value)} rows={2} className="text-base mt-1" />
                </div>

                <div>
                  <Label htmlFor="mental_health" className="text-base font-medium">Mental Health Diagnosis <span className="text-slate-400 text-xs">(optional)</span></Label>
                  <p className="text-sm text-slate-500 mb-1">List any diagnosis from a doctor, including date and treatment</p>
                  <Textarea id="mental_health" value={formData.mental_health_diagnosis} onChange={e => updateField('mental_health_diagnosis', e.target.value)} rows={3} className="text-base mt-1" />
                </div>

                <div>
                  <Label htmlFor="medications" className="text-base font-medium">Current Medications <span className="text-slate-400 text-xs">(optional)</span></Label>
                  <p className="text-sm text-slate-500 mb-1">List all prescriptions including dose, frequency, and reason</p>
                  <Textarea id="medications" value={formData.current_medications} onChange={e => updateField('current_medications', e.target.value)} rows={3} className="text-base mt-1" />
                </div>

                {formData.application_type === 'womens_program' && (
                  <div className="flex items-center space-x-3">
                    <Checkbox id="pregnant" checked={formData.possibly_pregnant} onCheckedChange={c => updateField('possibly_pregnant', c)} />
                    <Label htmlFor="pregnant" className="text-base cursor-pointer">I may currently be pregnant</Label>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!condensedMode && step === 4 && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Substance Abuse &amp; Treatment History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="eating_disorder" checked={formData.eating_disorder} onCheckedChange={c => updateField('eating_disorder', c)} className="mt-0.5" />
                    <Label htmlFor="eating_disorder" className="text-base leading-relaxed cursor-pointer">Have you experienced an eating disorder (anorexia or bulimia)?</Label>
                  </div>

                  <div>
                    <Label htmlFor="prev_treatment" className="text-base font-medium">Previous Treatment Programs <span className="text-slate-400 text-xs">(optional)</span></Label>
                    <p className="text-sm text-slate-500 mb-1">Include dates, program/facility names, and reason for leaving</p>
                    <Textarea id="prev_treatment" value={formData.previous_treatment_programs} onChange={e => updateField('previous_treatment_programs', e.target.value)} rows={4} className="text-base mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="addiction_details" className="text-base font-medium">Current Addiction Details <span className="text-slate-400 text-xs">(optional)</span></Label>
                    <p className="text-sm text-slate-500 mb-1">Substance type, length of use, quantity, method, last use date, and why you are applying</p>
                    <Textarea id="addiction_details" value={formData.addiction_details} onChange={e => updateField('addiction_details', e.target.value)} rows={6} className="text-base mt-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Review &amp; Submit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-1 text-sm">
                    <p><strong>Name:</strong> {formData.full_legal_name || 'Not provided'}</p>
                    <p><strong>DOB:</strong> {formData.date_of_birth || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {formData.cell_phone || 'Not provided'}</p>
                    <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                    <p><strong>Program:</strong> {formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}</p>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    By signing below, I authorize the tests listed to be completed and information sent to Mercy House Adult &amp; Teen Challenge of Mississippi. I certify that all information provided is true and accurate to the best of my knowledge.
                  </p>

                  <FormField id="signature" label="Signature (Type your full name)" required error={errors.signature}>
                    <Input id="signature" value={formData.signature} onChange={e => updateField('signature', e.target.value)}
                      placeholder="Type your full legal name" aria-required="true" aria-invalid={!!errors.signature} className="text-base mt-1" />
                  </FormField>

                  <div>
                    <Label className="text-base font-medium">Date</Label>
                    <Input value={formData.submission_date} readOnly className="bg-slate-100 dark:bg-slate-700 text-base mt-1" aria-readonly="true" />
                  </div>

                  <div className="bg-navy dark:bg-slate-950 text-white p-4 rounded-lg text-center text-sm">
                    <p className="font-semibold">Submit Application To:</p>
                    <p className="mt-1">Mercy House Adult &amp; Teen Challenge of Mississippi</p>
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
                <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Previous
              </Button>
            ) : <div />}

            {step < totalSteps ? (
              <Button type="button" onClick={handleNext} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                Next
                <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy px-10 py-6 text-lg font-bold shadow-xl">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}