import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Car, CheckCircle, FileText, Phone, ShieldCheck, Truck } from 'lucide-react';
import DonationForm from '@/components/vehicle-donation/DonationForm';
import NonprofitLegitimacy from '@/components/NonprofitLegitimacy';

/**
 * Vehicle Donation Program landing page.
 *
 * Built as a Google Ads destination: one clear action (the donation form), the
 * promises the ads make repeated in plain words on the page, visible nonprofit
 * credentials, a real phone number, and a privacy-policy link beside the form
 * that collects personal information. Nothing here links off to an unrelated
 * site or app, which paid traffic policy requires.
 */
const HERO_IMAGE =
  'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/bfc3c59ab_hero-vdo1.png';

const HERO_PROMISES = ['501(c)(3) nonprofit', 'Tax-deductible receipt', 'Proceeds stay in Mississippi'];

const STEPS = [
  {
    title: 'Send your vehicle details',
    desc: 'Fill in the two short steps below — it takes about two minutes.',
  },
  {
    title: 'We schedule your pickup',
    desc: 'A team member calls you within one business day to arrange free towing at your convenience.',
  },
  {
    title: 'You get the paperwork',
    desc: 'We handle the title transfer and mail your donation receipt for your taxes.',
  },
];

const BENEFITS = [
  {
    icon: Truck,
    title: 'Free pickup and towing',
    desc: 'We collect the vehicle from your home, workplace, or shop at no cost to you.',
  },
  {
    icon: Car,
    title: 'Running or not',
    desc: 'Cars, trucks, SUVs, vans, motorcycles, RVs, and boats all qualify, in nearly any condition.',
  },
  {
    icon: FileText,
    title: 'We handle the paperwork',
    desc: 'Title transfer, DMV forms, and a tax-deductible receipt — we walk you through it.',
  },
  {
    icon: ShieldCheck,
    title: 'Your gift stays local',
    desc: 'Proceeds support the men and women in our Mississippi recovery programs.',
  },
];

const FAQS = [
  {
    q: 'Is my vehicle donation tax-deductible?',
    a: 'Yes. Mercy House Adult & Teen Challenge is a 501(c)(3) nonprofit (EIN 45-4670832), so your donation is tax-deductible to the extent allowed by law. We send you a receipt for your records.',
  },
  {
    q: 'Does my vehicle have to run?',
    a: 'No. We accept vehicles that run and vehicles that do not, and we can tow them away for free.',
  },
  {
    q: 'What does the pickup cost?',
    a: 'Nothing. Pickup and towing are free anywhere in Mississippi, and there is no charge to you at any point.',
  },
  {
    q: 'What do you do with the vehicle?',
    a: 'Vehicles are sold or repaired to fund the ministry. Proceeds support housing, meals, counseling, and vocational training for people in our recovery programs.',
  },
];

function HeroCta({ children, href, outlined = false }) {
  if (outlined) {
    return (
      <a
        href={href}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-white px-6 py-[13px] font-bold text-white transition-colors hover:bg-white hover:text-navy"
      >
        {children}
      </a>
    );
  }
  return (
    <a href={href} className="mh-cta-primary">
      {children}
    </a>
  );
}

export default function VehicleDonation() {
  return (
    <div className="w-full bg-card">
      {/* Hero — the ad's promise, in words a visitor recognizes immediately. */}
      <section className="relative isolate overflow-hidden bg-navy-deep">
        <img
          src={HERO_IMAGE}
          alt="Supporters beside vehicles donated to Mercy House Adult & Teen Challenge"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-deep/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center text-white sm:px-6 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-gold-300">
            Vehicle Donation Program
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Donate Your Vehicle, Change a Life
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-100 md:text-xl">
            Free pickup anywhere in Mississippi — running or not. Your car, truck, RV, boat, or
            motorcycle becomes housing, meals, and care for someone in recovery.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <HeroCta href="#donation-form">Start My Donation</HeroCta>
            <HeroCta href="tel:6015727296" outlined>
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call (601) 572-7296
            </HeroCta>
          </div>
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-100">
            {HERO_PROMISES.map((promise) => (
              <li key={promise} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold-300" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Credentials — the trust signals a paid landing page is judged on. */}
      <section className="bg-card px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <NonprofitLegitimacy variant="compact" />
        </div>
      </section>

      {/* The conversion point, high on the page. */}
      <section id="donation-form" className="scroll-mt-32 bg-card px-4 pb-14 sm:px-6 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="mh-eyebrow">Two short steps</p>
            <h2 className="mh-h2 mt-3">Start Your Vehicle Donation</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Tell us about your vehicle and how to reach you. Our team confirms the details and
              schedules your free pickup.
            </p>
          </div>

          <div className="mh-card p-6 md:p-8">
            <DonationForm />
          </div>

          <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
            We use the information you give us only to arrange your donation and send your receipt.
            See our{' '}
            <Link
              to={createPageUrl('PrivacyPolicy')}
              className="font-semibold text-gold-accessible underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="mh-eyebrow">How it works</p>
            <h2 className="mh-h2 mt-3">Three Simple Steps</h2>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((item, index) => (
              <li key={item.title} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy dark:text-gold">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why donate your vehicle */}
      <section className="bg-card px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mh-eyebrow">Why donate your vehicle</p>
            <h2 className="mh-h2 mt-3">Easy for You, Life-Changing for Someone Else</h2>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="mh-card p-6">
                <Icon className="h-7 w-7 text-gold-accessible" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-navy dark:text-gold">{title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Questions */}
      <section className="bg-muted px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mh-eyebrow">Questions</p>
            <h2 className="mh-h2 mt-3">Vehicle Donation FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`} className="mh-card mb-3 border-b-0 px-5">
                <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline dark:text-slate-100">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing contact band */}
      <section className="bg-navy px-4 py-14 text-center text-white sm:px-6 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold md:text-4xl">Prefer to Talk It Through?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-200">
            Call our team and we will answer your questions and arrange the pickup for you.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="tel:6015727296" className="mh-cta-primary">
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call (601) 572-7296
            </a>
            <Link
              to={createPageUrl('Contact')}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-white px-6 py-[13px] font-bold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Contact Us
            </Link>
          </div>
          <p className="mt-6 text-base text-slate-200">
            info@mercyhouseatc.com · 1110 Mary St, Georgetown, MS 39078
          </p>
        </div>
      </section>
    </div>
  );
}