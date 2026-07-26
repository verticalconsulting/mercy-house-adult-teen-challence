import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Closing CTA band — full-bleed navy with a single gold action and one
 * outlined secondary. This is the last focal point on a page, so nothing else
 * below it should carry gold.
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
      <div className="mx-auto max-w-3xl text-center text-white">
        <h2 className="text-[38px] font-bold leading-tight">{heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{subtext}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={primaryTo} className="mh-cta-primary">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-white/50 px-6 py-[15px] font-bold text-white transition-colors hover:bg-white hover:text-navy"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
