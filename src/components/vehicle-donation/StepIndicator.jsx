import React from 'react';
import { Check } from 'lucide-react';

/** Two-step progress for the vehicle donation form. */
export default function StepIndicator({ current, labels }) {
  return (
    <ol className="mb-8 flex items-center gap-3" aria-label="Donation form progress">
      {labels.map((label, index) => {
        const step = index + 1;
        const isDone = current > step;
        const isActive = current === step;

        return (
          <li key={label} className="flex flex-1 items-center gap-3">
            <span
              aria-current={isActive ? 'step' : undefined}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                isActive
                  ? 'border-navy bg-navy text-white'
                  : isDone
                    ? 'border-navy bg-card text-navy'
                    : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : step}
              <span className="sr-only">
                {isDone ? `${label} — completed` : isActive ? `${label} — current step` : label}
              </span>
            </span>
            <span className={`text-sm font-semibold ${isActive ? 'text-navy dark:text-gold' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {step < labels.length && <span className="h-px flex-1 bg-border" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}