import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Home, BookOpen, Briefcase, Heart, Shield, Sun, Star } from 'lucide-react';
import CTABand from '../components/CTABand';

const programs = [
  {
    name: "Men's Program",
    location: 'Georgetown, MS',
    path: '/MensCampus',
    image: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b0adcea4-39fa-4c4c-9fcd-4a85031ac400/small',
    desc: "A long-term, structured residential program for men struggling with life-controlling and dependency issues. Rooted in faith, accountability, and genuine community.",
    features: ['12–15 Month Residential Program', 'Biblical Discipleship', 'Vocational Training', 'Mentorship & Accountability', 'Life-Skills Development', 'Re-entry Support'],
  },
  {
    name: "Women's Program",
    location: 'Learned, MS',
    path: '/WomensCampus',
    image: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/6967250f-138f-4d93-b91a-f375dfd4ab00/small',
    desc: "A safe, supportive residential environment for women ready to pursue freedom from life-controlling and dependency issues through a Christ-centered program designed for their unique journey.",
    features: ['Residential Program', 'Trauma-Informed Support', 'Biblical Counseling', 'Life-Skills Training', 'Spiritual Growth', 'Community & Mentorship'],
  },
];

const pillars = [
  { icon: <BookOpen className="w-6 h-6" />, title: 'Biblical Discipleship', desc: 'Daily Bible study, worship, and prayer are the foundation of the program — not an optional component.' },
  { icon: <Users className="w-6 h-6" />, title: 'Mentorship & Accountability', desc: 'Every resident is connected with mentors and peers who walk alongside them through the program.' },
  { icon: <Home className="w-6 h-6" />, title: 'Safe Residential Environment', desc: 'A structured home setting removes destructive environments and provides stability for genuine growth.' },
  { icon: <Briefcase className="w-6 h-6" />, title: 'Vocational Training', desc: 'Residents develop real work skills through our micro-business programs, preparing them for life after graduation.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Life-Skills Development', desc: 'Financial literacy, communication, personal responsibility, and healthy relationships are taught and practiced daily.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Accountability Structure', desc: 'A phased program structure provides increasing levels of responsibility as residents grow and demonstrate readiness.' },
  { icon: <Sun className="w-6 h-6" />, title: 'Spiritual Growth', desc: 'Chapel services, individual prayer, and community worship help residents develop a personal faith that sustains them beyond the program.' },
  { icon: <Star className="w-6 h-6" />, title: 'Re-entry Support', desc: 'Graduates receive support in securing housing, employment, and community connections as they transition back into society.' },
];

export default function Programs() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Programs &amp; Services</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">A Path Toward Freedom</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Mercy House offers long-term, Christ-centered residential programs for men and women ready to make a
            lasting change. Our approach is not a quick fix — it is a structured journey of transformation.
          </p>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-10 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-800 dark:text-amber-200 text-base font-medium">
            <strong>Please note:</strong> Mercy House Adult &amp; Teen Challenge is a faith-based residential ministry
            program — not a medical detox or licensed clinical treatment facility. If you or someone you know is
            experiencing a medical emergency, please call 911 or go to your nearest emergency room.
            For questions about program admissions, contact our intake team at{' '}
            <a href="tel:6017203718" className="underline hover:no-underline">(601) 720-3718</a>.
          </p>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Choose Your Path</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Our Residential Programs</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We offer separate, gender-specific residential programs tailored to the unique needs of men and women.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {programs.map((prog) => (
              <div key={prog.name} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                <div className="h-64 overflow-hidden">
                  <img src={prog.image} alt={prog.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <p className="text-gold text-sm font-semibold mb-1">{prog.location}</p>
                  <h3 className="text-2xl font-bold text-navy dark:text-gold mb-3">{prog.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">{prog.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {prog.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                        <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={prog.path}
                    className="inline-flex items-center gap-2 bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold px-6 py-3 rounded-lg transition-colors mt-auto"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Pillars */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">The Eight Pillars of Our Program</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our approach is holistic — addressing not just the symptoms of life-controlling issues but the spiritual, relational,
              and practical dimensions of a person's life. These eight pillars guide everything we do.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p) => (
              <div key={p.title} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center text-navy dark:text-gold mb-4">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-navy dark:text-gold mb-2">{p.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Who We Serve</p>
            <h2 className="text-4xl font-bold mb-4">You Don't Have to Face This Alone</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Mercy House is for people who are ready to make a change — and for the families who love them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Men & Women in Crisis', desc: 'Adults struggling with life-controlling and dependency issues who are ready to commit to a long-term residential program.' },
              { title: 'Families Seeking Answers', desc: "If someone you love is caught in life-controlling issues, Mercy House offers a safe, structured environment where they can receive support. You are not alone, and there is hope." },
              { title: 'Those Court-Referred or Self-Motivated', desc: 'Whether you have come to us through the court system or entirely on your own, Mercy House meets you where you are and walks with you forward.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 dark:bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gold mb-3">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Length & Cost */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Practical Information</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Program Length &amp; Costs</h2>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            <p>
              The Mercy House program is designed as a <strong>long-term residential commitment</strong>, typically
              lasting 12 to 15 months. This length is intentional — genuine life transformation takes time, and a
              longer program allows residents to develop real habits, relationships, and spiritual depth that sustain
              them after graduation.
            </p>
            <p>
              There is a <strong>one-time intake fee of $1,000</strong> to cover initial costs. Beyond that, Mercy
              House operates as a <strong>no-cost program</strong> for residents — housing, meals, discipleship
              resources, and program support are provided at no ongoing charge thanks to our generous donors and
              micro-business operations.
            </p>
            <p>
              We encourage anyone with financial concerns to contact us directly. We are committed to removing barriers
              for those who are genuinely seeking help.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-navy dark:text-gold mb-1">Ready to apply or learn more?</p>
              <p>
                Call our intake coordinator at{' '}
                <a href="tel:6017203718" className="text-navy dark:text-gold hover:underline font-semibold">
                  (601) 720-3718
                </a>{' '}
                or{' '}
                <Link to="/IntakeForm" className="text-navy dark:text-gold hover:underline font-semibold">
                  submit an application online
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Help */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Getting Started</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">How to Get Help</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Reaching out is the hardest part. We've kept the process as simple as possible — no paperwork walls, no runaround. Just a real conversation with people who understand.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Call or Apply Online',
                desc: "Contact our intake coordinator at (601) 720-3718 or complete the online intake application — whichever feels most comfortable. You can also have a family member call on your behalf. Our team will answer your questions honestly and help you understand if Mercy House is the right fit.",
                action: { label: 'Call (601) 720-3718', href: 'tel:6017203718' },
              },
              {
                step: '2',
                title: 'Complete the Intake Process',
                desc: "Our intake team will walk you through a brief application and gather some basic information. This is a confidential conversation — not an interrogation. We want to understand your situation so we can best prepare for your arrival and make sure the program is the right environment for you at this time.",
                action: null,
              },
              {
                step: '3',
                title: 'Arrive & Begin',
                desc: "Once you're accepted, we'll give you everything you need to know about what to bring, what to expect on your first day, and how the first few weeks work. You'll arrive, get settled into your new home, and begin the program alongside people who are on the same journey you are.",
                action: { label: 'Start Your Application', href: '/IntakeForm' },
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-700">
                <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-black text-xl">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                  {item.action && (
                    <a
                      href={item.action.href}
                      className="inline-flex items-center gap-2 mt-4 text-navy dark:text-gold font-semibold hover:underline"
                    >
                      {item.action.label} <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Take the First Step Today"
        subtext="Freedom is possible. Our team is ready to walk with you — one step at a time."
        primaryLabel="Apply for the Program"
        primaryTo="/IntakeForm"
        secondaryLabel="Contact Us"
        secondaryTo="/Contact"
      />
    </div>
  );
}