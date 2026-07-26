import React from 'react';

/**
 * Navy impact band with gold numerals — the stat strip from wireframe A.
 *
 * Gold on navy is ~3.7:1, which clears WCAG AA for large text; the numerals are
 * intentionally display-sized, and the caption underneath stays white so the
 * label itself is never the low-contrast element.
 *
 * @param {object} props
 * @param {Array<{ value: string, label: string }>} props.stats
 */
export default function ImpactBand({ stats = [] }) {
  if (stats.length === 0) return null;

  return (
    <section aria-label="Our impact" className="bg-navy py-14 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-accent text-5xl font-bold leading-none text-gold md:text-6xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm leading-snug text-slate-200">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
