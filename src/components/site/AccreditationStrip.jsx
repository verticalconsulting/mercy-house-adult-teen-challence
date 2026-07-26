import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Accreditation / trust chips.
 *
 * From the wireframes: approach A places this on a parchment strip between
 * dashed rules directly under the hero; approach B runs the same chips on the
 * navy band. Both variants are supported so a page can pick whichever sits
 * better against its neighbouring section.
 *
 * @param {object} props
 * @param {'parchment'|'navy'} [props.variant]
 * @param {string} [props.label] Optional lead-in text (parchment variant only).
 * @param {Array<{ label: string, href?: string, to?: string }>} [props.items]
 */
export default function AccreditationStrip({
  variant = 'parchment',
  label = 'Trusted & accredited:',
  items = [],
}) {
  if (items.length === 0) return null;

  const onNavy = variant === 'navy';

  const chipClass = onNavy
    ? 'inline-flex items-center rounded-md border-[1.5px] border-navy-light px-2.5 py-1.5 text-xs text-slate-100'
    : 'mh-chip';

  return (
    <section
      aria-label="Accreditations and trust signals"
      className={
        onNavy
          ? 'bg-navy px-4 py-3'
          : 'border-y border-dashed border-warm-gray bg-parchment-soft px-4 py-3 dark:bg-slate-900'
      }
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2.5">
        {!onNavy && label && (
          <span className="font-accent text-base text-slate-600 dark:text-slate-300">{label}</span>
        )}
        {items.map((item) => {
          const content = <span className={chipClass}>{item.label}</span>;

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
