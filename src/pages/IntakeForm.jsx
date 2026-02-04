import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function IntakeForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    application_type: 'mens_program',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    referred_by: '',
    has_substance_abuse: false,
    primary_substance: '',
    length_of_use: '',
    has_legal_issues: false,
    legal_details: '',
    has_medical_conditions: false,
    medical_details: '',
    medications: '',
    has_mental_health_diagnosis: false,
    mental_health_details: '',
    has_children: false,
    children_details: '',
    employment_status: 'unemployed',
    income_source: '',
    goals: '',
    additional_information: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.Application.create(formData);
      
      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: 'intake@mercyhouse.org',
        subject: `New ${formData.application_type === 'mens_program' ? "Men's" : "Women's"} Program Application - ${formData.first_name} ${formData.last_name}`,
        body: `
          New application received:
          
          Name: ${formData.first_name} ${formData.last_name}
          Phone: ${formData.phone}
          Email: ${formData.email}
          Program: ${formData.application_type === 'mens_program' ? "Men's Campus" : "Women's Campus"}
          
          Please review in the admin dashboard.
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
              If you have urgent questions, please call us at (555) 123-4567
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
          <h1 className="text-4xl font-bold text-navy dark:text-gold mb-4">
            Confidential Intake Application
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            All information provided is strictly confidential and will be used only for program placement purposes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Program Selection */}
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

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => updateField('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_name">Contact Name</Label>
                  <Input
                    id="emergency_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Contact Phone</Label>
                  <Input
                    id="emergency_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergency_relationship">Relationship</Label>
                <Input
                  id="emergency_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => updateField('emergency_contact_relationship', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Background Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold">Background Information</CardTitle>
              <CardDescription>This helps us provide the best support for your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="referred_by">How did you hear about us?</Label>
                <Input
                  id="referred_by"
                  value={formData.referred_by}
                  onChange={(e) => updateField('referred_by', e.target.value)}
                  placeholder="Friend, church, website, etc."
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="substance_abuse"
                    checked={formData.has_substance_abuse}
                    onCheckedChange={(checked) => updateField('has_substance_abuse', checked)}
                  />
                  <Label htmlFor="substance_abuse">Struggling with substance abuse?</Label>
                </div>

                {formData.has_substance_abuse && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label htmlFor="primary_substance">Primary substance</Label>
                      <Input
                        id="primary_substance"
                        value={formData.primary_substance}
                        onChange={(e) => updateField('primary_substance', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="length_of_use">Length of use</Label>
                      <Input
                        id="length_of_use"
                        value={formData.length_of_use}
                        onChange={(e) => updateField('length_of_use', e.target.value)}
                        placeholder="e.g., 5 years"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legal_issues"
                    checked={formData.has_legal_issues}
                    onCheckedChange={(checked) => updateField('has_legal_issues', checked)}
                  />
                  <Label htmlFor="legal_issues">Any pending legal issues?</Label>
                </div>

                {formData.has_legal_issues && (
                  <div className="ml-6">
                    <Label htmlFor="legal_details">Please explain</Label>
                    <Textarea
                      id="legal_details"
                      value={formData.legal_details}
                      onChange={(e) => updateField('legal_details', e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medical"
                    checked={formData.has_medical_conditions}
                    onCheckedChange={(checked) => updateField('has_medical_conditions', checked)}
                  />
                  <Label htmlFor="medical">Any medical conditions?</Label>
                </div>

                {formData.has_medical_conditions && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label htmlFor="medical_details">Medical conditions</Label>
                      <Textarea
                        id="medical_details"
                        value={formData.medical_details}
                        onChange={(e) => updateField('medical_details', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medications">Current medications</Label>
                      <Textarea
                        id="medications"
                        value={formData.medications}
                        onChange={(e) => updateField('medications', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mental_health"
                    checked={formData.has_mental_health_diagnosis}
                    onCheckedChange={(checked) => updateField('has_mental_health_diagnosis', checked)}
                  />
                  <Label htmlFor="mental_health">Any mental health diagnosis?</Label>
                </div>

                {formData.has_mental_health_diagnosis && (
                  <div className="ml-6">
                    <Label htmlFor="mental_health_details">Please explain</Label>
                    <Textarea
                      id="mental_health_details"
                      value={formData.mental_health_details}
                      onChange={(e) => updateField('mental_health_details', e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="children"
                    checked={formData.has_children}
                    onCheckedChange={(checked) => updateField('has_children', checked)}
                  />
                  <Label htmlFor="children">Do you have children?</Label>
                </div>

                {formData.has_children && (
                  <div className="ml-6">
                    <Label htmlFor="children_details">Ages and custody information</Label>
                    <Textarea
                      id="children_details"
                      value={formData.children_details}
                      onChange={(e) => updateField('children_details', e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select value={formData.employment_status} onValueChange={(value) => updateField('employment_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="income">Source of income (if any)</Label>
                <Input
                  id="income"
                  value={formData.income_source}
                  onChange={(e) => updateField('income_source', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold">Your Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="goals">What are your goals for this program?</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                  rows={4}
                  placeholder="Share what you hope to achieve..."
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="additional">Additional information</Label>
                <Textarea
                  id="additional"
                  value={formData.additional_information}
                  onChange={(e) => updateField('additional_information', e.target.value)}
                  rows={3}
                  placeholder="Anything else you'd like us to know..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy px-12 py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}