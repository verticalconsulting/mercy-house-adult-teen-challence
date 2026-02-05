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

  const womensBedData = bedCounts.find(bc => bc.program_type === 'womens');

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80"
            alt="Women's Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 dark:from-slate-900/95 dark:to-slate-900/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Women's Campus
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
            A sanctuary for healing, growth, and transformation
          </p>
        </div>
      </section>

      {/* Bed Count */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BedCountDisplay bedData={womensBedData} programName="Women's Campus" />
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                A Safe Place to Heal
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Our Women's Campus provides a nurturing environment where women can break free from life-controlling problems and rebuild their lives on a foundation of faith, hope, and practical skills.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Through comprehensive programming that addresses spiritual, emotional, mental, and physical needs, women gain the tools necessary to become productive members of society.
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
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80"
                alt="Women supporting each other"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Program Components
          </h2>
          
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
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <feature.icon className="w-12 h-12 text-gold mb-4" />
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            What to Expect
          </h2>
          
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
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border-l-4 border-gold"
              >
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">
                  {item.phase}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">Our 4 Phase Program</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
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
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl shadow-lg border-l-4 border-gold">
                <div className="text-gold font-bold text-sm mb-2">{item.phase}</div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Additional Programs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">More Than Recovery</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Life Transformation</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Our program is not just to help someone overcome a life debilitating problem, but also to find their life in Christ.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">GED Program</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We believe that everyone has the ability to succeed. We can assist those who have not had the chance to move forward in their journey of receiving their diploma.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Discipleship Training</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We focus on learning how to process and overcome the stress and pressure of addiction through spiritual teachings.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">Family Restoration</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Our goal is to help broken families be restored and to help give them a path forward.
              </p>
            </div>
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
    </div>
  );
}