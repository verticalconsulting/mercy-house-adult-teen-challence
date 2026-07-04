import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Home, ArrowRight, Star } from 'lucide-react';
import CTABand from '../components/CTABand';
import NonprofitLegitimacy from '../components/NonprofitLegitimacy';

const leadership = [
{
  name: 'Bryan Wilson',
  title: 'President / CFO',
  photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b3560cfa-a4f6-42c3-3089-938b4db94000/small',
  bio: 'God called Bryan to start Mercy House after witnessing generational chains of life-controlling issues broken in his own family through faith. He carries that same vision for every person who walks through our doors — that one transformed life can change the trajectory of an entire family for generations.'
},
{
  name: 'Matthew Milliman',
  title: 'Executive Director / CEO',
  photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/70e7c889-58c9-421b-b89a-188f9a87b400/small',
  bio: 'Matthew came through the Adult & Teen Challenge program himself and emerged with a renewed sense of purpose. Today he leads Mercy House with the conviction that every person who is struggling deserves a real chance at a new life through Christ.'
},
{
  name: 'Joshua Cook',
  title: 'Director of Operations',
  photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/fbee339a-6e0e-41b1-dec4-7e39ded9b900/small',
  bio: 'Joshua entered Mercy House in 2017 after years of life-controlling dependency and hardship. God restored everything. He now leads operations with a heart for men still caught in the darkness he once knew — and a testimony that freedom is possible.'
},
{
  name: 'Thomas Reif',
  title: "Campus Director — Men's Program",
  photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/1777985b-43aa-4dcc-e288-ea7079952b00/small',
  bio: 'After nearly a decade in the military and law enforcement, Thomas found himself in need of the same grace he now helps extend to others. He leads the Men\'s Campus with discipline, compassion, and an unshakable belief in what God can do in a man\'s life.'
},
{
  name: 'Lindsay Hughes',
  title: "Campus Director — Women's Program",
  photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/45c77396-fda6-438c-24a8-721975af3e00/small',
  bio: "A Board Certified Christian Counselor with a background in Social Work and Clinical Chaplaincy, Lindsay brings both professional training and genuine compassion to every woman she serves at the Women's Campus in Learned, MS."
}];


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
            <div className="dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700 bg-[#9a1919]">
              <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 text-navy dark:text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Our Mission</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                Helping adults and families find new life in Christ, develop godly character, and live restored, purposeful lives through practical life skills and community.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700">
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

      {/* Four Key Program Areas */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Approach</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Four Key Programmatic Areas</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">The Five Life Truths of Freedom are put into action through four programmatic pillars — each one addressing a dimension of recovery that short-term programs simply cannot reach.

            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
            {
              icon: <Heart className="w-7 h-7" />,
              title: 'Life Transformation',
              desc: 'Recovery is more than overcoming substance abuse — it\'s learning how to build a God-centered life and live successfully in society. We address root causes, not just behaviors, because lasting change requires a complete identity shift.'
            },
            {
              icon: <BookOpen className="w-7 h-7" />,
              title: 'Spiritual Formation & Discipleship',
              desc: 'Living a God-centered life is the core of our recovery process. Through "Studies Centered in Christ" and "Worship Centered in Christ," residents process the pressures of addiction through spiritual teachings, daily praise, and structured biblical curriculum.'
            },
            {
              icon: <Home className="w-7 h-7" />,
              title: 'Work Therapy',
              desc: 'Hard work and dedication are critical to recovery. Residents participate in hands-on vocational training through our micro-businesses — the Mercy House Auto Center, SuperThrift Stores, and the Woodshop/Craft Center — learning responsibility, teamwork, and real-world skills.'
            },
            {
              icon: <Users className="w-7 h-7" />,
              title: 'Family Restoration',
              desc: 'Addiction shatters families. A primary goal of the program is to help broken families rebuild trust, find support, and establish a clear path toward healing and reconciliation — because a person is not truly restored until their family is part of the story.'
            }].
            map((item) =>
            <div key={item.title} className="flex gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center shrink-0 text-navy dark:text-gold">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How the Program Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">The Program</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">The 12-Month Journey</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">In a culture obsessed with the quick fix, Mercy House demands 12 months of a person's life. It is a radical trade — but the data justifies the cost. While most programs celebrate 30 days of sobriety, we focus on the five-year horizon.


            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
            {
              phase: '01',
              title: 'Recovery & Foundation',
              time: '2–4 months',
              desc: 'Residents enter a safe, structured environment. The focus is on "Why was I created?" — addressing deep-seated trauma, establishing healthy routines, and laying the spiritual foundation for everything ahead.'
            },
            {
              phase: '02',
              title: 'Growth & Character Development',
              time: '3–5 months',
              desc: 'With stability in place, the deeper work begins. Residents build healthy relationships, master conflict resolution, engage in intensive biblical discipleship, and develop the character required to sustain long-term change.'
            },
            {
              phase: '03',
              title: 'Application Through Transitional Living',
              time: '5 months',
              desc: 'Residents re-enter the workforce, resolve legal matters, reconcile with family, and complete vocational training. This phase bridges faith and practical readiness — graduates leave with a foundation, not just a certificate.'
            }].
            map((item) =>
            <div key={item.phase} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border-l-4 border-gold">
                <div className="text-gold font-black text-4xl mb-1 opacity-40">{item.phase}</div>
                <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-2">{item.time}</p>
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{item.desc}</p>
              </div>
            )}
          </div>

          <div className="bg-navy dark:bg-slate-950 rounded-2xl p-8 text-white text-center max-w-3xl mx-auto">
            <p className="text-lg text-slate-200 leading-relaxed mb-2">A $1000 intake fee helps offset initial program costs, but no one is turned away for inability to pay. Payment plans and scholarships are available.


            </p>
            <p className="text-sm text-slate-400 mt-3">
              Call our intake coordinator at{' '}
              <a href="tel:6017203718" className="text-gold font-bold hover:underline">(601) 720-3718</a>
              {' '}to discuss your situation.
            </p>
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

      {/* Leadership */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">The Team</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Leadership</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our team is made up of ministers, graduates, counselors, and community members united by a shared calling to serve.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {leadership.map((person) =>
            <div key={person.name} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="aspect-square bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  {person.photo ?
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover object-center" /> :

                <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users className="w-12 h-12" />
                    </div>
                }
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy dark:text-gold text-base">{person.name}</h3>
                  <p className="text-gold dark:text-gold/70 text-xs font-semibold mb-2">{person.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{person.bio}</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/MeetTheTeam"
              className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold hover:underline text-lg">
              
              Meet the Full Team <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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