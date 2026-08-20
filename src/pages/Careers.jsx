import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, MapPin, Mail, ExternalLink, Calendar, FileText, Users, Heart } from 'lucide-react';

const jobTypeLabels = {
  full_time: 'Full-Time',
  part_time: 'Part-Time',
  contract: 'Contract',
  internship: 'Internship'
};

const jobTypeColors = {
  full_time: 'bg-green-100 text-green-800',
  part_time: 'bg-blue-100 text-blue-800',
  contract: 'bg-purple-100 text-purple-800',
  internship: 'bg-orange-100 text-orange-800'
};

export default function Careers() {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['careerListings'],
    queryFn: () => base44.entities.CareerListing.list('-created_date'),
    initialData: []
  });

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-20 text-center text-white">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult Teen Challenge</p>
        <h1 className="text-5xl font-bold mb-4">Careers</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Join a Christ-centered team dedicated to helping men, women, and families find lasting freedom. Every role at Mercy House is part of a ministry that changes lives.
        </p>
      </section>

      {/* Why Serve With Us */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Mission-Driven', desc: 'Your work directly supports life transformation and family restoration.' },
              { icon: Users, title: 'Faith Community', desc: 'Serve alongside staff and graduates who share your calling and values.' },
              { icon: FileText, title: 'Purposeful Work', desc: 'Meaningful roles in counseling, operations, education, and more.' },
              { icon: Calendar, title: 'Lasting Impact', desc: 'Be part of a 12-month residential ministry with eternal results.' }
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-2 text-center">Open Positions</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-10">
            {isLoading ? 'Loading opportunities…' : listings.length === 0 ? 'There are no open positions at this time. Please check back soon.' : `${listings.length} ${listings.length === 1 ? 'role' : 'roles'} available`}
          </p>

          <div className="space-y-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <h3 className="text-2xl font-bold text-navy dark:text-gold">{listing.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${jobTypeColors[listing.job_type]}`}>{jobTypeLabels[listing.job_type]}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {listing.department && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gold" />{listing.department}</span>}
                    {listing.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold" />{listing.location}</span>}
                    {listing.salary_range && <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-gold" />{listing.salary_range}</span>}
                    {listing.posting_date && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" />Posted {new Date(listing.posting_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </div>

                  {listing.description && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-navy dark:text-gold text-sm uppercase tracking-wide mb-2">Role Description</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
                    </div>
                  )}

                  {listing.requirements && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-navy dark:text-gold text-sm uppercase tracking-wide mb-2">Qualifications</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{listing.requirements}</p>
                    </div>
                  )}
                </div>

                {/* How to Apply */}
                <div className="bg-navy dark:bg-slate-900 px-6 py-4">
                  <h4 className="text-white font-semibold text-sm mb-2">How to Apply</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {listing.application_email && (
                      <a href={`mailto:${listing.application_email}`} className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors">
                        <Mail className="w-4 h-4" /> {listing.application_email}
                      </a>
                    )}
                    {listing.application_link && (
                      <a href={listing.application_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors">
                        <ExternalLink className="w-4 h-4" /> Apply Online
                      </a>
                    )}
                    {!listing.application_email && !listing.application_link && (
                      <p className="text-slate-300">Email your resume to <a href="mailto:info@mercyhouseatc.com" className="text-gold hover:underline">info@mercyhouseatc.com</a></p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Inquiry CTA */}
      <section className="bg-navy dark:bg-slate-900 py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Don't see the right fit?</h2>
          <p className="text-slate-300 mb-8">
            We're always looking for passionate, mission-aligned people. Send your resume and a brief note about how you'd like to serve.
          </p>
          <a
            href="mailto:info@mercyhouseatc.com"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-accessible hover:text-white text-navy-950 font-bold px-6 py-3 rounded-md transition-colors"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </a>
        </div>
      </section>
    </div>
  );
}