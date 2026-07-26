import React from 'react';

/**
 * The "How we help" three-step row from wireframe A: outlined numeral circles
 * with a short label and one line of supporting copy.
 *
 * @param {object} props
 * @param {string} [props.heading]
 * @param {Array<{ title: string, description: string }>} props.steps
 */
export default function HowWeHelp({ heading = 'How we help', steps = [] }) {
  if (steps.length === 0) return null;

  return (
    <section className="bg-white py-section-sm dark:bg-slate-800 md:py-section">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-accent text-4xl font-bold text-navy dark:text-gold">
          {heading}
        </h2>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center gap-3 text-center">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink/80 font-accent text-2xl font-bold text-navy dark:border-slate-500 dark:text-gold"
              >
                {index + 1}
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
