import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABand({
  heading = 'Ready to Take the Next Step?',
  subtext = 'Whether you are seeking help, supporting a loved one, or looking to give — we are here.',
  primaryLabel = 'Get Help Now',
  primaryTo = '/Contact',
  secondaryLabel = 'Support the Mission',
  secondaryTo = '/Donate',
}) {
  return (
    <section className="bg-navy dark:bg-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">{subtext}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={primaryTo}
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            {primaryLabel} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}