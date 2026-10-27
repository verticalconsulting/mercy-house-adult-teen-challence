import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BusinessCard({ business }) {
  const darkTile = business.tile === 'navy';

  return (
    <article className="mh-card mh-card-interactive flex flex-col overflow-hidden">
      <div
        className={`flex h-40 items-center justify-center border-b border-border p-6 ${
          darkTile ? 'bg-navy' : 'bg-white dark:bg-slate-800'
        }`}
      >
        {business.logo ? (
          <img
            src={business.logo}
            alt={`${business.title} logo`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="text-center">
            <p
              className={`text-2xl font-bold leading-tight tracking-tight ${
                darkTile ? 'text-white' : 'text-navy dark:text-white'
              }`}
            >
              {business.title}
            </p>
            <span className="mt-3 block h-px w-10 bg-gold mx-auto" aria-hidden="true" />
            <p
              className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                darkTile ? 'text-gold' : 'text-gold-accessible'
              }`}
            >
              {business.tagline}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-navy dark:text-gold">{business.title}</h3>
        <p className="mb-6 flex-1 text-slate-700 dark:text-slate-300">{business.description}</p>
        <a
          href={business.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mh-cta-navy self-start"
        >
          Visit Website
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}