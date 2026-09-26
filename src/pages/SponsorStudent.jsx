import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Users, Heart, Check, Loader2, ArrowDown, CheckCircle2, XCircle } from 'lucide-react';
import SponsorCheckoutButton from '../components/SponsorCheckoutButton';

export default function SponsorStudent() {
  const [searchParams] = useSearchParams();
  const sponsorshipStatus = searchParams.get('sponsorship');

  const { data: residents, isLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: () => base44.entities.Resident.filter({ available_for_sponsorship: true }),
    initialData: []
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Status banner */}
      {sponsorshipStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 justify-center text-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Thank you for becoming a sponsor! Your monthly support changes a life. Check your email for details.
            </p>
          </div>
        </div>
      )}
      {sponsorshipStatus === 'cancelled' && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 justify-center text-center">
            <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              Your checkout was cancelled. You can become a sponsor anytime.
            </p>
          </div>
        </div>
      )}

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
                  <span className="text-slate-300">Monthly support &amp; encouragement</span>
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
              <SponsorCheckoutButton className="mt-8 bg-gold hover:bg-gold/90 text-navy font-bold text-lg py-6 px-8 rounded-lg">
                Become a Sponsor
              </SponsorCheckoutButton>
            </div>
            <div className="hidden md:block">
              <div className="bg-gold text-navy rounded-2xl p-8 text-center shadow-2xl">
                <div className="text-6xl font-black mb-3">$40</div>
                <div className="text-2xl font-bold mb-6">/month</div>
                <p className="text-navy/80 font-semibold mb-8">
                  Make a direct impact on a student's life
                </p>
                <SponsorCheckoutButton className="w-full bg-navy hover:bg-navy/90 text-gold font-bold text-lg py-6 rounded-lg">
                  Sponsor Now
                </SponsorCheckoutButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid — Split Spotlight */}
      <section className="sponsor-spotlight text-[#f6f1e7] py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sponsor-spotlight-rise text-center text-[#d6b46f] text-3xl md:text-4xl lg:text-[46px] font-bold leading-tight tracking-tight">
            Students Ready for Sponsorship
          </h2>
          <p className="sponsor-spotlight-rise sponsor-spotlight-rise-1 text-center text-[#d0d8df] text-lg md:text-xl mt-4 mb-12">
            Meet the students who would benefit from your monthly support
          </p>

          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#d6b46f] mx-auto" />
            </div>
          ) : residents.length === 0 ? (
            <div className="sponsor-spotlight-empty sponsor-spotlight-rise-empty mx-auto max-w-5xl min-h-[260px] md:min-h-[420px] flex flex-col items-center justify-center text-center px-8 md:px-16 py-12 md:py-16">
              <p className="text-[#f4f1ea] text-xl md:text-2xl leading-relaxed max-w-3xl">
                Currently, we sponsor students in our program as a cohort rather than individual sponsorships.
              </p>
              <SponsorCheckoutButton className="sponsor-spotlight-btn" iconClass="w-5 h-5">
                Support Our Students
              </SponsorCheckoutButton>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Featured student — large card on the left */}
              <article className={`sponsor-spotlight-featured overflow-hidden ${residents.length === 1 ? 'md:col-span-2 max-w-2xl mx-auto' : ''}`}>
                <div className="aspect-[4/5] md:aspect-[16/11] overflow-hidden bg-slate-800">
                  {residents[0].photo_url ? (
                    <img src={residents[0].photo_url} alt={residents[0].full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-20 h-20 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <span className="text-[#d6b46f] text-sm font-bold uppercase tracking-[0.12em]">Featured Student</span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mt-2 mb-1">{residents[0].full_name}</h3>
                  {residents[0].age && <p className="text-[#d6b46f] text-sm mb-3">Age {residents[0].age}</p>}
                  <p className="text-[#d0d8df] text-base leading-relaxed line-clamp-5 mb-6">
                    {residents[0].story || 'On a journey to transformation...'}
                  </p>
                  <SponsorCheckoutButton
                    residentName={residents[0].full_name}
                    residentId={residents[0].id}
                    className="sponsor-spotlight-cta"
                    iconClass="w-4 h-4">
                    Sponsor a Student
                  </SponsorCheckoutButton>
                </div>
              </article>

              {/* Compact tile stack on the right */}
              {residents.length > 1 && (
                <div className="grid gap-4 content-start">
                  {residents.slice(1).map((resident, i) => (
                    <article key={resident.id} className="sponsor-spotlight-tile" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-slate-800">
                        {resident.photo_url ? (
                          <img src={resident.photo_url} alt={resident.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-10 h-10 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 min-w-0 flex flex-col">
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{resident.full_name}</h3>
                        {resident.age && <p className="text-[#d6b46f] text-xs mb-1">Age {resident.age}</p>}
                        <p className="text-[#d0d8df] text-sm line-clamp-2 mb-3 flex-1">
                          {resident.story || 'On a journey to transformation...'}
                        </p>
                        <SponsorCheckoutButton
                          residentName={resident.full_name}
                          residentId={resident.id}
                          className="sponsor-spotlight-link self-start"
                          iconClass="w-3.5 h-3.5">
                          Sponsor
                        </SponsorCheckoutButton>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trust + donor portal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <Heart className="w-12 h-12 text-gold mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-3xl font-bold text-navy dark:text-gold mb-3">Become a Sponsor</h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto mb-6">
          Give monthly through our secure checkout and walk alongside a student on their journey to lasting transformation.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          🔒 Secure checkout via Stripe · Tax-deductible · EIN 45-4670832 · Cancel anytime
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Already a sponsor?{' '}
          <a href="https://mercyhouseatc.givevirtuous.org/" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
            Manage your giving in our donor portal
          </a>.
        </p>
      </div>
    </div>
  );
}