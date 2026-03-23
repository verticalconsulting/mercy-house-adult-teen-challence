import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, BookOpen, Home as HomeIcon, Briefcase, Shield, Phone, Star, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CTABand from '../components/CTABand';

const testimonials = [
  {
    name: 'Joshua Cook',
    title: 'Program Graduate & Staff',
    quote: "I walked in on August 17, 2017 and never looked back. God has changed everything. I'm a husband, father, and deacon in my church. The Lord has given back everything the enemy stole from me.",
  },
  {
    name: 'Matthew Milliman',
    title: 'Executive Director & Graduate',
    quote: "Coming through Adult and Teen Challenge helped rescue me from a lifestyle of addiction and taught me how to live again. I am now walking in my true calling — helping men and their families find freedom.",
  },
  {
    name: 'Wesley Barnett',
    title: 'Program Graduate & Staff',
    quote: "God delivered me from my addiction and brought me to Mercy House on November 12, 2020. I now have a beautiful wife and two amazing stepsons that I get to raise up in the Lord. My life is forever changed.",
  },
];

const programHighlights = [
  { icon: <BookOpen className="w-6 h-6" />, title: 'Biblical Discipleship', desc: 'Daily Scripture study, worship, and prayer form the core of life at Mercy House.' },
  { icon: <Users className="w-6 h-6" />, title: 'Mentorship & Accountability', desc: 'Residents are guided by staff who have walked the same road and found lasting freedom.' },
  { icon: <HomeIcon className="w-6 h-6" />, title: 'Structured Residential Living', desc: 'A stable, structured home environment that removes destructive influences and builds new habits.' },
  { icon: <Briefcase className="w-6 h-6" />, title: 'Vocational Training', desc: 'Hands-on work skills developed through our micro-business programs prepare residents for employment.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Life-Skills Development', desc: 'Financial literacy, communication, personal responsibility, and healthy relationship skills.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Phased Accountability', desc: 'A four-phase structure that gradually increases responsibility as residents grow and mature.' },
];

export default function Home() {
  const [bedCounts, setBedCounts] = useState([]);

  useEffect(() => {
    base44.entities.BedCount.list().then(setBedCounts).catch(() => {});
  }, []);

  const mensBeds = bedCounts.find((b) => b.program_type === 'mens');
  const womensBeds = bedCounts.find((b) => b.program_type === 'womens');

  return (
    <div className="w-full">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80"
            alt="People finding hope together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50 dark:from-slate-900/98 dark:via-slate-900/85" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-5">
              Mercy House Adult &amp; Teen Challenge — Mississippi
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Real Hope.
              <span className="block text-gold mt-2">Real Change.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-slate-200 leading-relaxed">
              A Christ-centered, residential recovery ministry for men and women ready to break free from
              addiction and life-controlling issues — through faith, community, and structured support.
            </p>
            <p className="text-base text-slate-300 mb-10 max-w-2xl">
              Located in Georgetown and Learned, Mississippi. Serving our community for over 15 years.
              100% faith-based. 501(c)(3) nonprofit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/IntakeForm"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-lg text-lg shadow-xl transition-all"
              >
                Get Help Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/Donate"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold px-8 py-4 rounded-lg text-lg transition-all"
              >
                Support the Mission
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold" />
              <span className="text-slate-300 text-base">
                Need help now?{' '}
                <a href="tel:6017203718" className="text-gold font-semibold hover:underline">
                  Call (601) 720-3718
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AVAILABILITY BANNER ── */}
      {(mensBeds || womensBeds) && (
        <section className="bg-gold/20 dark:bg-gold/10 border-y border-gold/40 py-5">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
            {mensBeds && (
              <div>
                <p className="text-navy dark:text-gold font-bold text-lg">
                  {mensBeds.total_beds - mensBeds.occupied_beds} of {mensBeds.total_beds} Beds Available
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Men's Program · Georgetown, MS</p>
              </div>
            )}
            {womensBeds && (
              <div>
                <p className="text-navy dark:text-gold font-bold text-lg">
                  {womensBeds.total_beds - womensBeds.occupied_beds} of {womensBeds.total_beds} Beds Available
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Women's Program · Learned, MS</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── MISSION ── */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Mission</p>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                A Christ-Centered Path to Lasting Freedom
              </h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                <p>
                  Mercy House Adult &amp; Teen Challenge of Mississippi exists because we believe lasting freedom from
                  addiction and life-controlling issues is possible — not through willpower alone, but through a
                  genuine encounter with Jesus Christ and the sustained support of a caring community.
                </p>
                <p>
                  We are a faith-based residential ministry, not a hospital or clinical treatment center. Our program
                  is built on biblical principles, structured daily living, mentorship from people who have been
                  there, and the kind of spiritual transformation that changes a person from the inside out.
                </p>
                <p>
                  For over 15 years, Mercy House has been a place where people who felt hopeless found hope —
                  where broken families began to be restored — and where men and women discovered that God had more
                  for their lives than they had ever imagined.
                </p>
              </div>
              <Link
                to="/About"
                className="inline-flex items-center gap-2 mt-8 text-navy dark:text-gold font-semibold hover:underline text-lg"
              >
                Learn More About Our Ministry <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=600&q=80"
                  alt="Men in a faith community gathering"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
                  alt="Community and support"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-4 text-center">
                {[{ val: '15+', label: 'Years of Service' }, { val: '1,000+', label: 'Lives Impacted' }, { val: '110%', label: 'Donations to Mission' }].map((s) => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <div className="text-2xl font-bold text-navy dark:text-gold">{s.val}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Who We Serve</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">You Are Welcome Here</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Mercy House is for anyone who is ready for change — and for the families who love them and don't know where to turn.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Men Seeking Freedom',
                desc: "Our Men's Campus in Georgetown, MS, offers a structured, faith-based residential program for men struggling with addiction and life-controlling issues. If you are ready to commit to a long-term change, we are ready to walk with you.",
                cta: "Men's Program",
                to: '/MensCampus',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Women Seeking Healing',
                desc: "Our Women's Campus in Learned, MS, provides a safe, supportive environment for women ready to pursue freedom and wholeness through a Christ-centered residential program designed to meet them where they are.",
                cta: "Women's Program",
                to: '/WomensCampus',
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Families Looking for Hope',
                desc: "If someone you love is struggling, you do not have to face it alone. Mercy House offers a safe environment where they can receive structured support — and we will keep you informed and involved throughout the process.",
                cta: 'Contact Us',
                to: '/Contact',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md flex flex-col">
                <div className="w-14 h-14 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center text-navy dark:text-gold mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-5">{item.desc}</p>
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold hover:underline text-sm"
                >
                  {item.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW THE PROGRAM WORKS ── */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">The Program</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">How Our Program Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Mercy House is not a quick fix. It is a long-term, structured journey — typically 12 to 15 months —
              designed to rebuild every aspect of a person's life through faith, community, and accountability.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programHighlights.map((h) => (
              <div key={h.title} className="flex gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center text-navy dark:text-gold flex-shrink-0">
                  {h.icon}
                </div>
                <div>
                  <h3 className="font-bold text-navy dark:text-gold mb-1">{h.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/Programs"
              className="inline-flex items-center gap-2 bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Explore Full Program Details <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROGRAM PATHS ── */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Campuses</p>
            <h2 className="text-4xl font-bold mb-4">Two Programs. One Mission.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/10 dark:bg-white/5 rounded-2xl overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80"
                  alt="Men's recovery program campus"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="p-8">
                <p className="text-gold text-sm font-semibold mb-1">Georgetown, MS</p>
                <h3 className="text-2xl font-bold mb-3">Men's Program</h3>
                <p className="text-slate-300 mb-5 text-sm leading-relaxed">
                  A structured, Christ-centered residential program for men struggling with addiction and
                  life-controlling issues. Includes discipleship, mentorship, vocational training, and life-skills
                  development.
                </p>
                <Link
                  to="/MensCampus"
                  className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-5 py-3 rounded-lg hover:bg-gold/90 transition-colors text-sm"
                >
                  Learn About the Men's Program <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-white/10 dark:bg-white/5 rounded-2xl overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Women's recovery program campus"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="p-8">
                <p className="text-gold text-sm font-semibold mb-1">Learned, MS</p>
                <h3 className="text-2xl font-bold mb-3">Women's Program</h3>
                <p className="text-slate-300 mb-5 text-sm leading-relaxed">
                  A safe, supportive residential environment for women ready to pursue freedom through a
                  Christ-centered program that addresses spiritual, emotional, and practical dimensions of wholeness.
                </p>
                <Link
                  to="/WomensCampus"
                  className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-5 py-3 rounded-lg hover:bg-gold/90 transition-colors text-sm"
                >
                  Learn About the Women's Program <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSFORMED LIVES ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Stories of Hope</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Changed Lives, Restored Families</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We cannot promise outcomes — only God can do that. But we can share what He has done in the lives of
              people who walked through our doors and chose to stay.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md">
                <div className="text-gold text-4xl font-serif mb-4">&ldquo;</div>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <p className="font-bold text-navy dark:text-gold">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/Testimonials"
              className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold hover:underline text-lg"
            >
              Read More Stories <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DONATION SECTION ── */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Support the Mission</p>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">Your Gift Makes This Possible</h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                <p>
                  Mercy House Adult &amp; Teen Challenge is donor-supported and mission-driven. Because our
                  micro-business operations cover overhead expenses, <strong>110% of every individual donation
                  goes directly to our ministry programs</strong> — no exceptions.
                </p>
                <p>
                  Your generosity provides meals, housing, biblical resources, mentorship support, and daily
                  program operations for residents who have nothing — and are starting over with everything.
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  'Provides daily meals and housing for a resident',
                  'Funds discipleship materials and biblical resources',
                  'Supports mentorship and life-skills programming',
                  'Helps graduates transition back into society',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/Donate"
                className="inline-flex items-center gap-2 mt-8 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-lg text-lg shadow-lg transition-all"
              >
                Give Today <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&q=80"
                alt="Community support and ministry"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP PREVIEW ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Leadership</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Led by People Who Have Been There</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Many of our staff are graduates of the program. They lead not from theory but from lived experience.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Bryan Wilson', title: 'President / CFO', photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b3560cfa-a4f6-42c3-3089-938b4db94000/small' },
              { name: 'Matthew Milliman', title: 'Executive Director', photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/70e7c889-58c9-421b-b89a-188f9a87b400/small' },
              { name: 'Joshua Cook', title: 'Director of Operations', photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/fbee339a-6e0e-41b1-dec4-7e39ded9b900/small' },
              { name: 'Thomas Reif', title: "Men's Campus Director", photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/1777985b-43aa-4dcc-e288-ea7079952b00/small' },
              { name: 'Lindsay Hughes', title: "Women's Campus Director", photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/45c77396-fda6-438c-24a8-721975af3e00/small' },
            ].map((p) => (
              <div key={p.name} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 mb-3">
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover object-center" />
                </div>
                <p className="font-bold text-navy dark:text-gold text-sm">{p.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/MeetTheTeam"
              className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold hover:underline text-lg"
            >
              Meet the Full Team <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready to Start a New Chapter?"
        subtext="Whether you need help, want to support someone who does, or feel called to give — we are here."
        primaryLabel="Get Help Now"
        primaryTo="/IntakeForm"
        secondaryLabel="Support the Mission"
        secondaryTo="/Donate"
      />
    </div>
  );
}