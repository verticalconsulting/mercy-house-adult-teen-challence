import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Program cards — image-topped, white surface, hairline border, lifting on
 * hover, each closing with a full-width navy action.
 *
 * The action is navy rather than gold on purpose: there are several cards in
 * view at once, and gold is reserved for the single primary action on a page.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {Array<{ name: string, description: string, to: string, image?: string,
 *   imageAlt?: string, badge?: string }>} props.programs
 */
export default function ProgramsGrid({
  eyebrow = 'Programs',
  heading = 'Our Programs',
  programs = [],
}) {
  if (programs.length === 0) return null;

  return (
    <section className="bg-background py-section-sm md:py-section dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {eyebrow && <p className="mh-eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 mh-h2">{heading}</h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {programs.map((program) => (
            <Link
              key={program.name}
              to={program.to}
              className="mh-card mh-card-interactive group flex flex-col overflow-hidden"
            >
              {/* Cards without photography close up rather than reserving an
                  empty plate — a blank grey block reads as a failed image. */}
              {program.image && (
                <div className="relative h-64 shrink-0 bg-warm-gray">
                  <img
                    src={program.image}
                    alt={program.imageAlt || ''}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {program.badge && (
                    <span className="absolute left-4 top-4 rounded-md bg-gold px-3 py-1.5 text-xs font-bold text-navy-950">
                      {program.badge}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-2xl font-bold text-navy dark:text-gold">{program.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-slate-600 dark:text-slate-300">
                  {program.description}
                </p>
                <span className="mh-cta-navy mt-6 w-full">
                  Learn More
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
