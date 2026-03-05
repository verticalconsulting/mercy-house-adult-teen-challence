import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function IntakeForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
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
    drivers_license: 'yes',
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
    submission_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.Application.create(formData);
      
      await base44.integrations.Core.SendEmail({
        to: 'intake@mercyhouse.org',
        subject: `New ${formData.application_type === 'mens_program' ? "Men's" : "Women's"} Program Application - ${formData.full_legal_name}`,
        body: `
          New application received:
          
          Name: ${formData.full_legal_name}
          Phone: ${formData.cell_phone}
          Email: ${formData.email}
          Program: ${formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}
          
          Please review in the employee portal.
        `
      });

      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePendingLegal = (value) => {
    setFormData(prev => ({
      ...prev,
      pending_legal_matters: prev.pending_legal_matters.includes(value)
        ? prev.pending_legal_matters.filter(m => m !== value)
        : [...prev.pending_legal_matters, value]
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center p-12">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              Thank you for taking this important step. Our intake team will review your application and contact you within 24-48 hours.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Mercy House Adult & Teen Challenge<br/>
              1110 Mary St, PO Box 266<br/>
              Georgetown, MS 39078<br/>
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-2">
            Confidential Intake Application
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-1">
            Mercy House Adult & Teen Challenge of Mississippi
          </p>
          {/* Commitment & Consistency: show progress to build momentum */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Step {step} of 4 — {Math.round((step / 4) * 100)}% complete</p>
          <div
            className="mt-2 flex justify-center gap-2"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={4}
            aria-label={`Step ${step} of 4`}
          >
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 w-16 sm:w-20 rounded-full transition-colors ${s <= step ? 'bg-gold' : 'bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
          {/* Regret aversion: this is free */}
          <p className="mt-3 text-sm text-green-700 dark:text-green-400 font-medium">✓ Free program — No cost to apply</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Program Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.application_type} onValueChange={(value) => updateField('application_type', value)}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="mens_program" id="mens" />
                      <Label htmlFor="mens">Men's Campus</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="womens_program" id="womens" />
                      <Label htmlFor="womens">Women's Campus</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Personal Information - Confidential</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="full_legal_name">Full Legal Name *</Label>
                    <Input id="full_legal_name" required value={formData.full_legal_name} onChange={(e) => updateField('full_legal_name', e.target.value)} placeholder="Enter your full legal name" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" type="date" required value={formData.date_of_birth} onChange={(e) => updateField('date_of_birth', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="bio_sex">Biological Sex</Label>
                      <Select value={formData.biological_sex} onValueChange={(value) => updateField('biological_sex', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ssn">Social Security Number</Label>
                    <Input id="ssn" value={formData.ssn} onChange={(e) => updateField('ssn', e.target.value)} placeholder="XXX-XX-XXXX" />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Street address" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={formData.state} onChange={(e) => updateField('state', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip</Label>
                      <Input id="zip" value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="home_phone">Home Phone</Label>
                      <Input id="home_phone" type="tel" value={formData.home_phone} onChange={(e) => updateField('home_phone', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="cell_phone">Cell Phone *</Label>
                      <Input id="cell_phone" type="tel" required value={formData.cell_phone} onChange={(e) => updateField('cell_phone', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                  </div>

                  <div>
                    <Label>Driver's License</Label>
                    <RadioGroup value={formData.drivers_license} onValueChange={(value) => updateField('drivers_license', value)}>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="dl_yes" />
                          <Label htmlFor="dl_yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="dl_no" />
                          <Label htmlFor="dl_no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expired" id="dl_exp" />
                          <Label htmlFor="dl_exp">Expired</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="suspended" id="dl_susp" />
                          <Label htmlFor="dl_susp">Suspended</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="referral">How were you referred to us?</Label>
                    <Input id="referral" value={formData.referral_source} onChange={(e) => updateField('referral_source', e.target.value)} placeholder="Select referral source" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Contact Persons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">People we can contact regarding your application status</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact1_name">Contact 1 Name</Label>
                      <Input id="contact1_name" value={formData.contact_person_1_name} onChange={(e) => updateField('contact_person_1_name', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="contact1_rel">Relationship</Label>
                      <Input id="contact1_rel" value={formData.contact_person_1_relationship} onChange={(e) => updateField('contact_person_1_relationship', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact1_phone">Phone</Label>
                      <Input id="contact1_phone" type="tel" value={formData.contact_person_1_phone} onChange={(e) => updateField('contact_person_1_phone', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="contact1_email">Email</Label>
                      <Input id="contact1_email" type="email" value={formData.contact_person_1_email} onChange={(e) => updateField('contact_person_1_email', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 2: Legal History */}
          {step === 2 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Legal History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="legal_super" checked={formData.under_legal_supervision} onCheckedChange={(checked) => updateField('under_legal_supervision', checked)} />
                    <Label htmlFor="legal_super">Are you currently or will you be under legal supervision?</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="mandated" checked={formData.legally_mandated_treatment} onCheckedChange={(checked) => updateField('legally_mandated_treatment', checked)} />
                    <Label htmlFor="mandated">Are you legally mandated to participate in a drug recovery program?</Label>
                  </div>

                  <div>
                    <Label className="mb-3 block">Pending Legal Matters</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="warrant" checked={formData.pending_legal_matters.includes('arrest_warrant')} onCheckedChange={() => togglePendingLegal('arrest_warrant')} />
                        <Label htmlFor="warrant">Arrest Warrant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="court" checked={formData.pending_legal_matters.includes('court_appearance')} onCheckedChange={() => togglePendingLegal('court_appearance')} />
                        <Label htmlFor="court">Court Appearance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="charges" checked={formData.pending_legal_matters.includes('criminal_charges')} onCheckedChange={() => togglePendingLegal('criminal_charges')} />
                        <Label htmlFor="charges">Criminal Charges</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sentencing" checked={formData.pending_legal_matters.includes('sentencing')} onCheckedChange={() => togglePendingLegal('sentencing')} />
                        <Label htmlFor="sentencing">Sentencing</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="sex_offender" checked={formData.sexual_offender_registry} onCheckedChange={(checked) => updateField('sexual_offender_registry', checked)} />
                    <Label htmlFor="sex_offender">Are you required to register as a Sexual Offender?</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="sex_offense" checked={formData.sexual_offense_charges} onCheckedChange={(checked) => updateField('sexual_offense_charges', checked)} />
                    <Label htmlFor="sex_offense">Do you have any pending charges or convictions of a sexual offense?</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="arson" checked={formData.arson_charges} onCheckedChange={(checked) => updateField('arson_charges', checked)} />
                    <Label htmlFor="arson">Do you have any pending charges or convictions of arson?</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="violent" checked={formData.violent_offense_charges} onCheckedChange={(checked) => updateField('violent_offense_charges', checked)} />
                    <Label htmlFor="violent">Do you have any pending charges or convictions of violent offenses?</Label>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 3: Medical Information */}
          {step === 3 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Mercy House is committed to helping students become physically, mentally and spiritually whole. We are not, however, a medical program. You are responsible for any fees that accrue in connection with medical treatment.
                  </p>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="insurance" checked={formData.has_health_insurance} onCheckedChange={(checked) => updateField('has_health_insurance', checked)} />
                    <Label htmlFor="insurance">Do you have health insurance?</Label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blood_type">Blood Type (for emergencies)</Label>
                      <Input id="blood_type" value={formData.blood_type} onChange={(e) => updateField('blood_type', e.target.value)} placeholder="e.g., O+" />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox id="married" checked={formData.legally_married} onCheckedChange={(checked) => updateField('legally_married', checked)} />
                      <Label htmlFor="married">Legally Married?</Label>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="emerg_name">Name</Label>
                        <Input id="emerg_name" value={formData.emergency_contact_name} onChange={(e) => updateField('emergency_contact_name', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="emerg_phone">Phone</Label>
                        <Input id="emerg_phone" type="tel" value={formData.emergency_contact_phone} onChange={(e) => updateField('emergency_contact_phone', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="emerg_rel">Relationship</Label>
                        <Input id="emerg_rel" value={formData.emergency_contact_relationship} onChange={(e) => updateField('emergency_contact_relationship', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="physician" checked={formData.currently_treated_by_physician} onCheckedChange={(checked) => updateField('currently_treated_by_physician', checked)} />
                    <Label htmlFor="physician">Are you currently being treated by a physician?</Label>
                  </div>

                  {formData.currently_treated_by_physician && (
                    <div>
                      <Label htmlFor="physician_details">Physician Details</Label>
                      <Textarea id="physician_details" value={formData.physician_details} onChange={(e) => updateField('physician_details', e.target.value)} rows={2} />
                    </div>
                  )}

                  <div>
                    <Label className="mb-3 block">Physical Limitations - Would any injury or illness affect your ability to participate in:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="manual_work" checked={formData.manual_work_limitations} onCheckedChange={(checked) => updateField('manual_work_limitations', checked)} />
                        <Label htmlFor="manual_work">Manual Work (includes 35-40hrs/week of vocational training)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="exercise" checked={formData.exercise_limitations} onCheckedChange={(checked) => updateField('exercise_limitations', checked)} />
                        <Label htmlFor="exercise">Exercise Programs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="recreation" checked={formData.recreational_limitations} onCheckedChange={(checked) => updateField('recreational_limitations', checked)} />
                        <Label htmlFor="recreation">Recreational Activities</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="allergies">Do you have any allergies?</Label>
                    <Textarea id="allergies" value={formData.allergies} onChange={(e) => updateField('allergies', e.target.value)} rows={2} />
                  </div>

                  <div>
                    <Label htmlFor="mental_health">Mental Health - List any Mental Health Diagnosis from a Doctor</Label>
                    <Textarea id="mental_health" value={formData.mental_health_diagnosis} onChange={(e) => updateField('mental_health_diagnosis', e.target.value)} placeholder="Include date of diagnosis and any current treatment" rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea id="medications" value={formData.current_medications} onChange={(e) => updateField('current_medications', e.target.value)} placeholder="List all current prescription medications including dose, frequency, and reason" rows={3} />
                  </div>

                  {formData.application_type === 'womens_program' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pregnant" checked={formData.possibly_pregnant} onCheckedChange={(checked) => updateField('possibly_pregnant', checked)} />
                      <Label htmlFor="pregnant">Do you think you could be pregnant at this time?</Label>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 4: Substance Abuse & Signature */}
          {step === 4 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Substance Abuse & Treatment History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="eating_disorder" checked={formData.eating_disorder} onCheckedChange={(checked) => updateField('eating_disorder', checked)} />
                    <Label htmlFor="eating_disorder">Have you experienced an eating disorder (anorexia or bulimia)?</Label>
                  </div>

                  <div>
                    <Label htmlFor="prev_treatment">Previous Treatment Programs</Label>
                    <Textarea id="prev_treatment" value={formData.previous_treatment_programs} onChange={(e) => updateField('previous_treatment_programs', e.target.value)} placeholder="Indicate alcohol, drug, and medical programs you have attended. List dates, program/facility names, and reason for leaving each program..." rows={4} />
                  </div>

                  <div>
                    <Label htmlFor="addiction_details">Current Addiction Details</Label>
                    <Textarea id="addiction_details" value={formData.addiction_details} onChange={(e) => updateField('addiction_details', e.target.value)} placeholder="Please indicate type of substance, length of use, approximate quantity, method of use, last day of use, and why you are applying for this program. Describe your addiction history in detail..." rows={6} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">Review & Submit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Application Summary</h3>
                    <p><strong>Name:</strong> {formData.full_legal_name || 'Not provided'}</p>
                    <p><strong>DOB:</strong> {formData.date_of_birth || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {formData.cell_phone || 'Not provided'}</p>
                    <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    By signing below, I authorize the tests listed to be completed and information sent to Mercy House Adult & Teen Challenge of Mississippi. I certify that all information provided is true and accurate to the best of my knowledge.
                  </p>

                  <div>
                    <Label htmlFor="signature">Signature (Type your full name) *</Label>
                    <Input id="signature" required value={formData.signature} onChange={(e) => updateField('signature', e.target.value)} placeholder="Type your full legal name" />
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input value={formData.submission_date} readOnly className="bg-slate-100 dark:bg-slate-700" />
                  </div>

                  <div className="bg-navy dark:bg-slate-950 text-white p-4 rounded-lg text-center">
                    <p className="font-semibold">Submit Application To:</p>
                    <p className="mt-2">Mercy House Adult & Teen Challenge of Mississippi</p>
                    <p>1110 Mary St, PO Box 266, Georgetown, MS 39078</p>
                    <p>Intake Coordinator: (601) 720-3718</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="font-semibold">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {step < 4 ? (
              <Button type="button" onClick={() => setStep(step + 1)} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="ml-auto bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy px-12 py-6 text-lg font-bold shadow-xl">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}