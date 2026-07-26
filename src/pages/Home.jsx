import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CTABand from '../components/CTABand';
import FeaturedTestimonials from '../components/FeaturedTestimonials';
import AccreditationStrip from '../components/site/AccreditationStrip';
import CommonQuestions from '../components/site/CommonQuestions';
import GiftAllocation from '../components/site/GiftAllocation';
import HowWeHelp from '../components/site/HowWeHelp';
import ImpactBand from '../components/site/ImpactBand';
import ProgramsGrid from '../components/site/ProgramsGrid';
import SplitHero from '../components/site/SplitHero';
import TwoPaths from '../components/site/TwoPaths';

const businesses = [
  {
    name: 'SuperThrift',
    logo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/1a07ccd8-7054-46f7-c9c9-2e0ea56af100/logo',
    href: 'https://mercyhouseatc.superthriftdeals.org',
  },
  {
    name: 'Vehicle Donation Program',
    logo: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/4c5006539_vdplogo.jpg',
    href: 'https://mercyhouseatc.vehicledonationms.org',
  },
  {
    name: 'Mercy House Auto Sales',
    logo: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/2533657d4_mercyhouseautocenter.png',
    href: 'https://mercyhouseautocenter.com/',
  },
  {
    name: 'Elite Gutters',
    logo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/9fd573a1-4df2-428f-d672-0b5b2b939b00/logo',
    href: 'https://myelitegutters.com',
  },
];

const accreditations = [
  { label: 'Candid Seal of Transparency', href: 'https://app.candid.org/profile/9237605/mercy-house-teen-challenge-45-4670832/?pkId=85b52dd6-b112-4838-af55-83779d6afa0f' },
  { label: 'Adult & Teen Challenge' },
  { label: '501(c)(3) · EIN 99-1943281', to: '/Financials' },
];

const steps = [
  {
    title: 'Reach out',
    description:
      'Call our intake coordinator at (601) 720-3718, Monday–Friday 8am–5pm, or send an application online. A real person picks up.',
  },
  {
    title: 'Begin the program',
    description:
      'After a phone interview and required lab work, you arrive on campus and start the 12-month residential program alongside people on the same road.',
  },
  {
    title: 'Restore & reconnect',
    description:
      'Discipleship, work skills and counsel rebuild what dependency took — so graduates leave mentally sound, emotionally balanced and socially adjusted.',
  },
];

const stats = [
  { value: '15+', label: 'years of service' },
  { value: '100%', label: 'of individual donations to the mission' },
  { value: '1000+', label: 'lives changed' },
  { value: '12', label: 'month residential program' },
];

const programs = [
  {
    name: "Women's Campus",
    description:
      'A safe, supportive environment in which women heal, grow and rebuild their lives through faith-based recovery and life-skills training.',
    to: createPageUrl('WomensCampus'),
    image: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/d6694e82-5daa-4dc5-2bd3-788006a34500/large',
  },
  {
    name: "Men's Campus",
    description:
      'Structured programming, spiritual development and vocational training that help men overcome dependency and life-controlling issues.',
    to: createPageUrl('MensCampus'),
    image: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/59f4771a-4656-48bf-862b-1ccf413b4c00/large',
  },
  {
    name: 'Families & loved ones',
    description:
      'You are not the only one carrying this. Find out what help looks like when the person you love is the one struggling.',
    to: '/help-for-dependency-abuse',
  },
  {
    name: 'Our comprehensive approach',
    description:
      'The five foundations of freedom, our four key program areas, and the phased structure a resident moves through over twelve months.',
    to: '/Programs',
  },
];

const faqs = [
  {
    question: 'What does the program cost?',
    answer: (
      <>
        There is a one-time, non-refundable intake fee of $1,000 to cover initial costs. Beyond that,
        95% of the men at our facility attend at no cost — housing, meals, discipleship resources and
        program support are provided through our donors and micro-businesses. If cost is a barrier,
        call us anyway;{' '}
        <Link to="/Programs" className="font-semibold text-navy underline dark:text-gold">
          the full details are on our Programs page
        </Link>
        .
      </>
    ),
  },
  {
    question: 'How long is the program?',
    answer:
      'Twelve months, residential. The length is deliberate — lasting change takes time to build into real habits, relationships and spiritual depth that hold after graduation.',
  },
  {
    question: 'What does getting started involve?',
    answer:
      'Complete the application and questionnaire, call (601) 720-3718 for a phone interview with our intake coordinator, complete the required blood work (TB, HIV, and HEP B & C), then set an arrival date and begin.',
  },
  {
    question: 'Is Mercy House a nicotine-free campus?',
    answer:
      'Yes. Residents cannot smoke, dip or vape, and nicotine patches are not permitted. We say so plainly up front so nobody is surprised on arrival.',
  },
  {
    question: 'Do you serve both men and women?',
    answer: (
      <>
        Yes — we operate a{' '}
        <Link to={createPageUrl('MensCampus')} className="font-semibold text-navy underline dark:text-gold">
          men&apos;s campus
        </Link>{' '}
        and a{' '}
        <Link to={createPageUrl('WomensCampus')} className="font-semibold text-navy underline dark:text-gold">
          women&apos;s campus
        </Link>{' '}
        in Georgetown and Learned, Mississippi.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <SplitHero
        eyebrow="Mercy House Adult & Teen Challenge of Mississippi"
        headline="Broken Families Restored"
        headlineAccent="One Person At A Time"
        body="A Christ-centered, 12-month residential recovery ministry for men and women facing life-controlling problems — so they can become mentally sound, emotionally balanced and socially adjusted."
        primaryLabel="Get Help Now"
        primaryTo="/help-for-dependency-abuse"
        secondaryLabel="Donate"
        secondaryTo={createPageUrl('Donate')}
        reassurance="Confidential · Free to call · Faith-based, and we will meet you where you are"
        image="https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/9ecd83f4-804b-41e4-f9e8-62da01098800/hero1920scale"
        imageAlt="Families finding hope and freedom through Mercy House"
      />

      <AccreditationStrip items={accreditations} />

      <TwoPaths
        helpBody="For yourself or someone you love. Call (601) 720-3718 — it is confidential, and there is no cost to reach out."
        helpTo="/help-for-dependency-abuse"
        giveBody="Give, volunteer or partner with us so the next person who calls has a bed waiting for them."
        giveTo={createPageUrl('Donate')}
      />

      <HowWeHelp steps={steps} />

      <ImpactBand stats={stats} />

      {/* Mission */}
      <section className="bg-white py-section-sm dark:bg-slate-800 md:py-section">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-accent text-4xl font-bold text-navy dark:text-gold">Our Mission</h2>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
            To provide an effective and comprehensive Christian faith-based solution to
            life-controlling problems in order to become productive members of society. By applying
            biblical principles, we endeavor to help people become mentally sound, emotionally
            balanced, and socially adjusted.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-parchment py-section-sm dark:bg-slate-900 md:py-section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-accent text-4xl font-bold text-navy dark:text-gold">
            Who We Are
          </h2>
          <div className="overflow-hidden rounded-[10px] border-2 border-navy shadow-lg">
            <video controls className="w-full">
              <source
                src="https://media.base44.com/videos/public/6983b4b00291b5dfd8507106/60591bc3e_MercyHouse.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <ProgramsGrid programs={programs} />

      {/* Stories of hope — real, consented testimonials only; renders nothing
          until published testimonials exist. */}
      <section className="bg-parchment py-section-sm dark:bg-slate-900 md:py-section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-accent text-4xl font-bold text-navy dark:text-gold">
            Stories of hope
          </h2>
          <FeaturedTestimonials />
          <div className="mt-8 text-center">
            <Link
              to={createPageUrl('Testimonials')}
              className="font-semibold text-navy hover:underline dark:text-gold"
            >
              Read more graduate stories →
            </Link>
          </div>
        </div>
      </section>

      <GiftAllocation />

      {/* Workforce development */}
      <section className="bg-white py-section-sm dark:bg-slate-800 md:py-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-4 font-accent text-4xl font-bold text-navy dark:text-gold">
              Workforce Development
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              Our workforce development initiatives provide job training, develop work skills, and
              fund our operations — ensuring 100% of individual donations go directly to our mission.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {businesses.map((business) => (
              <a
                key={business.name}
                href={business.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mh-card-outline flex flex-col items-center justify-center p-6 text-center transition-shadow hover:shadow-lg dark:border-slate-600"
              >
                <img
                  src={business.logo}
                  alt=""
                  className="mb-3 h-16 object-contain"
                  loading="lazy"
                />
                <h3 className="text-sm font-semibold text-navy dark:text-gold">{business.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CommonQuestions items={faqs} />

      <CTABand
        heading="Ready to Start Your Journey?"
        subtext="Take the first step towards freedom and transformation today."
        primaryLabel="Apply Now"
        primaryTo={createPageUrl('IntakeForm')}
        secondaryLabel="Contact Us"
        secondaryTo={createPageUrl('Contact')}
      />
    </div>
  );
}
