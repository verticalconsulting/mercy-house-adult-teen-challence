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
    desc: "A structured 12-month residential Christian discipleship program for men struggling with life-controlling and dependency issues. Rooted in faith, accountability, and genuine community, the program takes place on our peaceful 14-acre campus.",
    features: ['12-Month Residential Program', 'Biblical Discipleship & Life-Skills Development', 'Work Therapy & Vocational Training', 'Mentorship & Accountability', 'Family Restoration', 'Re-entry & Transitional Support'],
  },
  {
    name: "Women's Program",
    location: 'Learned, MS',
    path: '/WomensCampus',
    image: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/6967250f-138f-4d93-b91a-f375dfd4ab00/small',
    desc: "A safe, supportive residential environment for women ready to pursue freedom from life-controlling and dependency issues through a Christ-centered program designed for their unique journey.",
    features: ['12-Month Residential Program', 'Trauma-Informed Support & Biblical Counseling', 'Life-Skills Training', 'Spiritual Growth', 'Community & Mentorship'],
  },
];

const foundations = [
  'Live Christlike',
  'Live with Character',
  'Live Purposeful',
  'Live Accountable',
  'Live in Community',
];

const keyAreas = [
  {
    num: '1',
    title: 'Life Transformation',
    desc: 'Recovery is hard, but real change is possible. Our program goes beyond addressing addiction to teach residents how to build a God-centered life and live successfully in society.',
  },
  {
    num: '2',
    title: 'Spiritual Formation & Discipleship',
    desc: 'Living a God-centered life is at the heart of our recovery process. We walk with each resident to apply that truth through intentional discipleship, daily Bible study, and worship. This includes structured curriculum, scripture memorization, and practical life-skills training.',
  },
  {
    num: '3',
    title: 'Work Therapy',
    desc: 'Classroom learning matters, but hands-on experience is essential. Through meaningful work, residents learn responsibility, teamwork, and practical life skills. Students receive vocational training through our micro-businesses, including the Mercy House Auto Center, SuperThrift Stores, and crafting goods for Products with a Purpose.',
  },
  {
    num: '4',
    title: 'Family Restoration',
    desc: 'Addiction shatters families—our mission is to restore them. We intentionally involve families in the recovery process to help rebuild trust, offer support, and establish a clear path toward healing and reconciliation.',
  },
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
            Mercy House Adult &amp; Teen Challenge offers long-term, Christ-centered residential programs for men and women ready to make a lasting change. Our approach is not a quick fix — it is a structured journey of total life transformation.
          </p>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-10 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-800 dark:text-amber-200 text-base font-medium">
            <strong>Please note:</strong> Mercy House Adult &amp; Teen Challenge is a faith-based residential ministry program — not a medical detox or licensed clinical treatment facility. If you or someone you know is experiencing a medical emergency, please call 911 or go to your nearest emergency room. For questions about program admissions, contact our intake team at{' '}
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

      {/* How It Works - Five Foundations */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">The Five Foundations of Freedom</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              At Mercy House, our mission is to help individuals and families find a new life in Christ. Our culture and curriculum are built upon five core pillars:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {foundations.map((f) => (
              <div key={f} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                <h3 className="text-lg font-bold text-navy dark:text-gold">{f}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Key Program Areas */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Our Four Key Program Areas</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our approach is holistic, addressing the spiritual, relational, and practical dimensions of a person's life. We guide everything we do through these four core areas:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {keyAreas.map((area) => (
              <div key={area.num} className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-black text-lg">
                  {area.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">{area.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phased Structure */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">Our Phased Structure</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Our 12-month program provides increasing levels of responsibility as residents grow and demonstrate readiness. Residents move from establishing a foundation of recovery to deep character development, eventually transitioning into our 3rd Phase program, which equips them with the tools, employment support, and community connections needed for long-term success.
          </p>
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
          <div className="space-y-6">
            <div className="bg-white/10 dark:bg-white/5 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gold mb-3">Men &amp; Women in Crisis</h3>
              <p className="text-slate-300 leading-relaxed mb-3">Adults between the ages of 18 and 65 struggling with life-controlling and dependency issues who are ready to commit to a long-term residential program. Please note: Because our campuses are located near public parks and schools, we cannot accept registered sex offenders.</p>
            </div>
            <div className="bg-white/10 dark:bg-white/5 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gold mb-3">Families Seeking Answers</h3>
              <p className="text-slate-300 leading-relaxed mb-3">If someone you love is caught in life-controlling issues, Mercy House offers a safe, structured environment where they can receive support. You are not alone, and there is hope.</p>
            </div>
            <div className="bg-white/10 dark:bg-white/5 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gold mb-3">Those Court-Referred or Self-Motivated</h3>
              <p className="text-slate-300 leading-relaxed mb-3">Whether you have come to us through the court system or entirely on your own, Mercy House meets you where you are and walks with you forward. If an applicant is currently incarcerated, we can forward a letter of acceptance directly to the court so the judge can determine if our program is a good fit. If on probation, the applicant's Probation Officer must be contacted for approval.</p>
            </div>
            <p className="text-slate-400 italic mt-6">
              Please note that an applicant must have a genuine personal desire to change for the program to be successful.
            </p>
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
              The Mercy House program is designed as a <strong>long-term residential commitment</strong>, typically lasting <strong>12 months</strong>. This length is intentional — genuine life transformation takes time, and the program allows residents to develop real habits, relationships, and spiritual depth that sustain them after graduation.
            </p>
            <p>
              There is a <strong>one-time, non-refundable intake fee of $1,000</strong> to cover initial costs. Beyond that, <strong>95% of the men at our facility attend the program at no cost</strong>. Housing, meals, discipleship resources, and program support are provided at no ongoing charge thanks to our generous donors and micro-business operations.
            </p>
            <p className="font-semibold">
              <strong>Strict Nicotine Policy</strong> Please be aware that Mercy House is a nicotine-free environment. Residents cannot smoke, dip, or vape, and nicotine patches are not allowed.
            </p>
            <p>
              We encourage anyone with financial concerns to contact us directly. We are committed to removing barriers for those who are genuinely seeking help.
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
                title: 'Complete the Application & Questionnaire',
                desc: "Review our intake questionnaire to ensure you meet our basic eligibility requirements, then download and complete our application.",
              },
              {
                step: '2',
                title: 'Call for a Phone Interview',
                desc: "Contact our Intake Coordinator, Howard Kittrell, at (601) 720-3718 to discuss your application and complete a phone interview. The best time to call is Monday–Friday, 8:00 AM – 5:00 PM. If you are reaching out on the weekend or no one answers, please leave a message or send a text with your name and number, and we will get back to you as soon as possible.",
              },
              {
                step: '3',
                title: 'Complete the Blood Work Requirement',
                desc: "Before admission, applicants must complete required blood work. TB, HIV, and HEP B & C tests are required and need to be faxed to (601) 858-2420. (Exception: If the applicant is incarcerated and can only complete the TB test, the remaining tests can be administered upon arrival with Executive Director approval). Follow up with a phone call to confirm we have received your lab results.",
              },
              {
                step: '4',
                title: 'Arrive & Begin',
                desc: "Once you're accepted, we'll give you a list of approved items to bring and set a date and time for your arrival. You'll arrive at our campus, get settled into your new home, and begin the program alongside people who are on the same journey you are.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-700">
                <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-black text-xl">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
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