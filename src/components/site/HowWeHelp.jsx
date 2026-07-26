import React from 'react';

/**
 * The three-step "how we help" row — numbered navy discs, a short label, and
 * one line of supporting copy.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {Array<{ title: string, description: string }>} props.steps
 */
export default function HowWeHelp({
  eyebrow = 'Getting Started',
  heading = 'How we help',
  steps = [],
}) {
  if (steps.length === 0) return null;

  return (
    <section className="bg-card py-section-sm md:py-section dark:bg-slate-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {eyebrow && <p className="mh-eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 mh-h2">{heading}</h2>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center gap-4 text-center">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-xl font-bold text-white"
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-bold text-navy dark:text-gold">{step.title}</h3>
              <p className="max-w-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
