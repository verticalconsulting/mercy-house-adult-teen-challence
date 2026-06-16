import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Users, Clock, CheckCircle, ArrowRight, Wrench, BookOpen, Home, Truck } from 'lucide-react';

export default function Volunteer() {
  const [state, handleFormspreeSubmit] = useForm('meedjkqo');
  const [availability, setAvailability] = useState([]);
  const [areasOfInterest, setAreasOfInterest] = useState([]);
  const [backgroundConsent, setBackgroundConsent] = useState(false);
  const [felonyConvicted, setFelonyConvicted] = useState('');
  const [usCitizen, setUsCitizen] = useState('');
  const [volunteeredBefore, setVolunteeredBefore] = useState('');

  const toggleCheckbox = (setter, list, value) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    // Save to Volunteer entity to keep automations working
    try {
      await base44.entities.Volunteer.create({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        date_of_birth: data.date_of_birth,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        emergency_contact_relationship: data.emergency_contact_relationship,
        availability,
        areas_of_interest: areasOfInterest,
        skills: data.skills,
        previous_volunteer_experience: data.previous_volunteer_experience,
        why_volunteer: data.why_volunteer,
        background_check_consent: backgroundConsent,
      });
    } catch (_) {
      // entity save failure should not block Formspree submission
    }

    // Submit to Formspree
    await handleFormspreeSubmit(e);
  };

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900 p-6 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">
              Thank You!
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed">
              Your volunteer application has been received. Our team will review it and contact you within 3-5 business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
              We appreciate your willingness to serve and make a difference in the lives of those we serve.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 font-semibold mb-2">Questions?</p>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                Call us at <a href="tel:8558937333" className="text-navy dark:text-gold font-semibold hover:underline">855-893-7333</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6983b4b00291b5dfd8507106/e7f510047_mississippi-city.png"
            alt="Mississippi Community"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/60 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Volunteer With Us</h1>
          <p className="text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto leading-relaxed font-medium">
            Make a lasting impact in the lives of those seeking freedom and transformation. Join our mission to bring hope and healing to our community.
          </p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-navy dark:text-gold mb-16">Why Volunteer?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Heart, title: 'Make a Difference', desc: 'Your time and talents directly impact lives, helping individuals overcome addiction and rebuild their futures.' },
              { icon: Users, title: 'Build Community', desc: 'Connect with like-minded individuals who share your passion for service and faith-based transformation.' },
              { icon: CheckCircle, title: 'Grow Personally', desc: 'Develop new skills, gain valuable experience, and strengthen your faith while serving others.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-4">{title}</h3>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-navy dark:text-gold mb-16">Volunteer Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Mentoring & Support', description: 'Guide and encourage residents through their recovery journey' },
              { icon: BookOpen, title: 'Teaching & Education', description: 'Lead classes, Bible studies, or GED tutoring sessions' },
              { icon: Wrench, title: 'Maintenance & Repairs', description: 'Assist with facility upkeep and improvement projects' },
              { icon: Heart, title: 'Event Planning', description: 'Organize and support special events and fundraisers' },
              { icon: Truck, title: 'SuperThrift', description: 'Support our workforce development program by volunteering in our SuperThrift.' },
            ].map((opp, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <opp.icon className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="text-2xl md:text-2xl text-navy dark:text-gold">{opp.title}</CardTitle>
                  <CardDescription className="text-lg md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{opp.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-navy dark:text-gold mb-12">Volunteer Requirements</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-2">Age Requirement</h3>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">Must be 18 years or older to volunteer</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-2">Background Check</h3>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">All volunteers must complete a background check for the safety of our residents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gold mb-16">Volunteer Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-gold mb-4">500+</div><div className="text-xl md:text-2xl text-white font-medium">Hours Donated Annually</div></div>
            <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-gold mb-4">20+</div><div className="text-xl md:text-2xl text-white font-medium">Active Volunteers</div></div>
            <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-gold mb-4">100%</div><div className="text-xl md:text-2xl text-white font-medium">Making a Difference</div></div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-6">Volunteer Application</h2>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Ready to serve? Fill out the form below to get started.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Applicant Information */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Applicant Information</h3>
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="md:col-span-1">
                        <Label htmlFor="last_name" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Last Name *</Label>
                        <Input id="last_name" name="last_name" required className="mt-2 h-14 text-lg" />
                        <ValidationError field="last_name" errors={state.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="first_name" className="text-lg font-semibold text-slate-800 dark:text-slate-200">First Name *</Label>
                        <Input id="first_name" name="first_name" required className="mt-2 h-14 text-lg" />
                        <ValidationError field="first_name" errors={state.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="middle_initial" className="text-lg font-semibold text-slate-800 dark:text-slate-200">M.I.</Label>
                        <Input id="middle_initial" name="middle_initial" maxLength={2} className="mt-2 h-14 text-lg" />
                      </div>
                    </div>

                    {/* Hidden combined full_name for entity */}
                    <input type="hidden" name="full_name" />

                    <div>
                      <Label htmlFor="address" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Street Address</Label>
                      <Input id="address" name="address" className="mt-2 h-14 text-lg" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <Label htmlFor="city" className="text-lg font-semibold text-slate-800 dark:text-slate-200">City</Label>
                        <Input id="city" name="city" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-lg font-semibold text-slate-800 dark:text-slate-200">State</Label>
                        <Input id="state" name="state" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="zip" className="text-lg font-semibold text-slate-800 dark:text-slate-200">ZIP Code</Label>
                        <Input id="zip" name="zip" className="mt-2 h-14 text-lg" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="phone" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Phone *</Label>
                        <Input id="phone" name="phone" type="tel" required className="mt-2 h-14 text-lg" />
                        <ValidationError field="phone" errors={state.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Email *</Label>
                        <Input id="email" name="email" type="email" required className="mt-2 h-14 text-lg" />
                        <ValidationError field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <Label htmlFor="date_available" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Date Available</Label>
                        <Input id="date_available" name="date_available" type="date" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="date_of_birth" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Birthdate</Label>
                        <Input id="date_of_birth" name="date_of_birth" type="date" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="drivers_license" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Driver's License / ID #</Label>
                        <Input id="drivers_license" name="drivers_license" className="mt-2 h-14 text-lg" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div>
                        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 block mb-3">U.S. Citizen?</Label>
                        <div className="flex gap-6">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-lg text-slate-700 dark:text-slate-200">
                              <input type="radio" name="us_citizen" value={opt} onChange={() => setUsCitizen(opt)} className="w-5 h-5" /> {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 block mb-3">Volunteered Before?</Label>
                        <div className="flex gap-6">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-lg text-slate-700 dark:text-slate-200">
                              <input type="radio" name="volunteered_before" value={opt} onChange={() => setVolunteeredBefore(opt)} className="w-5 h-5" /> {opt}
                            </label>
                          ))}
                        </div>
                        {volunteeredBefore === 'Yes' && (
                          <div className="mt-3">
                            <Label htmlFor="volunteered_when" className="text-base font-semibold text-slate-700 dark:text-slate-300">If yes, when?</Label>
                            <Input id="volunteered_when" name="volunteered_when" className="mt-1 h-12" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 block mb-3">Felony Conviction?</Label>
                        <div className="flex gap-6">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-lg text-slate-700 dark:text-slate-200">
                              <input type="radio" name="felony_convicted" value={opt} onChange={() => setFelonyConvicted(opt)} className="w-5 h-5" /> {opt}
                            </label>
                          ))}
                        </div>
                        {felonyConvicted === 'Yes' && (
                          <div className="mt-3">
                            <Label htmlFor="felony_explanation" className="text-base font-semibold text-slate-700 dark:text-slate-300">Please explain:</Label>
                            <Textarea id="felony_explanation" name="felony_explanation" className="mt-1 min-h-20" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Information */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Other Information</h3>
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="church_name" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Church Name</Label>
                        <Input id="church_name" name="church_name" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="church_attendance_length" className="text-lg font-semibold text-slate-800 dark:text-slate-200">How long have you attended?</Label>
                        <Input id="church_attendance_length" name="church_attendance_length" className="mt-2 h-14 text-lg" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="why_volunteer" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Would you like to tell us anything about yourself?</Label>
                      <Textarea id="why_volunteer" name="why_volunteer" className="mt-2 text-lg min-h-32" />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Availability *</h3>
                  <div className="space-y-4">
                    {[
                      { value: 'weekday_mornings', label: 'Weekday Mornings' },
                      { value: 'weekday_afternoons', label: 'Weekday Afternoons' },
                      { value: 'weekday_evenings', label: 'Weekday Evenings' },
                      { value: 'weekends', label: 'Weekends' },
                      { value: 'flexible', label: 'Flexible Schedule' },
                    ].map((item) => (
                      <div key={item.value} className="flex items-center gap-3">
                        <Checkbox
                          id={item.value}
                          checked={availability.includes(item.value)}
                          onCheckedChange={() => toggleCheckbox(setAvailability, availability, item.value)}
                          className="w-6 h-6"
                        />
                        <Label htmlFor={item.value} className="text-lg text-slate-700 dark:text-slate-200 cursor-pointer">{item.label}</Label>
                        <input type="hidden" name={`availability_${item.value}`} value={availability.includes(item.value) ? 'yes' : 'no'} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Areas of Interest *</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: 'mentoring', label: 'Mentoring & Support' },
                      { value: 'teaching', label: 'Teaching & Education' },
                      { value: 'chapel_teaching', label: 'Chapel Teaching' },
                      { value: 'ged_prep', label: 'GED Prep' },
                      { value: 'maintenance', label: 'Maintenance & Repairs' },
                      { value: 'events', label: 'Event Planning' },
                      { value: 'superthrift', label: 'SuperTHRIFT' },
                      { value: 'auto_academy', label: 'Auto Academy' },
                      { value: 'kitchen', label: 'Kitchen & Meal Prep' },
                      { value: 'landscaping', label: 'Landscaping' },
                    ].map((item) => (
                      <div key={item.value} className="flex items-center gap-3">
                        <Checkbox
                          id={`interest_${item.value}`}
                          checked={areasOfInterest.includes(item.value)}
                          onCheckedChange={() => toggleCheckbox(setAreasOfInterest, areasOfInterest, item.value)}
                          className="w-6 h-6"
                        />
                        <Label htmlFor={`interest_${item.value}`} className="text-lg text-slate-700 dark:text-slate-200 cursor-pointer">{item.label}</Label>
                        <input type="hidden" name={`area_${item.value}`} value={areasOfInterest.includes(item.value) ? 'yes' : 'no'} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Experience */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Skills & Experience</h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="skills" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Special Skills or Qualifications</Label>
                      <Textarea id="skills" name="skills" placeholder="E.g., carpentry, teaching, counseling, graphic design, etc." className="mt-2 text-lg min-h-28" />
                    </div>
                    <div>
                      <Label htmlFor="previous_volunteer_experience" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Previous Volunteer Experience</Label>
                      <Textarea id="previous_volunteer_experience" name="previous_volunteer_experience" placeholder="Tell us about your previous volunteer work..." className="mt-2 text-lg min-h-28" />
                    </div>
                  </div>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Professional References</h3>
                  <div className="space-y-6">
                    {[1, 2].map((n) => (
                      <div key={n} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl space-y-4">
                        <p className="font-semibold text-navy dark:text-gold text-lg">Reference {n}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`ref${n}_name`} className="text-base font-semibold text-slate-800 dark:text-slate-200">Full Name</Label>
                            <Input id={`ref${n}_name`} name={`ref${n}_name`} className="mt-1 h-12" />
                          </div>
                          <div>
                            <Label htmlFor={`ref${n}_relationship`} className="text-base font-semibold text-slate-800 dark:text-slate-200">Relationship</Label>
                            <Input id={`ref${n}_relationship`} name={`ref${n}_relationship`} className="mt-1 h-12" />
                          </div>
                          <div>
                            <Label htmlFor={`ref${n}_company`} className="text-base font-semibold text-slate-800 dark:text-slate-200">Company</Label>
                            <Input id={`ref${n}_company`} name={`ref${n}_company`} className="mt-1 h-12" />
                          </div>
                          <div>
                            <Label htmlFor={`ref${n}_phone`} className="text-base font-semibold text-slate-800 dark:text-slate-200">Phone</Label>
                            <Input id={`ref${n}_phone`} name={`ref${n}_phone`} type="tel" className="mt-1 h-12" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Emergency Contact</h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="emergency_contact_name" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Contact Name</Label>
                      <Input id="emergency_contact_name" name="emergency_contact_name" className="mt-2 h-14 text-lg" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="emergency_contact_phone" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Contact Phone</Label>
                        <Input id="emergency_contact_phone" name="emergency_contact_phone" type="tel" className="mt-2 h-14 text-lg" />
                      </div>
                      <div>
                        <Label htmlFor="emergency_contact_relationship" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Relationship</Label>
                        <Input id="emergency_contact_relationship" name="emergency_contact_relationship" className="mt-2 h-14 text-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer & Consent */}
                <div className="space-y-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl">
                    <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                      I certify that my answers are true and complete to the best of my knowledge. I understand that false or misleading information in my application may result in denial to volunteer.
                    </p>
                    <div>
                      <Label htmlFor="signature" className="text-lg font-semibold text-slate-800 dark:text-slate-200">Full Name (Signature) *</Label>
                      <Input id="signature" name="signature" required placeholder="Type your full name as signature" className="mt-2 h-14 text-lg" />
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl">
                    <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                      I understand that as a volunteer of Mercy House Adult and Teen Challenge (Georgetown, Crystal Springs, Byram, Pearl, and/or Learned, MS), they will use the services of an outside agency to research and verify the information provided. I hereby authorize a representative of MHTC to obtain information on my criminal background. I understand that this check must be done before I can volunteer or serve.
                    </p>
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id="background_check_consent"
                        checked={backgroundConsent}
                        onCheckedChange={(checked) => setBackgroundConsent(checked)}
                        className="w-6 h-6 mt-1"
                      />
                      <Label htmlFor="background_check_consent" className="text-lg text-slate-800 dark:text-slate-200 cursor-pointer leading-relaxed">
                        I consent to a background check and authorize MHTC to verify my background information. *
                      </Label>
                    </div>
                  </div>
                </div>

                {state.errors && state.errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-600 dark:text-red-400 font-semibold">Please correct the errors above and try again.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={state.submitting || !backgroundConsent}
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-bold text-xl py-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {state.submitting ? 'Submitting...' : 'Submit Application'}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}