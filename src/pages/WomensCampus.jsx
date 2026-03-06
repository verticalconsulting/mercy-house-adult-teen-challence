import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Heart, Users, BookOpen, Briefcase, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BedCountDisplay from '../components/BedCountDisplay';
import DonateButton from '../components/DonateButton';

export default function WomensCampus() {
  const { data: bedCounts } = useQuery({
    queryKey: ['bedCounts'],
    queryFn: () => base44.entities.BedCount.list(),
    initialData: []
  });

  const womensBedData = bedCounts.find((bc) => bc.program_type === 'womens');

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        aria-label="Women's Campus overview"
        className="relative h-[65vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80"
            alt="Women supporting one another through faith-based recovery at Mercy House Women's Campus in Learned, Mississippi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/92 to-navy/60 dark:from-slate-900/97 dark:to-slate-900/75" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Learned, Mississippi</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">
            Women's Recovery Campus
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-8">
            A safe, trauma-informed sanctuary where women break free from addiction, rediscover their identity, and build a life grounded in faith and purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('IntakeForm')}>
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-5 text-base shadow-xl transform hover:scale-105 transition-all">
                Apply for the Program
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <a href="tel:8558937333">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-5 text-base font-semibold">
                Call Us: 855-893-7333
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Bed Count */}
      <section aria-label="Current bed availability" className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BedCountDisplay bedData={womensBedData} programName="Women's Campus" />
        </div>
      </section>

      {/* Program Overview */}
      <section aria-labelledby="womens-overview-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">12-Month Program</p>
              <h2 id="womens-overview-heading" className="text-4xl font-bold text-navy dark:text-gold mb-6">
                A Safe Place to Heal — and Become
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-5 leading-relaxed">
                Our Women's Campus is more than a recovery program. It's a place where women can stop surviving and start truly living — with a community that sees them, supports them, and walks beside them every step.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                We address the spiritual, emotional, mental, and practical dimensions of healing — so women leave equipped, not just sober.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={createPageUrl('IntakeForm')}>
                  <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                    Apply Now — It's Free
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
                <DonateButton />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80"
                alt="Women supporting each other"
                className="w-full h-full object-cover" />

            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section aria-labelledby="womens-features-heading" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">What's Included</p>
            <h2 id="womens-features-heading" className="text-4xl font-bold text-navy dark:text-gold">
              What the Program Includes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            {
              icon: Heart,
              title: 'Spiritual Development',
              description: 'Biblical principles and faith-based counseling to address root causes'
            },
            {
              icon: Users,
              title: 'Group Support',
              description: 'Peer support groups and mentorship from women who understand your journey'
            },
            {
              icon: BookOpen,
              title: 'Education',
              description: 'GED preparation, life skills training, and personal development courses'
            },
            {
              icon: Briefcase,
              title: 'Job Training',
              description: 'Vocational skills through our micro businesses and career development'
            }].
            map((feature, idx) =>
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">

                <feature.icon className="w-12 h-12 text-gold mb-4" />
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section aria-labelledby="womens-phases-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Your Roadmap</p>
            <h2 id="womens-phases-heading" className="text-4xl font-bold text-navy dark:text-gold">
              What to Expect — Month by Month
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4">Each phase takes you further from where you were — and closer to who you're meant to be.</p>
          </div>
          
          <div className="space-y-6">
            {[
            {
              phase: 'Phase 1: Foundation (Months 1-3)',
              description: 'Detox support, orientation to program structure, establishing healthy routines, and beginning spiritual development'
            },
            {
              phase: 'Phase 2: Growth (Months 4-6)',
              description: 'Deep dive into biblical teaching, life skills classes, trauma counseling, and beginning work therapy'
            },
            {
              phase: 'Phase 3: Development (Months 7-9)',
              description: 'Advanced job training, leadership opportunities, financial literacy, and independent living preparation'
            },
            {
              phase: 'Phase 4: Transition (Months 10-12)',
              description: 'Job placement assistance, housing support, aftercare planning, and continued mentorship'
            }].
            map((item, idx) =>
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border-l-4 border-gold">

                <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">
                  {item.phase}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 text-slate-200">
            Take the first step toward healing and transformation today.
          </p>
          <Link to={createPageUrl('IntakeForm')}>
            <Button className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-6 text-lg shadow-xl">
              Complete Intake Form
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}