import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * "Common questions" — the collapsible list from wireframe C.
 *
 * Answering the obvious objections on the landing page itself is also what
 * keeps the page content-rich enough for the Google Ad Grant quality review,
 * which is the constraint the wireframes were drawn against.
 *
 * @param {object} props
 * @param {string} [props.heading]
 * @param {Array<{ question: string, answer: React.ReactNode }>} props.items
 */
export default function CommonQuestions({ heading = 'Common questions', items = [] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-section-sm dark:bg-slate-800 md:py-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-accent text-4xl font-bold text-navy dark:text-gold">
          {heading}
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`q-${index}`}
              className="rounded-[10px] border-[1.5px] border-warm-gray px-4 dark:border-slate-600"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-slate-800 hover:no-underline dark:text-slate-100">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
