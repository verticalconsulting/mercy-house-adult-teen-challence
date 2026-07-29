import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CTABand from '../components/CTABand';

const INTAKE_PHONE = '(601) 720-3718';

const FAQ_SECTIONS = [
  {
    eyebrow: 'About the Program',
    heading: 'What Mercy House Is',
    items: [
      {
        question: 'Is Mercy House a rehab or a medical treatment center?',
        answer: (
          <>
            No. Mercy House is a <strong>Christ-centered, faith-based residential recovery ministry</strong>, not a
            medical or clinical rehab. We rely on the teachings of Christ, the work of the Holy Spirit, and the
            practical application of biblical principles as the core of transformation. While we recognize the value
            of medical and psychological care, we approach life-controlling issues from a spiritual perspective and
            call our process <em>discipleship</em>, not treatment.
          </>
        ),
      },
      {
        question: 'Is the program just for teens?',
        answer: (
          <>
            Despite the "Teen Challenge" name, Adult &amp; Teen Challenge works with <strong>adults and families</strong>.
            At Mercy House, our residential programs serve adults — one campus for men and one for women. The national
            network does include adolescent programs, but our Mississippi locations focus on adults.
          </>
        ),
      },
      {
        question: 'How is Mercy House different from a 30-day rehab?',
        answer: (
          <>
            Most programs manage addiction as a symptom over 30 days. We believe life-controlling issues require a
            complete <strong>identity reconstruction</strong>, which is why we ask for 12 months. The results speak for
            themselves: <strong className="text-navy">50% of our graduates remain sober five years after completing the program</strong> —
            in a state that ranks among the highest for incarceration and mental illness.
          </>
        ),
      },
      {
        question: 'How long is the program?',
        answer: (
          <>
            The residential program is <strong>12 months</strong>. Progression through the phases depends on each
            student's determination and growth rather than a fixed calendar — it's about real change, not just time served.
          </>
        ),
      },
      {
        question: 'Is Mercy House affiliated with a larger organization?',
        answer: (
          <>
            Yes. We are part of <strong>Adult &amp; Teen Challenge</strong>, one of the world's largest faith-based
            recovery organizations, operating in over 100 countries. That affiliation provides a proven framework while
            our local team delivers the personal, Mississippi-rooted community that makes Mercy House home.
          </>
        ),
      },
    ],
  },
  {
    eyebrow: 'Admissions',
    heading: 'Getting In',
    items: [
      {
        question: 'How do I apply for the program?',
        answer: (
          <>
            You can start by calling our intake coordinator at{' '}
            <a href="tel:6017203718" className="text-navy font-semibold hover:underline">{INTAKE_PHONE}</a> or by
            completing our secure online{' '}
            <Link to="/IntakeForm" className="text-navy font-semibold hover:underline">Intake Application</Link>. Our
            intake staff will walk you through admission requirements and answer any questions.
          </>
        ),
      },
      {
        question: 'Is the program voluntary? Can someone be forced to attend?',
        answer: (
          <>
            Yes — entrance is completely <strong>voluntary</strong>. We are not a lock-down facility and cannot take
            someone against their will. A person must genuinely want help and agree to participate in every aspect of
            the program, including its faith-based elements.
          </>
        ),
      },
      {
        question: 'Do I need to detox before coming to Mercy House?',
        answer: (
          <>
            Yes. Most students need to <strong>detox — preferably a medically supervised detox — before entering</strong>.
            Our program is not a medical detox facility. Your intake coordinator can help recommend local resources to
            complete detox safely before admission.
          </>
        ),
      },
      {
        question: 'Do you accept people with mental health diagnoses (dual diagnosis)?',
        answer: (
          <>
            Dual diagnosis is common, but Mercy House is not a licensed drug, alcohol, or mental-health treatment
            center and does not employ licensed therapists. If an applicant's mental-health needs are beyond our scope,
            we will help redirect them to a facility equipped to provide that care.{' '}
            <Link to="/Contact" className="text-navy font-semibold hover:underline">Call intake</Link> to discuss your specific situation honestly.
          </>
        ),
      },
      {
        question: 'Does Mercy House take insurance or Medicaid?',
        answer: (
          <>
            No. Because we are a faith-based ministry and not a licensed medical treatment center, we do not bill
            insurance or Medicaid. Our program is funded through the modest intake fee and the generosity of donors.
            No one is turned away solely for inability to pay — payment plans and scholarships are available.
          </>
        ),
      },
      {
        question: 'Do I need to bring my own transportation?',
        answer: (
          <>
            Yes. Students must provide their own transportation to the campus at admission. If transportation is a true
            barrier, please discuss it with our intake coordinator and we'll do our best to help problem-solve.
          </>
        ),
      },
    ],
  },
  {
    eyebrow: 'Cost',
    heading: 'Fees & Payment',
    items: [
      {
        question: 'How much does the program cost?',
        answer: (
          <>
            There is a <strong>$1,000 intake fee</strong> that helps offset initial program costs. Beyond that,
            students are not charged monthly tuition — much of the program is funded through donations and our
            student-participating micro-businesses. No one is turned away for inability to pay; payment plans and
            scholarships are available.
          </>
        ),
      },
      {
        question: "Can I get help paying the intake fee?",
        answer: (
          <>
            If the $1,000 fee is a hardship,{' '}
            <Link to="/Contact" className="text-navy font-semibold hover:underline">call our intake coordinator</Link>{' '}
            at <a href="tel:6017203718" className="text-navy font-semibold hover:underline">{INTAKE_PHONE}</a>. Payment
            plans and scholarships are available, and donors often sponsor intake fees for students in need.
          </>
        ),
      },
      {
        question: 'Is the intake fee refundable if someone leaves early?',
        answer: (
          <>
            In most cases the intake/admission fee is <strong>non-refundable</strong>, as it covers the costs of intake
            processing and the initial program period. This policy is explained in writing at admission. If you have
            concerns, please discuss them with intake staff before entering.
          </>
        ),
      },
      {
        question: "Can I sponsor a student's intake fee?",
        answer: (
          <>
            Absolutely — yes. You can{' '}
            <Link to="/SponsorStudent" className="text-navy font-semibold hover:underline">sponsor a student</Link>{' '}
            directly or give toward intake fees through our{' '}
            <Link to="/Donate" className="text-navy font-semibold hover:underline">donation page</Link>.
            Sponsorship is one of the most direct ways to put a person through the door who couldn't otherwise afford it.
          </>
        ),
      },
    ],
  },
  {
    eyebrow: 'Daily Life',
    heading: 'Life in the Program',
    items: [
      {
        question: 'Can students bring prescribed medication?',
        answer: (
          <>
            Only <strong>non-addictive medications with a low risk for abuse</strong> are allowed. Opiate-derived pain
            medications, anti-anxiety drugs, and any mind- or mood-altering medications with misuse potential are
            strictly prohibited. If such a medication is medically necessary, a person should wait until that treatment
            is complete before entering. Discuss your prescriptions with intake staff in advance.
          </>
        ),
      },
      {
        question: 'Is Mercy House a tobacco-free campus?',
        answer: (
          <>
            Yes. Mercy House is a <strong>tobacco-free</strong> facility. The foundational principles of the program
            require abstinence from all addictive substances, including nicotine.
          </>
        ),
      },
      {
        question: 'Do students have to take part in the religious aspects of the program?',
        answer: (
          <>
            Yes. Every person who enters is given full disclosure that this is a <strong>Christian faith-based
            program</strong>, and entrance is voluntary. Participation in all aspects — including chapel, biblical
            studies, and worship — is part of that voluntary agreement.
          </>
        ),
      },
      {
        question: 'Do students work during the program?',
        answer: (
          <>
            Yes. <strong>Work therapy</strong> is a core part of recovery. Students participate in hands-on vocational
            training through our micro-businesses — the Mercy House Auto Center, SuperThrift stores, and the
            Woodshop/Craft Center — learning responsibility, teamwork, and real-world job skills they'll carry for life.
          </>
        ),
      },
      {
        question: 'What should I bring with me?',
        answer: (
          <>
            A packing list is provided during intake. Generally students bring modest, practical clothing and personal
            essentials. Prohibited items (addictive substances, certain medications, and items that don't support the
            program environment) are detailed by intake staff before admission.
          </>
        ),
      },
    ],
  },
  {
    eyebrow: 'Family',
    heading: 'Family & Visitation',
    items: [
      {
        question: 'Can family members visit a student?',
        answer: (
          <>
            Yes, with guidelines. Generally <strong>only immediate family members</strong> may visit, and contact with
            others is restricted early in the program to protect each student's recovery. Specific visitation days and
            policies are shared during the intake process and may adjust as a student progresses through phases.
          </>
        ),
      },
      {
        question: 'Does the program help restore families?',
        answer: (
          <>
            Yes — family restoration is one of our four core programmatic areas. Addiction shatters families, so a
            primary goal is helping broken families rebuild trust, find support, and establish a clear path toward
            healing and reconciliation. A person isn't truly restored until their family is part of the story.
          </>
        ),
      },
      {
        question: "I'm a family member worried about a loved one. What do I do first?",
        answer: (
          <>
            Call our intake coordinator at{' '}
            <a href="tel:6017203718" className="text-navy font-semibold hover:underline">{INTAKE_PHONE}</a>. We'll
            listen, answer your questions honestly, and help you understand whether Mercy House is the right fit and
            what next steps look like. You can also read our{' '}
            <Link to="/help-for-dependency-abuse" className="text-navy font-semibold hover:underline">help for dependency &amp; abuse</Link>{' '}
            page.
          </>
        ),
      },
    ],
  },
  {
    eyebrow: 'Giving',
    heading: 'Donations & Volunteering',
    items: [
      {
        question: 'How is Mercy House funded?',
        answer: (
          <>
            Mercy House is a 501(c)(3) nonprofit funded primarily by <strong>charitable donations</strong> from
            individuals, churches, and businesses, along with revenue from our student-staffed micro-businesses. The
            modest intake fee only partially offsets costs; gifts cover housing, meals, program care, and ministry
            operations.
          </>
        ),
      },
      {
        question: 'Is my donation tax-deductible?',
        answer: (
          <>
            Yes. Mercy House Adult &amp; Teen Challenge is a registered 501(c)(3) nonprofit, and your gifts are
            tax-deductible to the extent allowed by law. You'll receive a receipt for every gift.
          </>
        ),
      },
      {
        question: 'Can I donate my vehicle?',
        answer: (
          <>
            Yes. Our <Link to="/VehicleDonation" className="text-navy font-semibold hover:underline">Vehicle Donation Program</Link>{' '}
            accepts running and non-running vehicles. Proceeds directly support the ministry, and we handle the
            pickup and paperwork — including your tax-deductible receipt.
          </>
        ),
      },
      {
        question: 'How can I volunteer?',
        answer: (
          <>
            We'd love to have you. Visit our <Link to="/Volunteer" className="text-navy font-semibold hover:underline">Volunteer page</Link>{' '}
            to share your availability and areas of interest — from mentoring and tutoring to the kitchen, thrift
            store, auto academy, events, and more. A background check is required for most roles.
          </>
        ),
      },
      {
        question: 'Where are the Mercy House campuses located?',
        answer: (
          <>
            We have two Mississippi campuses: the <Link to="/MensCampus" className="text-navy font-semibold hover:underline">Men's Campus</Link>{' '}
            in Georgetown and the <Link to="/WomensCampus" className="text-navy font-semibold hover:underline">Women's Campus</Link>{' '}
            in Learned. See our <Link to="/Contact" className="text-navy font-semibold hover:underline">Contact page</Link> for addresses and directions.
          </>
        ),
      },
    ],
  },
];

export default function FAQ() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_SECTIONS;
    return FAQ_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((it) => {
        const text = it.question.toLowerCase() + ' ' +
          (typeof it.answer === 'string' ? it.answer : JSON.stringify(it.answer.props?.children || ''));
        return text.toLowerCase().includes(q);
      }),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const totalQuestions = FAQ_SECTIONS.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-950 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/400f75909_IMG_5808.JPEG"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gold/20 flex items-center justify-center">
            <HelpCircle className="w-9 h-9 text-gold" />
          </div>
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Frequently Asked Questions</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Questions, Answered</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Whether you're considering Mercy House for yourself or a loved one — or looking to give — here are the
            answers to the questions we hear most. Can't find what you need? Our intake team is one call away.
          </p>
          <a href="tel:6017203718" className="inline-flex items-center gap-2 text-gold font-semibold hover:underline">
            <Phone className="w-5 h-5" /> {INTAKE_PHONE}
          </a>
        </div>
      </section>

      {/* Search */}
      <section className="py-10 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${totalQuestions} questions…`}
              className="pl-12 h-12 text-base rounded-full"
              aria-label="Search questions" />
          </div>
        </div>
      </section>

      {/* Sections */}
      {filtered.length === 0 ? (
        <section className="py-20 text-center">
          <p className="text-slate-500 text-lg">No questions matched "<span className="font-semibold">{query}</span>".</p>
          <p className="text-slate-400 mt-2">Try a different search, or call our intake team.</p>
        </section>
      ) : (
        filtered.map((section) => (
          <section key={section.heading} className="py-14 first:pt-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <p className="mh-eyebrow">{section.eyebrow}</p>
                <h2 className="mt-2 mh-h2">{section.heading}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`${section.heading}-${index}`}
                    className="rounded-xl border border-border bg-white dark:bg-slate-800 px-5 dark:border-slate-600">
                    <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline dark:text-slate-100">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ))
      )}

      <CTABand
        heading="Still Have Questions?"
        subtext="Our intake coordinator is ready to listen, answer honestly, and help you find the right next step — for yourself or someone you love."
        primaryLabel="Apply for the Program"
        primaryTo="/IntakeForm"
        secondaryLabel="Contact Us"
        secondaryTo="/Contact" />

      <div className="pb-4" />
    </div>
  );
}