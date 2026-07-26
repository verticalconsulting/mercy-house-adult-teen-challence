import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * "Where your gift goes" — the dashed-gold panel with an allocation bar from
 * wireframe B, paired with a link out to the published financials so the claim
 * is verifiable rather than asserted.
 *
 * @param {object} props
 * @param {string} [props.heading]
 * @param {number} [props.percent] Share of the bar to fill, 0–100.
 * @param {string} [props.claim] Sentence stated next to the bar.
 * @param {string} [props.note] Supporting explanation under the claim.
 * @param {string} [props.linkLabel]
 * @param {string} [props.linkTo]
 */
export default function GiftAllocation({
  heading = 'Where your gift goes',
  percent = 100,
  claim = '100% of individual donations go directly to the mission',
  note = 'Our micro-businesses — SuperThrift, the vehicle donation program, auto sales and Elite Gutters — fund operations, so individual gifts stay with the people we serve.',
  linkLabel = 'Read our financials and annual reports',
  linkTo = '/Financials',
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <section className="bg-parchment py-section-sm dark:bg-slate-900 md:py-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[10px] border-[1.5px] border-dashed border-gold-deep bg-parchment-soft p-7 dark:bg-slate-800">
          <h2 className="font-accent text-3xl font-bold text-navy dark:text-gold">{heading}</h2>

          <div className="mt-5 flex items-center gap-4">
            <div
              className="h-4 flex-1 overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label={claim}
            >
              <div className="h-full bg-navy-light" style={{ width: `${clamped}%` }} />
            </div>
            <span className="shrink-0 text-sm font-bold text-navy dark:text-gold">{clamped}%</span>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{claim}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{note}</p>

          <Link
            to={linkTo}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy hover:underline dark:text-gold"
          >
            {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
