import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HandHeart, LifeBuoy } from 'lucide-react';

/**
 * The "two clear paths" block from wireframe C.
 *
 * Both routes are offered, but "I need help" is the visual primary: it carries
 * the gold fill while "I want to help" stays outlined. Someone in crisis should
 * never have to hunt past a donation ask to find the door.
 */
export default function TwoPaths({
  helpTitle = 'I need help',
  helpBody = 'For yourself or someone you love. Confidential, and there is no cost to call.',
  helpLabel = 'Start now',
  helpTo = '/help-for-dependency-abuse',
  giveTitle = 'I want to help',
  giveBody = 'Give, volunteer, or partner with us so the next person has a bed waiting.',
  giveLabel = 'Ways to give',
  giveTo = '/Donate',
}) {
  return (
    <section className="bg-parchment py-section-sm dark:bg-slate-900 md:py-section">
      <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {/* Primary path — gold fill */}
        <div className="flex flex-col items-center gap-3 rounded-[10px] border-2 border-navy bg-gold p-7 text-center">
          <LifeBuoy className="h-9 w-9 text-navy" aria-hidden="true" />
          <h3 className="text-xl font-bold text-navy">{helpTitle}</h3>
          <p className="text-sm leading-relaxed text-navy/85">{helpBody}</p>
          <Link
            to={helpTo}
            className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-navy px-6 font-bold text-white transition-colors hover:bg-navy-deep"
          >
            {helpLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Secondary path — outlined */}
        <div className="mh-card-outline flex flex-col items-center gap-3 p-7 text-center dark:border-slate-600">
          <HandHeart className="h-9 w-9 text-navy dark:text-gold" aria-hidden="true" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{giveTitle}</h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{giveBody}</p>
          <Link to={giveTo} className="mh-cta-secondary mt-2">
            {giveLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
