import React from 'react';
import { TrendingUp, Users, Heart } from 'lucide-react';
import BusinessCard from '@/components/site/BusinessCard';
import { workforceBusinesses, workforceStats } from '@/lib/workforceBusinesses';

const icons = { TrendingUp, Users, Heart };

const skills = ['Professional Skills', 'Work Ethics', 'Financial Literacy'];

export default function MicroBusinesses() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy dark:bg-slate-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 select-none text-[220px] font-black leading-none text-white/5"
        >
          MH
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p className="mh-eyebrow mb-4">Our Approach</p>
          <h1 className="font-sans text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
            Workforce Development
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
            Training, Skills, and Sustainable Funding
          </p>
          <span className="mt-8 block h-px w-16 bg-gold mx-auto" aria-hidden="true" />
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mh-eyebrow mb-3">Purpose-Driven Enterprise</p>
          <h2 className="mh-h2 mb-8">Work Is Part of the Healing</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Our workforce development businesses serve a dual purpose: providing residents with
            valuable job training and marketable skills while generating revenue to fund our
            operations. This model ensures that{' '}
            <strong className="text-navy dark:text-gold">
              100% of individual donor proceeds go directly to our mission
            </strong>
            —an unheard-of standard in nonprofit work.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Through hands-on experience in real business environments, residents develop work
            ethics, professional skills, and financial literacy that prepare them for successful
            careers and independent living.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-navy-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {workforceStats.map((stat) => {
              const Icon = icons[stat.icon];
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="w-10 h-10 text-gold-accessible dark:text-gold mx-auto mb-4" aria-hidden="true" />
                  <div className="text-4xl font-bold text-navy dark:text-gold mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 dark:text-slate-300">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Units */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="mh-eyebrow mb-3">Micro-Businesses</p>
            <h2 className="mh-h2 mb-4">Our Workforce Development Businesses</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Each business trains residents in real jobs and sends its proceeds back into the
              ministry.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {workforceBusinesses.map((business) => (
              <BusinessCard key={business.title} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mh-eyebrow mb-3">Resident Outcomes</p>
          <h2 className="text-3xl md:text-[38px] font-bold leading-tight text-white mb-6">
            Skills That Transform Lives
          </h2>
          <p className="text-lg text-slate-200 mb-10">
            Residents gain real-world experience in customer service, teamwork, time management,
            financial responsibility, and industry-specific skills that open doors to sustainable
            employment after graduation.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {skills.map((skill) => (
              <div key={skill} className="border border-white/20 px-6 py-5">
                <h3 className="font-bold text-gold">{skill}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}