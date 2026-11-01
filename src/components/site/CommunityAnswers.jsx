import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function CommunityAnswers() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.UnansweredQuestion.filter({ status: 'published' }, { sort: '-created_date', limit: 50 })
      .then((page) => {
        if (!active) return;
        const list = Array.isArray(page) ? page : (page.items || []);
        setItems(list);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!items) {
    return (
      <div className="py-10 text-center text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      </div>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="mh-eyebrow">More Answers</p>
          <h2 className="mt-2 mh-h2">Questions Our Team Has Researched</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            When a visitor asks something our assistant cannot answer, our team researches it and publishes the answer here.
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={`community-${index}`}
              className="rounded-xl border border-border bg-white dark:bg-slate-800 px-5 dark:border-slate-600">
              <AccordionTrigger className="text-left font-semibold text-navy hover:no-underline dark:text-slate-100">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-slate-600 dark:text-slate-300">
                {item.final_answer || item.proposed_answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}