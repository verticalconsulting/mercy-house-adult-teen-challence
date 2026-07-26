import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Split hero — wireframe approach A, "help-first, donate second".
 *
 * Copy and one gold primary CTA on the left, imagery on the right. The gold
 * fill is spent on a single action above the fold; donating stays an outlined
 * secondary so a help-seeker is never competing with a fundraising ask.
 *
 * Gold CTAs always take navy text — white on #CFA869 is about 2:1 and fails
 * WCAG AA.
 */
export default function SplitHero({
  eyebrow,
  headline,
  headlineAccent,
  body,
  primaryLabel = 'Get Help',
  primaryTo = '/help-for-dependency-abuse',
  secondaryLabel = 'Donate',
  secondaryTo = '/Donate',
  reassurance,
  image,
  imageAlt = '',
}) {
  return (
    <section className="bg-parchment dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-section-sm sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-section">
        <div>
          {eyebrow && (
            <p className="font-accent text-2xl font-bold text-navy dark:text-gold">{eyebrow}</p>
          )}

          <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            {headline}
            {headlineAccent && (
              <span className="mt-2 block text-navy dark:text-gold">{headlineAccent}</span>
            )}
          </h1>

          {body && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {body}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={primaryTo} className="mh-cta-primary text-lg">
              {primaryLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link to={secondaryTo} className="mh-cta-secondary text-lg">
              {secondaryLabel}
            </Link>
          </div>

          {reassurance && (
            <p className="mh-note mt-6 max-w-xl text-sm">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold"
              />
              <span>{reassurance}</span>
            </p>
          )}
        </div>

        <div className="lg:justify-self-end">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className="aspect-[4/3] w-full rounded-[10px] border-2 border-navy object-cover shadow-lg"
              width="720"
              height="540"
            />
          ) : (
            /* Placeholder keeps the hero's shape when no image is supplied. */
            <div
              aria-hidden="true"
              className="aspect-[4/3] w-full rounded-[10px] border-2 border-navy bg-parchment-deep bg-wire-placeholder"
            />
          )}
        </div>
      </div>
    </section>
  );
}
