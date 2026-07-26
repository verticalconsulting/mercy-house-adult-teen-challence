import React from 'react';

/**
 * Navy stats band with gold numerals.
 *
 * Gold on navy is ~3.9:1, which clears WCAG AA for large text only — so the
 * numerals are display-sized (46px/900) and the caption underneath stays white.
 * Do not shrink these numerals without changing their colour.
 *
 * @param {object} props
 * @param {Array<{ value: string, label: string }>} props.stats
 */
export default function ImpactBand({ stats = [] }) {
  if (stats.length === 0) return null;

  return (
    <section aria-label="Our impact" className="bg-navy py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-[46px] font-black leading-none text-gold">{stat.value}</div>
            <div className="mt-2 text-sm leading-snug text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
