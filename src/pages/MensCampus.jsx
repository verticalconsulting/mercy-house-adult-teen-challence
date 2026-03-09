import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Shield, Target, Wrench, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BedCountDisplay from '../components/BedCountDisplay';
import DonateButton from '../components/DonateButton';

export default function MensCampus() {
  const { data: bedCounts } = useQuery({
    queryKey: ['bedCounts'],
    queryFn: () => base44.entities.BedCount.list(),
    initialData: []
  });

  const mensBedData = bedCounts.find(bc => bc.program_type === 'mens');

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        aria-label="Men's Campus overview"
        className="relative h-[65vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/aab06562-c0ee-4f31-ca4f-cb36c5faf700/heromobile"
            alt="Men working together in community at Mercy House Men's Campus in Georgetown, Mississippi"
            className="w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/92 to-navy/60 dark:from-slate-900/97 dark:to-slate-900/75" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Georgetown, Mississippi</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">
            Men's Recovery Campus
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-8">
            A structured, faith-based program where men break the cycle of addiction and build lives of purpose, character, and lasting freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('IntakeForm')}>
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-5 text-base shadow-xl transform hover:scale-105 transition-all">
                Apply for the Program
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <a href="tel:6017203718">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-5 text-base font-semibold">
                Call Intake: (601) 720-3718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Bed Count */}
      <section aria-label="Current bed availability" className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BedCountDisplay bedData={mensBedData} programName="Men's Campus" />
        </div>
      </section>

      {/* Program Overview */}
      <section aria-labelledby="mens-overview-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6983b4b00291b5dfd8507106/05a4f88f2_bible.png"
                alt="Resident studying the Bible during structured program time at Mercy House Men's Campus"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">12-Month Program</p>
              <h2 id="mens-overview-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-6">
                Reclaim Your Purpose
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-5 leading-relaxed">
                Our Men's Campus provides a structured environment — not a short-term detox, but a full year of transformation. Men work through root causes of addiction, rebuild their identity in Christ, and graduate with marketable skills.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                We equip men with biblical principles, vocational training, and the brotherhood needed to sustain a new life — long after the program ends.
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
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section aria-labelledby="mens-features-heading" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="mens-features-heading" className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            What the Program Includes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: 'Character Building',
                description: 'Biblical principles to develop integrity, accountability, and moral strength'
              },
              {
                icon: Target,
                title: 'Goal Setting',
                description: 'Personal development planning and strategic life coaching'
              },
              {
                icon: Wrench,
                title: 'Vocational Training',
                description: 'Hands-on job skills through automotive, construction, and retail experience'
              },
              {
                icon: Users,
                title: 'Brotherhood',
                description: 'Mentorship and accountability in a supportive community'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-gold mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-navy dark:text-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section aria-labelledby="mens-schedule-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Structured for Success</p>
            <h2 id="mens-schedule-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold">
              A Typical Day on Campus
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-xl mx-auto">Structure is one of the most powerful tools in recovery. Every day is intentional.</p>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {[
              { time: '6:00 AM', activity: 'Wake Up & Morning Devotions' },
              { time: '7:00 AM', activity: 'Breakfast & Campus Responsibilities' },
              { time: '8:30 AM', activity: 'Chapel Service & Biblical Teaching' },
              { time: '10:00 AM', activity: 'Work Therapy / Vocational Training' },
              { time: '12:00 PM', activity: 'Lunch & Rest Period' },
              { time: '1:00 PM', activity: 'Continued Work / Education Classes' },
              { time: '5:00 PM', activity: 'Dinner & Recreation' },
              { time: '7:00 PM', activity: 'Group Counseling / Support Groups' },
              { time: '9:00 PM', activity: 'Evening Reflection & Personal Time' },
              { time: '10:30 PM', activity: 'Lights Out' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg"
              >
                <div className="text-gold font-bold text-base md:text-lg md:min-w-[100px]">
                  {item.time}
                </div>
                <div className="text-base md:text-base text-slate-700 dark:text-slate-300">
                  {item.activity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section aria-labelledby="mens-phases-heading" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Your Roadmap to Freedom</p>
            <h2 id="mens-phases-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold">Our 4-Phase Recovery Program</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">Each phase builds on the last — moving you from crisis to independence with clear milestones and real support.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                phase: 'Phase 1',
                title: 'Why was I created?',
                description: 'Dealing with past wounds. How to move forward from life altering dependency.'
              },
              {
                phase: 'Phase 2',
                title: 'Conflict resolution',
                description: 'Building healthy relationships. Dealing with triggers. Continued in-depth Bible studies.'
              },
              {
                phase: 'Phase 3',
                title: 'Move into our transition home',
                description: 'Get a job. Pay fines. Get a driver\'s license. Marriage counseling. Improved life skills.'
              },
              {
                phase: 'Phase 4',
                title: 'Transition to alumni home',
                description: 'Have accountability. Live freely. Develop a new life.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border-l-4 border-gold">
                <div className="text-gold font-bold text-base md:text-sm mb-2">{item.phase}</div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-3">{item.title}</h3>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Additional Programs */}
      <section aria-labelledby="mens-more-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Whole-Person Transformation</p>
            <h2 id="mens-more-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold">More Than Recovery</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Life Transformation</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                Our program is not just to help someone overcome a life debilitating problem, but also to find their life in Christ.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">GED Program</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                We believe that everyone has the ability to succeed. We can assist those who have not had the chance to move forward in their journey of receiving their diploma.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Discipleship Training</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                We focus on learning how to process and overcome the stress and pressure of addiction through spiritual teachings.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Family Restoration</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                Our goal is to help broken families be restored and to help give them a path forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        aria-labelledby="mens-cta-heading"
        className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="mens-cta-heading" className="text-3xl md:text-4xl font-bold mb-5">Your New Life Starts With One Decision</h2>
          <p className="text-lg md:text-xl mb-4 text-slate-200 max-w-2xl mx-auto">
            You've tried white-knuckling it alone. Let us walk with you through something that actually works.
          </p>
          <p className="text-slate-300 mb-10">
            Call intake:{' '}
            <a href="tel:6017203718" className="text-gold font-bold hover:underline">(601) 720-3718</a>
            {' '}· Mon–Fri 8am–5pm
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('IntakeForm')}>
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-10 py-6 text-lg shadow-xl transform hover:scale-105 transition-all">
                Apply Now — It's Free
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-10 py-6 text-lg font-semibold">
                Ask Us a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}