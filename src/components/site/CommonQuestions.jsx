import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * "Common questions" — a collapsible list.
 *
 * Answering the obvious objections on the landing page itself is what keeps the
 * page content-rich enough for the Google Ad Grant quality review.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {Array<{ question: string, answer: React.ReactNode }>} props.items
 */
export default function CommonQuestions({
  eyebrow = 'Questions',
  heading = 'Common questions',
  items = [],
}) {
  if (items.length === 0) return null;

  return (
    <section className="bg-card py-section-sm md:py-section dark:bg-slate-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {eyebrow && <p className="mh-eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 mh-h2">{heading}</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`q-${index}`}
              className="rounded-xl border border-border px-5 dark:border-slate-600"
            >
              <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline dark:text-slate-100">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-slate-600 dark:text-slate-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
