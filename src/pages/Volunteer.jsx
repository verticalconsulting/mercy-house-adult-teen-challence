import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Users, Clock, CheckCircle, ArrowRight, Wrench, BookOpen, Home, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    availability: [],
    areas_of_interest: [],
    skills: '',
    previous_volunteer_experience: '',
    why_volunteer: '',
    background_check_consent: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.background_check_consent) {
      toast.error('Please consent to background check to continue');
      return;
    }

    setLoading(true);
    try {
      await base44.entities.Volunteer.create(formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  if (submitted) {
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
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 font-semibold mb-2">
                Questions?
              </p>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Volunteer With Us
          </h1>
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
            <div className="text-center">
              <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-4">Make a Difference</h3>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                Your time and talents directly impact lives, helping individuals overcome addiction and rebuild their futures.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-4">Build Community</h3>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                Connect with like-minded individuals who share your passion for service and faith-based transformation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-4">Grow Personally</h3>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                Develop new skills, gain valuable experience, and strengthen your faith while serving others.
              </p>
            </div>
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
              { icon: Truck, title: 'SuperTHRIFT', description: 'Support our workforce development program by volunteering in our SuperTHRIFT.' }
            ].map((opp, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <opp.icon className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="text-2xl md:text-2xl text-navy dark:text-gold">{opp.title}</CardTitle>
                  <CardDescription className="text-lg md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                    {opp.description}
                  </CardDescription>
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
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-2">Age Requirement</h3>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed">Must be 18 years or older to volunteer</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl md:text-2xl font-bold text-navy dark:text-gold mb-2">Background Check</h3>
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
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gold mb-4">500+</div>
              <div className="text-xl md:text-2xl text-white font-medium">Hours Donated Annually</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gold mb-4">20+</div>
              <div className="text-xl md:text-2xl text-white font-medium">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-gold mb-4">100%</div>
              <div className="text-xl md:text-2xl text-white font-medium">Making a Difference</div>
            </div>
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Personal Information</h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="full_name" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        required
                        className="mt-2 text-lg md:text-xl h-14"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="email" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="mt-2 text-lg md:text-xl h-14"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <Label htmlFor="city" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">ZIP</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                        className="mt-2 text-lg md:text-xl h-14"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Emergency Contact</h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="emergency_contact_name" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                        className="mt-2 text-lg md:text-xl h-14"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="emergency_contact_phone" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Contact Phone</Label>
                        <Input
                          id="emergency_contact_phone"
                          type="tel"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_contact_relationship" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">Relationship</Label>
                        <Input
                          id="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={(e) => setFormData({...formData, emergency_contact_relationship: e.target.value})}
                          className="mt-2 text-lg md:text-xl h-14"
                        />
                      </div>
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
                      { value: 'flexible', label: 'Flexible Schedule' }
                    ].map((item) => (
                      <div key={item.value} className="flex items-center gap-3">
                        <Checkbox
                          id={item.value}
                          checked={formData.availability.includes(item.value)}
                          onCheckedChange={() => handleCheckboxChange('availability', item.value)}
                          className="w-6 h-6"
                        />
                        <Label htmlFor={item.value} className="text-lg md:text-xl text-slate-700 dark:text-slate-200 cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Areas of Interest *</h3>
                  <div className="space-y-4">
                    {[
                      { value: 'mentoring', label: 'Mentoring & Support' },
                      { value: 'teaching', label: 'Teaching & Education' },
                      { value: 'administrative', label: 'Administrative Support' },
                      { value: 'maintenance', label: 'Maintenance & Repairs' },
                      { value: 'events', label: 'Event Planning' },
                      { value: 'thrift_store', label: 'Thrift Store' },
                      { value: 'auto_academy', label: 'Auto Academy' },
                      { value: 'kitchen', label: 'Kitchen & Meal Prep' },
                      { value: 'childcare', label: 'Childcare' },
                      { value: 'transportation', label: 'Transportation' }
                    ].map((item) => (
                      <div key={item.value} className="flex items-center gap-3">
                        <Checkbox
                          id={`interest_${item.value}`}
                          checked={formData.areas_of_interest.includes(item.value)}
                          onCheckedChange={() => handleCheckboxChange('areas_of_interest', item.value)}
                          className="w-6 h-6"
                        />
                        <Label htmlFor={`interest_${item.value}`} className="text-lg md:text-xl text-slate-700 dark:text-slate-200 cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Experience */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">Skills & Experience</h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="skills" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Special Skills or Qualifications
                      </Label>
                      <Textarea
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        placeholder="E.g., carpentry, teaching, counseling, graphic design, etc."
                        className="mt-2 text-lg md:text-xl min-h-32"
                      />
                    </div>

                    <div>
                      <Label htmlFor="previous_volunteer_experience" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Previous Volunteer Experience
                      </Label>
                      <Textarea
                        id="previous_volunteer_experience"
                        value={formData.previous_volunteer_experience}
                        onChange={(e) => setFormData({...formData, previous_volunteer_experience: e.target.value})}
                        placeholder="Tell us about your previous volunteer work..."
                        className="mt-2 text-lg md:text-xl min-h-32"
                      />
                    </div>

                    <div>
                      <Label htmlFor="why_volunteer" className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Why do you want to volunteer with Mercy House?
                      </Label>
                      <Textarea
                        id="why_volunteer"
                        value={formData.why_volunteer}
                        onChange={(e) => setFormData({...formData, why_volunteer: e.target.value})}
                        placeholder="Share your motivation..."
                        className="mt-2 text-lg md:text-xl min-h-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="background_check_consent"
                      checked={formData.background_check_consent}
                      onCheckedChange={(checked) => setFormData({...formData, background_check_consent: checked})}
                      required
                      className="w-6 h-6 mt-1"
                    />
                    <Label htmlFor="background_check_consent" className="text-lg md:text-xl text-slate-800 dark:text-slate-200 cursor-pointer leading-relaxed">
                      I consent to a background check and understand that all volunteers must complete this requirement for the safety of residents. *
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold/90 text-navy font-bold text-xl py-7 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
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