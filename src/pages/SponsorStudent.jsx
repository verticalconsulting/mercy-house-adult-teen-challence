import React, { useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Heart, Check, Loader2, ArrowDown } from 'lucide-react';
import VirtuousGiveForm from '../components/VirtuousGiveForm';

// Virtuous form designated for student sponsorship.
const MERCYHOUSE_SPONSOR_STUDENT_FORM_ID = 'B7298929-DC2A-43F9-BBFD-A60F4C0A2A5D';

export default function SponsorStudent() {
  const formRef = useRef(null);

  const { data: residents, isLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: () => base44.entities.Resident.filter({ available_for_sponsorship: true }),
    initialData: []
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-navy dark:bg-slate-950 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Sponsor a Student
              </h1>
              <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                Change a life. Build a future.
              </p>
              <p className="text-lg text-slate-200 mb-8">
                For just <span className="text-gold font-bold text-2xl">$40</span> a month, you can sponsor a student in our program and provide direct support for their transformation journey.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Monthly support & encouragement</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Progress updates on their journey</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Direct funding for educational needs</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                  <span className="text-slate-300">Tax-deductible donation</span>
                </div>
              </div>
              <Button
                onClick={scrollToForm}
                className="mt-8 bg-gold hover:bg-gold/90 text-navy font-bold text-lg py-6">
                <Heart className="w-5 h-5 mr-2" />
                Become a Sponsor
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold text-navy rounded-2xl p-8 text-center shadow-2xl">
                <div className="text-6xl font-black mb-3">$40</div>
                <div className="text-2xl font-bold mb-6">/month</div>
                <p className="text-navy/80 font-semibold mb-8">
                  Make a direct impact on a student's life
                </p>
                <Button
                  onClick={scrollToForm}
                  className="w-full bg-navy hover:bg-navy/90 text-gold font-bold text-lg py-6">
                  <Heart className="w-5 h-5 mr-2" />
                  Sponsor Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-3">Students Ready for Sponsorship</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Meet the students who would benefit from your monthly support
          </p>
        </div>

        {isLoading ?
        <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-navy dark:text-gold mx-auto" />
          </div> :
        residents.length === 0 ?
        <Card className="text-center p-12">
            <p className="text-slate-600 dark:text-slate-300">
              Currently, we sponsor students in our program as a cohort rather than individual sponsorships.
              <br />
              <Button variant="outline" className="mt-6" onClick={scrollToForm}>
                <ArrowDown className="w-4 h-4 mr-2" />
                Support Our Students
              </Button>
            </p>
          </Card> :

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map((resident) =>
          <Card key={resident.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {resident.photo_url ?
              <img
                src={resident.photo_url}
                alt={resident.full_name}
                className="w-full h-full object-cover" /> :

              <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-20 h-20 text-slate-400" />
                    </div>
              }
                </div>
                <CardHeader>
                  <CardTitle className="text-navy dark:text-gold">{resident.full_name}</CardTitle>
                  {resident.age &&
              <p className="text-sm text-slate-600 dark:text-slate-400">Age {resident.age}</p>
              }
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
                    {resident.story || 'On a journey to transformation...'}
                  </p>
                  <Button
                    onClick={scrollToForm}
                    className="w-full mt-4 bg-gold hover:bg-gold/90 text-navy font-bold">
                    <Heart className="w-4 h-4 mr-2" />
                    Sponsor a Student
                  </Button>
                </CardContent>
              </Card>
          )}
          </div>
        }
      </div>

      {/* Sponsor a Student — Virtuous giving form */}
      <div ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-24">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-3">Become a Sponsor</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            Give monthly through the secure form below and walk alongside a student on their journey to lasting transformation.
          </p>
        </div>
        <VirtuousGiveForm formId={MERCYHOUSE_SPONSOR_STUDENT_FORM_ID} />
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
          🔒 Secure checkout · Tax-deductible · EIN 45-4670832 · Cancel anytime
        </p>
      </div>
    </div>
  );
}