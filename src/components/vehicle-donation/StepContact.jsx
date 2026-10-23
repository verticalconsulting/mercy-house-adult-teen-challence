import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Step 1 — who is donating and how to reach them. */
export default function StepContact({ form, set, onNext, error }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="vd-first-name">First name</Label>
          <Input
            id="vd-first-name"
            autoComplete="given-name"
            className="mt-1.5"
            value={form.first_name}
            onChange={(event) => set('first_name', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-last-name">Last name</Label>
          <Input
            id="vd-last-name"
            autoComplete="family-name"
            className="mt-1.5"
            value={form.last_name}
            onChange={(event) => set('last_name', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="vd-email">Email</Label>
          <Input
            id="vd-email"
            type="email"
            autoComplete="email"
            className="mt-1.5"
            value={form.email}
            onChange={(event) => set('email', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-phone">Phone</Label>
          <Input
            id="vd-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(601) 555-0134"
            className="mt-1.5"
            value={form.phone}
            onChange={(event) => set('phone', event.target.value)}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <button type="submit" className="mh-cta-primary w-full">
        Continue
      </button>
    </form>
  );
}