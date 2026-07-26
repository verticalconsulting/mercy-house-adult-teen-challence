import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

/**
 * Accreditation / trust chips — the strip that sits directly under the hero.
 *
 * White pills on a navy-50 band, each led by a gold check. The Ad Grant
 * standard asks for at least two trust signals on any page that solicits, and
 * this is how the design satisfies it above the fold.
 *
 * @param {object} props
 * @param {string} [props.label] Uppercase lead-in.
 * @param {Array<{ label: string, href?: string, to?: string }>} [props.items]
 */
export default function AccreditationStrip({ label = 'Trusted & Accredited', items = [] }) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Accreditations and trust signals"
      className="border-b border-border bg-navy-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {label && (
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-navy dark:text-gold">
            {label}
          </span>
        )}
        {items.map((item) => {
          const content = (
            <span className="mh-chip">
              <Check className="h-3.5 w-3.5 shrink-0 text-gold-accessible" aria-hidden="true" />
              {item.label}
            </span>
          );

          if (item.to) {
            return (
              <Link key={item.label} to={item.to} className="hover:opacity-80">
                {content}
              </Link>
            );
          }
          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                {content}
              </a>
            );
          }
          return <React.Fragment key={item.label}>{content}</React.Fragment>;
        })}
      </div>
    </section>
  );
}
