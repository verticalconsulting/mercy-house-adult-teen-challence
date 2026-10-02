import React from 'react';

/**
 * Consistent page header for Information Hub pages.
 * Navy band (70% structure), gold-300 eyebrow (AA on navy), white headline,
 * slate-200 subtitle. One shared component keeps Events, News, Media
 * Resources, Financials, and Files visually aligned.
 */
export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-navy dark:bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        {eyebrow && (
          <p className="text-gold-300 font-semibold uppercase tracking-[0.12em] text-sm mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}