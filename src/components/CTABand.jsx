import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Closing CTA band. Uses the wireframe's navy-with-gold-primary pairing: one
 * gold action (navy text, per WCAG AA) and one outlined secondary.
 */
export default function CTABand({
  heading = 'Ready to Take the Next Step?',
  subtext = 'Whether you are seeking help, supporting a loved one, or looking to give — we are here.',
  primaryLabel = 'Get Help Now',
  primaryTo = '/Contact',
  secondaryLabel = 'Support the Mission',
  secondaryTo = '/Donate',
}) {
  return (
    <section className="bg-navy px-4 py-section-sm md:py-section">
      <div className="mx-auto max-w-4xl text-center text-white">
        <h2 className="mb-4 font-accent text-4xl font-bold md:text-5xl">{heading}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-200">{subtext}</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to={primaryTo} className="mh-cta-primary text-lg">
            {primaryLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border-2 border-white px-6 text-lg font-bold text-white transition-colors hover:bg-white hover:text-navy"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
