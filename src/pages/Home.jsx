import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Heart, Users, TrendingUp, CheckCircle, Quote, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonateButton from '../components/DonateButton';

const stats = [
  { value: '15+', label: 'Years Serving Mississippi', detail: 'Established in Georgetown & Learned, MS' },
  { value: '1,000+', label: 'Lives Transformed', detail: 'Men and women who graduated our program' },
  { value: '110%', label: 'Donated Funds to Mission', detail: 'Micro businesses cover operating costs' },
  { value: '12 mo.', label: 'Structured Recovery Program', detail: 'Four-phase path from brokenness to freedom' },
];

const features = [
  {
    icon: CheckCircle,
    title: 'Faith-Based & Evidence-Informed',
    desc: 'Biblical principles combined with proven recovery methods — addressing addiction at the root, not just the surface.',
  },
  {
    icon: Heart,
    title: 'Whole-Person Care',
    desc: 'Spiritual development, trauma counseling, GED preparation, vocational training, and family restoration under one roof.',
  },
  {
    icon: Users,
    title: 'Real Community',
    desc: 'You won't do this alone. Brotherhood, sisterhood, and mentors who've walked the same road surround every resident.',
  },
  {
    icon: TrendingUp,
    title: 'A Path, Not Just a Pause',
    desc: 'Our 4-phase model moves residents from stabilization through transition — graduating people ready for independent life.',
  },
];

export default function Home() {
  return (
    <div className="w-full">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        aria-label="Welcome to Mercy House"
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80"
            alt="People finding hope and community at Mercy House"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/75 to-transparent dark:from-slate-900/97 dark:via-slate-900/82"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-slate-200 mb-6">
              <Star className="w-4 h-4 text-gold fill-gold" aria-hidden="true" />
              Adult &amp; Teen Challenge · Serving Mississippi since 2008
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Recovery Is
              <span className="block text-gold mt-1">Possible for You</span>
            </h1>

            <p className="text-xl md:text-2xl mb-4 text-slate-200 leading-relaxed max-w-2xl">
              Mercy House provides a free, structured, 12-month Christian recovery program for men and women
              battling addiction and life-controlling problems in Mississippi.
            </p>

            <p className="text-lg text-slate-300 mb-10 max-w-xl">
              We treat the whole person — spiritually, emotionally, and practically — so you leave with more than sobriety. You leave with a life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('IntakeForm')} aria-label="Start your application to Mercy House">
                <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Apply for the Program
                  <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
              <DonateButton className="px-8 py-6 text-lg font-semibold" />
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Intake line open Mon–Fri 8am–5pm ·{' '}
              <a href="tel:6017203718" className="text-gold underline underline-offset-2 hover:text-gold/80 transition-colors">
                (601) 720-3718
              </a>
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 text-xs" aria-hidden="true">
          <div className="w-0.5 h-8 bg-white/30 rounded-full animate-pulse" />
          scroll
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────── */}
      <section
        aria-label="Program impact statistics"
        className="bg-navy dark:bg-slate-950 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.value}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-4xl md:text-5xl font-bold text-gold mb-1" aria-label={s.value}>
                    {s.value}
                  </span>
                  <span className="block text-base font-semibold text-white mb-1">{s.label}</span>
                  <span className="block text-xs text-slate-400">{s.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── MISSION ─────────────────────────────────────────── */}
      <section aria-labelledby="mission-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Purpose</p>
            <h2 id="mission-heading" className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-6 leading-tight">
              More Than Sobriety.<br />A Completely New Life.
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              Mercy House provides a comprehensive, Christ-centered solution to addiction and life-controlling problems.
              Through Biblical principles, vocational training, and genuine community, residents become mentally sound,
              emotionally balanced, and socially adjusted — ready to lead productive lives and restore their families.
            </p>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 inline-block">
              <p className="text-navy dark:text-gold font-semibold text-lg italic">
                "110% of individual donations go directly to our mission — our micro businesses cover operations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────── */}
      <section aria-labelledby="programs-heading" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Residential Programs</p>
            <h2 id="programs-heading" className="text-4xl font-bold text-navy dark:text-gold">
              Two Campuses. One Mission.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
              Separate, structured campuses for men and women — each offering a safe environment designed specifically for how men and women heal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Women's Campus */}
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Women supporting one another in recovery at Mercy House Women's Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-3">Women's Campus</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Located in Learned, MS — a safe, trauma-informed environment where women break free from addiction,
                  rebuild their identity, and discover lasting purpose through faith.
                </p>
                <ul className="space-y-1.5 mb-6" aria-label="Women's program highlights">
                  {['12-month residential program', 'Trauma counseling & spiritual development', 'GED preparation & job training', 'Family restoration support'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('WomensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn About Women's Campus
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>

            {/* Men's Campus */}
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                  alt="Men working together in recovery at Mercy House Men's Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-3">Men's Campus</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Located in Georgetown, MS — a structured, brotherhood-driven campus where men confront addiction,
                  develop character, and build the vocational skills to sustain a new life.
                </p>
                <ul className="space-y-1.5 mb-6" aria-label="Men's program highlights">
                  {['12-month 4-phase program', 'Automotive & vocational training', 'Biblical discipleship & counseling', 'Transition housing & job placement'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('MensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn About Men's Campus
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── WHY MERCY HOUSE ──────────────────────────────────── */}
      <section aria-labelledby="why-heading" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Why Choose Us</p>
            <h2 id="why-heading" className="text-4xl font-bold text-navy dark:text-gold">
              What Makes Our Program Different
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-gold/50 hover:shadow-lg transition-all duration-300"
              >
                <f.icon className="w-10 h-10 text-gold mb-4" aria-hidden="true" />
                <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL PULL QUOTE ───────────────────────────── */}
      <section aria-labelledby="testimonial-heading" className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-12 h-12 text-gold/50 mx-auto mb-6" aria-hidden="true" />
          <h2 id="testimonial-heading" className="sr-only">Graduate Testimonial</h2>
          <blockquote>
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate-100 mb-8 italic">
              "I came to Mercy House broken — no job, no family, no hope. A year later I walked out with a trade, my family restored, and a faith I never expected. This place saves lives."
            </p>
            <footer>
              <cite className="text-gold font-semibold not-italic">— Men's Campus Graduate, Class of 2023</cite>
            </footer>
          </blockquote>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Testimonials')}>
              <Button variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-navy px-8 py-5 text-base font-semibold transition-all">
                Read More Stories
              </Button>
            </Link>
            <Link to={createPageUrl('IntakeForm')}>
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-5 text-base shadow-xl">
                Start Your Application
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MICRO BUSINESSES ─────────────────────────────────── */}
      <section aria-labelledby="businesses-heading" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Self-Funding Mission</p>
            <h2 id="businesses-heading" className="text-4xl font-bold text-navy dark:text-gold mb-4">
              Our Micro Businesses
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Residents learn real job skills through our social enterprises — while generating the revenue that keeps the program running. Shopping here <strong>directly supports recovery.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Thrift Store', icon: '🏪', path: 'ThriftStore', desc: 'Donate or shop for a cause' },
              { name: 'Vehicle Donation', icon: '🚗', path: 'VehicleDonation', desc: 'Turn your old car into new lives' },
              { name: 'Mercy Auto Academy', icon: '🔧', path: 'MercyAutoAcademy', desc: 'Automotive training & repair' },
              { name: 'Products & Purpose', icon: '📦', path: 'ProductsPurpose', desc: 'Handcrafted goods from residents' },
            ].map((biz) => (
              <Link
                key={biz.name}
                to={createPageUrl(biz.path)}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700 hover:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                aria-label={`Learn about our ${biz.name} — ${biz.desc}`}
              >
                <div className="text-4xl mb-3" aria-hidden="true">{biz.icon}</div>
                <h3 className="font-bold text-navy dark:text-gold text-base mb-1">{biz.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{biz.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="py-24 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            The Next Step Is Yours.<br />
            <span className="text-gold">We'll Walk It With You.</span>
          </h2>
          <p className="text-xl mb-4 text-slate-200 max-w-2xl mx-auto leading-relaxed">
            You don't have to have it all figured out. You just have to reach out.
            Our intake team is ready to talk — no judgment, no pressure.
          </p>
          <p className="text-slate-300 mb-10">
            Call us:{' '}
            <a href="tel:8558937333" className="text-gold font-bold hover:underline">
              855-893-7333
            </a>
            {' '}or{' '}
            <a href="tel:6017203718" className="text-gold font-bold hover:underline">
              (601) 720-3718
            </a>
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
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-10 py-6 text-lg font-semibold transition-all">
                Talk to Someone First
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}