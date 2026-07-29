import React from 'react';
import { Heart, Star } from 'lucide-react';
import CTABand from '../components/CTABand';
import NonprofitLegitimacy from '../components/NonprofitLegitimacy';


export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/400f75909_IMG_5808.JPEG"

          alt=""
          className="w-full h-full object-cover opacity-100"
          aria-hidden="true" />
          
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">About Mercy House</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Who We Are</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Mercy House Adult &amp; Teen Challenge of Mississippi is a Christ-centered, residential recovery ministry
            serving men and women struggling with life-controlling issues in the heart of Mississippi.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">Built on Faith. Born from Experience.</h2>
              <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                <p>
                  Mercy House was founded with a simple but profound conviction: that the power of Jesus Christ can break
                  any chain. Our founder, Pastor Bryan Wilson, watched that truth play out in his own family — a
                  multi-generational pattern of life-controlling issues broken by the grace of God. That personal transformation became
                  the foundation of everything Mercy House is today.
                </p>
                <p>
                  For more than 15 years, Mercy House Adult &amp; Teen Challenge of Mississippi has provided a structured,
                  residential environment where men and women can step away from the chaos of dependency and step into
                  something new — a community rooted in biblical principles, accountability, mentorship, and genuine
                  spiritual growth.
                </p>
                <p>
                  We don't call it rehab. We call it <strong>discipleship</strong> — doing life together, teaching others
                  what you've been taught. While the standard 30-day model treats addiction as a symptom to manage, we
                  believe it is a lifestyle of chaos that requires total identity reconstruction. That's why our program
                  demands more of a person's time, and gives more in return.
                </p>
                <p>
                  The results speak for themselves: <strong className="text-navy dark:text-gold">50% of our graduates remain sober five years after completing the program</strong> — in a state that ranks among the highest for incarceration and mental illness, where most programs offer a revolving door.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=900&q=80"
                  alt="Men in a faith-based group setting"
                  className="w-full h-full object-cover" />
                
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-navy font-bold rounded-xl p-5 shadow-xl text-center hidden md:block">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm font-semibold">5-Year Sobriety Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700 bg-[hsl(var(--muted))]">
              <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 text-navy dark:text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Our Mission</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                Helping adults and families find new life in Christ, develop godly character, and live restored, purposeful lives through practical life skills and community.
              </p>
            </div>
            <div className="dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700 bg-[hsl(var(--muted))]">
              <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-navy dark:text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Our Vision</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                Broken families restored — one person at a time.
              </p>
            </div>
          </div>

          {/* Five Foundations of Freedom */}
          <div className="text-center mb-10">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Core Values</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Five Life Truths for Freedom</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Everything we do flows from five foundational pillars of truth — a framework for how our students learn to live as new people in Christ.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
            { number: '01', title: 'Live Christlike', desc: 'Trusting Jesus as the source of freedom and new life, leaving behind old ways, and choosing to live with love, humility, and obedience in daily actions and decisions.' },
            { number: '02', title: 'Live with Character', desc: 'Building integrity, honesty, and moral strength as the daily currency of a restored life.' },
            { number: '03', title: 'Live Purposeful', desc: 'Discovering God\'s design for your life and pursuing it with intentionality, discipline, and hope.' },
            { number: '04', title: 'Live Accountable', desc: 'Inviting correction and embracing transparency — because long-term freedom requires others who will tell you the truth.' },
            { number: '05', title: 'Live in Community', desc: 'Remaining close to God, to the body of believers, and to the relationships that keep blind spots from becoming relapses.' }].
            map((item) =>
            <div key={item.number} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border-t-4 border-gold text-center">
                <div className="text-gold font-black text-3xl mb-2 opacity-40">{item.number}</div>
                <h3 className="text-base font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonial pull-quote + Christian Foundation */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Our Foundation</p>
          <h2 className="text-4xl font-bold mb-6">Rooted in the Gospel</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            Mercy House is an expressly Christian ministry. Everything we do — from the daily schedule to the way we
            care for residents — flows from our belief that Jesus Christ transforms lives and that every person has
            dignity and worth in God's eyes.
          </p>
          <blockquote className="border-l-4 border-gold pl-6 text-left mb-8 bg-white/5 rounded-r-xl py-4 pr-6">
            <p className="text-slate-200 text-lg italic leading-relaxed">
              "Something about the staff and other people who were a part of the program at Mercy House caught my
              attention. They possessed a sense of happiness and contentment that I had never experienced before,
              and I knew that I wanted it."
            </p>
            <cite className="text-gold text-sm font-semibold mt-3 block not-italic">— Joshua Cook, Graduate &amp; Director of Operations</cite>
          </blockquote>
          <p className="text-lg text-slate-400 leading-relaxed">
            We are affiliated with Adult &amp; Teen Challenge, one of the world's largest faith-based recovery
            organizations, operating in over 100 countries. That affiliation provides a proven framework while our
            local team delivers the personal, Mississippi-rooted community that makes Mercy House home.
          </p>
        </div>
      </section>

      <CTABand
        heading="Want to Learn More?"
        subtext="Reach out to our team, visit our campus, or explore the program pages to see how Mercy House can help."
        primaryLabel="Contact Us"
        primaryTo="/Contact"
        secondaryLabel="Explore Programs"
        secondaryTo="/Programs" />
      
    </div>);

}