import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Home, ArrowRight, Star } from 'lucide-react';
import CTABand from '../components/CTABand';

const leadership = [
  {
    name: 'Bryan Wilson',
    title: 'President / CFO',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b3560cfa-a4f6-42c3-3089-938b4db94000/small',
    bio: 'God called Bryan to start Mercy House after witnessing generational chains of life-controlling issues broken in his own family through faith. He carries that same vision for every person who walks through our doors — that one transformed life can change the trajectory of an entire family for generations.',
  },
  {
    name: 'Matthew Milliman',
    title: 'Executive Director / CEO',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/70e7c889-58c9-421b-b89a-188f9a87b400/small',
    bio: 'Matthew came through the Adult & Teen Challenge program himself and emerged with a renewed sense of purpose. Today he leads Mercy House with the conviction that every person who is struggling deserves a real chance at a new life through Christ.',
  },
  {
    name: 'Joshua Cook',
    title: 'Director of Operations',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/fbee339a-6e0e-41b1-dec4-7e39ded9b900/small',
    bio: 'Joshua entered Mercy House in 2017 after years of life-controlling dependency and hardship. God restored everything. He now leads operations with a heart for men still caught in the darkness he once knew — and a testimony that freedom is possible.',
  },
  {
    name: 'Thomas Reif',
    title: "Campus Director — Men's Program",
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/1777985b-43aa-4dcc-e288-ea7079952b00/small',
    bio: 'After nearly a decade in the military and law enforcement, Thomas found himself in need of the same grace he now helps extend to others. He leads the Men\'s Campus with discipline, compassion, and an unshakable belief in what God can do in a man\'s life.',
  },
  {
    name: 'Lindsay Hughes',
    title: "Campus Director — Women's Program",
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/45c77396-fda6-438c-24a8-721975af3e00/small',
    bio: "A Board Certified Christian Counselor with a background in Social Work and Clinical Chaplaincy, Lindsay brings both professional training and genuine compassion to every woman she serves at the Women's Campus in Learned, MS.",
  },
];

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">About Mercy House</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Who We Are</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Mercy House Adult &amp; Teen Challenge of Mississippi is a Christ-centered, residential recovery ministry
            serving men and women struggling with life-controlling and dependency issues in the heart of Mississippi.
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
                  residential environment where men and women can step away from the chaos of dependency issues and step into
                  something new — a community rooted in biblical principles, accountability, mentorship, and genuine
                  spiritual growth.
                </p>
                <p>
                  Over the years, Mercy House has grown to include two residential campuses — the Men's Campus in
                  Georgetown, MS, and the Women's Campus in Learned, MS — along with a family of micro-businesses that
                  provide vocational training and help fund ministry operations without relying solely on donor
                  contributions.
                </p>
                <p>
                  We are not a hospital. We are not a licensed treatment clinic. We are a faith-based community that
                  believes lasting change is possible — not through programs alone, but through a real encounter with God
                  and the sustained support of a caring community.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=900&q=80"
                  alt="Men in a faith-based group setting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-navy font-bold rounded-xl p-5 shadow-xl text-center hidden md:block">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm font-semibold">Years of Ministry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 text-navy dark:text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Our Mission</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                To provide an effective and comprehensive Christian faith-based environment where people struggling with
                life-controlling and dependency issues can find lasting freedom — becoming mentally sound, emotionally
                balanced, socially adjusted, and spiritually alive through a relationship with Jesus Christ.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-navy dark:text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Our Vision</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                A Mississippi where every person struggling with life-controlling issues has access to a Christ-centered path toward
                wholeness — and where transformed individuals become agents of transformation for their families,
                communities, and the next generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Approach</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">What Makes Mercy House Different</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We are not a short-term program or a quick fix. Mercy House is a long-term, structured environment
              designed to address the whole person — spirit, soul, and body.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: 'Faith-Centered',
                desc: 'Biblical teaching, worship, prayer, and discipleship are woven into every aspect of daily life — not as an add-on, but as the foundation.',
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: 'Peer Community',
                desc: 'Residents live and grow alongside others on the same journey. The community itself is part of the restoration.',
              },
              {
                icon: <Home className="w-7 h-7" />,
                title: 'Residential Structure',
                desc: 'A safe, stable, structured home environment removes the pressures and triggers of everyday life so genuine healing can begin.',
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Staff Who Have Been There',
                desc: 'Many of our staff are graduates of the program. They lead not from theory but from lived experience and genuine compassion.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-navy/10 dark:bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-navy dark:text-gold">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Christian Foundation */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Our Foundation</p>
          <h2 className="text-4xl font-bold mb-6">Rooted in the Gospel</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">
            Mercy House is an expressly Christian ministry. Everything we do — from the daily schedule to the way we
            care for residents — flows from our belief that Jesus Christ transforms lives and that every person has
            dignity and worth in God's eyes.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            We are affiliated with Adult &amp; Teen Challenge, one of the world's largest faith-based recovery
            organizations, operating in over 100 countries. That affiliation gives us a proven framework while our
            local team provides the personal, Mississippi-rooted community that makes Mercy House home.
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
            {leadership.map((person) => (
              <div key={person.name} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="aspect-square bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy dark:text-gold text-base">{person.name}</h3>
                  <p className="text-gold dark:text-gold/70 text-xs font-semibold mb-2">{person.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/MeetTheTeam"
              className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold hover:underline text-lg"
            >
              Meet the Full Team <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Accountability &amp; Transparency</p>
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-4">Trusted Stewardship</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Mercy House Adult &amp; Teen Challenge of Mississippi is a registered 501(c)(3) nonprofit organization.
            We are committed to transparent stewardship of every gift entrusted to us. Our micro-business operations —
            including our thrift store, vehicle donation program, and auto academy — generate revenue that supports
            ministry operations, which means 110% of individual donor contributions go directly to our mission.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            EIN and financial documentation available upon request. Contact us at{' '}
            <a href="mailto:info@mercyhouseatc.com" className="text-navy dark:text-gold hover:underline">
              info@mercyhouseatc.com
            </a>
          </p>
        </div>
      </section>

      <CTABand
        heading="Want to Learn More?"
        subtext="Reach out to our team, visit our campus, or explore the program pages to see how Mercy House can help."
        primaryLabel="Contact Us"
        primaryTo="/Contact"
        secondaryLabel="Explore Programs"
        secondaryTo="/Programs"
      />
    </div>
  );
}