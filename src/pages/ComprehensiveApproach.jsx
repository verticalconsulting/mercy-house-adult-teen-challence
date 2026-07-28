import React from 'react';
import {
  Sparkles,
  Heart,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  HeartHandshake,
  Megaphone,
  Shield,
  Brain,
  Activity,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import CTABand from '../components/CTABand';

// Circular "four pillars" infographic supplied in the brand bundle.
const APPROACH_GRAPHIC =
  'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/5852ec074_comprehensive-approach1.png';

const pillars = [
  {
    title: 'Residential Recovery',
    subtitle: 'Putting Hope Within Reach through long-term discipleship',
    image:
      'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b0adcea4-39fa-4c4c-9fcd-4a85031ac400/small',
    bg: 'bg-navy',
    points: [
      { icon: Sparkles, label: 'Transformation', text: 'Students\u2019 identities are rebuilt upon the knowledge of who they were created and chosen to be \u2013 Children of God.' },
      { icon: Heart, label: 'Reconciliation', text: 'Students are shown a model for forgiveness and repair. Relationships and hope for the future are restored.' },
      { icon: BookOpen, label: 'Faith', text: 'Faith is believing in God for the impossible. Students learn how to invite God to help them overcome their life-controlling problems.' },
    ],
  },
  {
    title: 'Vocational Training',
    subtitle: 'We were created to be productive',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    bg: 'bg-navy-900',
    points: [
      { icon: GraduationCap, label: 'Life Skills', text: 'Our students are gaining real-world experience and applying biblical principles during their daily lives.' },
      { icon: TrendingUp, label: 'Stewardship', text: 'Students learn how to manage God\u2019s resources with excellence every day in the program.' },
      { icon: Users, label: 'Teamwork', text: 'Teamwork is serving together in unity, and is at the core of our vocational training.' },
    ],
  },
  {
    title: 'Outreach',
    subtitle: 'Delivering hope beyond our walls',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    bg: 'bg-stone-900',
    points: [
      { icon: HeartHandshake, label: 'Compassion', text: 'Like the Good Samaritan, we are meeting tangible needs in our communities.' },
      { icon: Megaphone, label: 'Evangelism', text: 'Sharing the Word of God to the hopeless and introducing them to the hope found through Jesus.' },
      { icon: BookOpen, label: 'Discipleship', text: 'Conducting community discipleship groups throughout the region.' },
      { icon: Shield, label: 'Prevention', text: 'Delivering the Decade 2 model Prevention Program to local youth.' },
    ],
  },
  {
    title: 'Behavioral Health',
    subtitle: 'Full spectrum, state-certified, Christ-centered behavioral health services.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    bg: 'bg-navy-500',
    points: [
      { icon: Brain, label: 'Mental Health', text: 'Some common mental health disorders found in chemically dependent people include mood and anxiety disorders. Our professionals help treat these and other disorders common to our students.' },
      { icon: Activity, label: 'Substance Abuse', text: 'Students learn about physiology of the addicted brain, CBT, goal setting, healthy lifestyle choices, safety seeking, trigger prevention, and proven therapy models.' },
      { icon: ClipboardList, label: 'Case Management', text: 'An assessment provides a treatment starting point. Level of care is established and communicated through a treatment plan \u2014 all aimed at a successful transition back into the community.' },
    ],
  },
];

export default function ComprehensiveApproach() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-950 text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-[0.14em] text-sm mb-5">Our Approach</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-7 leading-tight">
            Our Comprehensive Approach
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            We are a faith-based residential discipleship program with the purpose to restore hope to those
            who suffer from addiction as well as other serious, life-controlling issues. We help people to
            become mentally sound, emotionally balanced, socially adjusted, physically well, and
            spiritually alive.
          </p>
          <div className="mt-12 flex justify-center">
            <img
              src={APPROACH_GRAPHIC}
              alt="Four pillars of our comprehensive approach: Residential Recovery, Vocational Training, Outreach, and Behavioral Health Services"
              className="w-full max-w-xl mx-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Four Pillars Banner */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <article key={p.title} className={`rounded-2xl overflow-hidden shadow-lg flex flex-col ${p.bg} text-white`}>
                <div className="h-44 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                  <p className="text-sm text-white/80 mb-5 leading-relaxed">{p.subtitle}</p>
                  <ul className="space-y-5 flex-1">
                    {p.points.map((pt) => {
                      const Icon = pt.icon;
                      return (
                        <li key={pt.label} className="flex gap-3">
                          <Icon className="w-5 h-5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                          <div>
                            <p className="font-bold text-sm">{pt.label}</p>
                            <p className="text-sm text-white/85 leading-relaxed mt-1">{pt.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Take the First Step Today"
        subtext="Freedom is possible. Our team is ready to walk with you \u2014 one step at a time."
        primaryLabel="Apply for the Program"
        primaryTo="/IntakeForm"
        secondaryLabel="Contact Us"
        secondaryTo="/Contact"
      />
    </div>
  );
}