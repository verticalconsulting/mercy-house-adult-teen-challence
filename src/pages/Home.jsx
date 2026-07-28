import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Truck } from 'lucide-react';
import { createPageUrl } from '../utils';
import CTABand from '../components/CTABand';
import FeaturedTestimonials from '../components/FeaturedTestimonials';
import AccreditationStrip from '../components/site/AccreditationStrip';
import CommonQuestions from '../components/site/CommonQuestions';
import GiftAllocation from '../components/site/GiftAllocation';
import HowWeHelp from '../components/site/HowWeHelp';
import ImpactBand from '../components/site/ImpactBand';
import ProgramsGrid from '../components/site/ProgramsGrid';
import SiteHero from '../components/site/SiteHero';

const businesses = [
  {
    name: 'SuperThrift',
    blurb: 'Quality resale that funds recovery.',
    icon: Store,
    href: 'https://mercyhouseatc.superthriftdeals.org',
  },
  {
    name: 'Vehicle Donation Program',
    blurb: 'Turn a vehicle you no longer need into a bed for someone who does.',
    icon: Truck,
    href: 'https://mercyhouseatc.vehicledonationms.org',
  },
  {
    name: 'Mercy House Auto',
    blurb: 'Vehicle sales supporting the mission.',
    icon: Truck,
    href: 'https://mercyhouseautocenter.com/',
  },
  {
    name: 'Elite Gutters',
    blurb: 'A trade our residents learn, and a business that funds the program.',
    icon: Store,
    href: 'https://myelitegutters.com',
  },
];

const accreditations = [
  {
    label: 'Candid Platinum Seal of Transparency',
    href: 'https://app.candid.org/profile/9237605/mercy-house-teen-challenge-45-4670832/?pkId=85b52dd6-b112-4838-af55-83779d6afa0f',
  },
  { label: 'Adult & Teen Challenge Affiliated' },
  { label: '501(c)(3) · EIN 99-1943281', to: '/Financials' },
  { label: '100% of gifts to the mission', to: '/Financials' },
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
  { value: '15+', label: 'Years of Service' },
  { value: '100%', label: 'Donations to Mission' },
  { value: '1,000+', label: 'Lives Changed' },
  { value: '12', label: 'Month Residential Program' },
];

const programs = [
  {
    name: "Women's Program",
    description:
      'A 12-month residential discipleship program in Learned, Mississippi for women ready to find freedom, rebuild family, and step into a new life in Christ.',
    to: createPageUrl('WomensCampus'),
    image: '/assets/images/women-program.png',
    imageAlt: 'Women in the Mercy House program gathered together outdoors',
    badge: 'Now Enrolling',
  },
  {
    name: "Men's Program",
    description:
      'A 12-month residential discipleship program in Georgetown, Mississippi where men build godly character, practical skills, and the accountability that keeps freedom from slipping away.',
    to: createPageUrl('MensCampus'),
    image: '/assets/images/mens-1.jpeg',
    imageAlt: 'Men in the Mercy House program working together on campus',
    badge: 'Now Enrolling',
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
      <SiteHero
        headline="Broken Families"
        headlineBreak="Restored"
        body="Providing comprehensive Christian faith-based solutions to life-controlling problems. Find new life, godly character, and lasting freedom."
        primaryLabel="Start Your Journey"
        primaryTo={createPageUrl('IntakeForm')}
        secondaryLabel="Donate"
        secondaryTo={createPageUrl('Donate')}
        reassurance="Confidential · Free to call · Faith-based, never preachy"
        image="/assets/images/family-hero.webp"
        imageAlt="A family standing together outdoors at sunrise"
      />

      <AccreditationStrip items={accreditations} />

      {/* Mission */}
      <section className="bg-card py-section-sm md:py-section dark:bg-slate-800">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mh-eyebrow">Our Mission</p>
          <h2 className="mt-4 mh-h2">Broken families restored, one person at a time.</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            To provide an effective and comprehensive Christian faith-based solution to
            life-controlling problems in order to become productive members of society. By applying
            biblical principles, we endeavor to help people become mentally sound, emotionally
            balanced, and socially adjusted.
          </p>
        </div>
      </section>

      <ProgramsGrid programs={programs} heading="Who We Serve" />

      <ImpactBand stats={stats} />

      <HowWeHelp steps={steps} />

      {/* Who We Are */}
      <section className="bg-background py-section-sm md:py-section dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mh-eyebrow">Who We Are</p>
            <h2 className="mt-3 mh-h2">See the ministry for yourself</h2>
          </div>
          <div className="mh-card mt-10 overflow-hidden">
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

      {/* Stories of hope — real, consented testimonials only; renders nothing
          until published testimonials exist. */}
      <section className="bg-card py-section-sm md:py-section dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mh-eyebrow">Stories</p>
            <h2 className="mt-3 mh-h2">Stories of hope</h2>
          </div>
          <div className="mt-10">
            <FeaturedTestimonials />
          </div>
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
      <section className="bg-card py-section-sm md:py-section dark:bg-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mh-eyebrow">Workforce Development</p>
            <h2 className="mt-4 mh-h2">Work that funds the mission</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Our industries provide job training and real-world skills — and ensure 100% of
              individual donations go directly to our mission.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {businesses.map((business) => {
              const Icon = business.icon;
              return (
                <a
                  key={business.name}
                  href={business.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mh-card mh-card-interactive bg-stone-100 p-8 text-center dark:bg-slate-700"
                >
                  <Icon className="mx-auto h-8 w-8 text-navy dark:text-gold" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-navy dark:text-gold">
                    {business.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{business.blurb}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <CommonQuestions items={faqs} />

      <CTABand
        heading="Ready to Start Your Journey?"
        subtext="Take the first step toward freedom and transformation today."
        primaryLabel="Apply Now"
        primaryTo={createPageUrl('IntakeForm')}
        secondaryLabel="Contact Us"
        secondaryTo={createPageUrl('Contact')}
      />
    </div>
  );
}