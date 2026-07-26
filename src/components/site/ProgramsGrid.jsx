import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * "Programs for everyone we serve" — the outlined two-up card grid from
 * wireframe B, rendered as real navigable cards.
 *
 * @param {object} props
 * @param {string} [props.heading]
 * @param {Array<{ name: string, description: string, to: string, image?: string }>} props.programs
 */
export default function ProgramsGrid({
  heading = 'Programs for everyone we serve',
  programs = [],
}) {
  if (programs.length === 0) return null;

  return (
    <section className="bg-white py-section-sm dark:bg-slate-800 md:py-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-accent text-4xl font-bold text-navy dark:text-gold">
          {heading}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {programs.map((program) => (
            <Link
              key={program.name}
              to={program.to}
              className="mh-card-outline group flex flex-col overflow-hidden transition-shadow hover:shadow-lg dark:border-slate-600"
            >
              {program.image && (
                <img
                  src={program.image}
                  alt=""
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-navy dark:text-gold">{program.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {program.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy dark:text-gold">
                  Learn more
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
