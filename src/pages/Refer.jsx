import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Phone, FileDown, ArrowRight, Users, Clock, MapPin } from 'lucide-react';

const INTAKE_PHONE = '(601) 720-3718';
const INTAKE_PHONE_TEL = '+16017203718';

export default function Refer() {
  const [packetUrl, setPacketUrl] = useState(null);
  const [loadingPacket, setLoadingPacket] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const page = await base44.entities.DocumentResource.filter(
          { published: true },
          { sort: 'display_order', limit: 100 }
        );
        const items = page?.items || [];
        const referral = items.find(
          (d) => /referral/i.test(d.title || '') && /\.pdf$/i.test(d.file_url || '')
        ) || items.find((d) => /referral/i.test(d.title || ''));
        if (active && referral?.file_url) setPacketUrl(referral.file_url);
      } catch {
        // leave null — the button falls back to the media resources page
      } finally {
        if (active) setLoadingPacket(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/40 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <p className="mh-eyebrow text-gold">For Pastors & Counselors</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
            Refer Someone to Mercy House
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
            A Christ-centered residential recovery program in Mississippi for men
            and women ready to find lasting freedom from addiction and
            life-controlling issues.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/get-help-now"
              className="mh-cta-primary"
            >
              Send Someone an Application
              <ArrowRight className="w-5 h-5" />
            </Link>
            {packetUrl ? (
              <a
                href={packetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mh-cta-navy"
              >
                <FileDown className="w-5 h-5" />
                Download Referral Packet
              </a>
            ) : loadingPacket ? (
              <span className="mh-cta-navy opacity-70 pointer-events-none">
                <FileDown className="w-5 h-5" />
                Loading packet…
              </span>
            ) : (
              <Link to="/media" className="mh-cta-navy">
                <FileDown className="w-5 h-5" />
                Download Referral Packet
              </Link>
            )}
          </div>
          <p className="mt-6 text-slate-300 text-sm">
            Questions? Call our Intake Coordinator at{' '}
            <a href={`tel:${INTAKE_PHONE_TEL}`} className="text-gold font-semibold hover:underline">
              {INTAKE_PHONE}
            </a>
            .
          </p>
        </div>
      </section>

      {/* Intro: who we serve + what the program involves */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="mh-eyebrow">Who Mercy House Serves</p>
            <h2 className="mh-h2 mt-3">
              For the person you are walking alongside
            </h2>
            <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">
              Mercy House Adult & Teen Challenge serves men and women
              (18&nbsp;and older) struggling with substance addiction and other
              life-controlling issues. Many arrive referred by a pastor,
              counselor, family member, or court officer who recognizes that a
              short detox is not enough — that what they need is a long-term,
              structured, Christ-centered environment where real
              transformation can take root.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              We operate two campuses in Mississippi: a men&rsquo;s center in
              Georgetown and a women&rsquo;s center in Learned. We are not a
              medical detox or crisis shelter — we are a 12-month residential
            recovery ministry for someone ready to do the hard work of change.</p>
          </div>

          <div>
            <p className="mh-eyebrow">What the Program Involves</p>
            <h2 className="mh-h2 mt-3">A full year of discipleship & recovery</h2>
            <ul className="mt-5 space-y-3 text-slate-600 dark:text-slate-300">
              {[
                'Daily structure, biblical counseling, and chapel in a Christ-centered community',
                'Education support, including GED preparation and life-skills development',
                'Workforce development through our social enterprises and vocational training',
                'A phased recovery journey from intake and orientation to graduation and reentry',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">
              Residents step into a predictable rhythm of work, study,
              prayer, and accountability — surrounded by staff and peers
              committed to their restoration. The goal is not sobriety alone,
              but a rebuilt life and a living faith.
            </p>
          </div>
        </div>
      </section>

      {/* How to refer */}
      <section className="bg-navy-50 dark:bg-slate-900 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="mh-eyebrow text-center">Three Simple Steps</p>
          <h2 className="mh-h2 mt-3 text-center">How to Refer Someone</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { icon: FileDown, title: 'Download the Packet', body: 'Grab our one-page referral packet to share with the person or their family.' },
              { icon: ArrowRight, title: 'Share the Application', body: 'Send them the online intake application so they can begin the admissions process.' },
              { icon: Phone, title: 'Call Intake', body: 'Have questions about fit or readiness? Call our Intake Coordinator directly.' },
            ].map((step) => (
              <div key={step.title} className="mh-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-accessible">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy dark:text-gold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + contact band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="rounded-2xl bg-navy text-white overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Ready to send someone an application?
              </h2>
              <p className="mt-4 text-slate-200 leading-relaxed">
                The fastest way to help someone start is to share our online
                intake application. It takes the first concrete step toward a
                changed life.
              </p>
              <div className="mt-6">
                <Link to="/get-help-now" className="mh-cta-primary">
                  Send Someone an Application
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="p-8 lg:p-12 bg-navy-900/40 border-t md:border-t-0 md:border-l border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Talk to our Intake Coordinator
              </h2>
              <p className="mt-4 text-slate-200 leading-relaxed">
                We are glad to answer questions about the program, readiness,
                or the referral process.
              </p>
              <a
                href={`tel:${INTAKE_PHONE_TEL}`}
                className="mt-6 inline-flex items-center gap-3 text-2xl font-bold text-gold hover:underline"
              >
                <Phone className="w-6 h-6" />
                {INTAKE_PHONE}
              </a>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  Monday – Friday, 8:00&nbsp;am – 5:00&nbsp;pm
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  Georgetown & Learned, Mississippi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/media" className="text-navy dark:text-gold font-semibold hover:underline">
            Browse all media & resources
          </Link>
        </div>
      </section>
    </div>
  );
}