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
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
            alt="Men's Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 dark:from-slate-900/95 dark:to-slate-900/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Men's Campus
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto">
            Building men of character, purpose, and strength
          </p>
        </div>
      </section>

      {/* Bed Count */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BedCountDisplay bedData={mensBedData} programName="Men's Campus" />
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Men reading the bible together"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-6">
                Reclaim Your Purpose
              </h2>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Our Men's Campus offers a structured, disciplined environment where men can break the chains of addiction and destructive behaviors through faith-based recovery.
              </p>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                We equip men with practical skills, biblical principles, and the accountability needed to become productive members of society and leaders in their communities.
              </p>
              <div className="flex gap-4">
                <Link to={createPageUrl('IntakeForm')}>
                  <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <DonateButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Program Components
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
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Daily Structure
          </h2>
          
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
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">Our 4 Phase Program</h2>
          
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
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">More Than Recovery</h2>
          
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
      <section className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Take the First Step</h2>
          <p className="text-lg md:text-xl mb-8 text-slate-200">
            Your journey to freedom and purpose begins with a single decision.
          </p>
          <Link to={createPageUrl('IntakeForm')}>
            <Button className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-6 text-lg shadow-xl">
              Complete Intake Form
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}