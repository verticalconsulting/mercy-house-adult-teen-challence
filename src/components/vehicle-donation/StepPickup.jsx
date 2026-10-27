import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPickupDate, getMinPickupDate } from '@/lib/pickupDates';

/** Step 2 — when and where to collect, and permission to text about it. */
export default function StepPickup({ form, set, onBack, onSubmit, loading, error }) {
  const minDate = getMinPickupDate();

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <Label htmlFor="vd-pickup-date">Preferred pickup date (optional)</Label>
        <Input
          id="vd-pickup-date"
          type="date"
          min={minDate}
          className="mt-1.5"
          value={form.pickup_date}
          onChange={(event) => set('pickup_date', event.target.value)}
        />
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pickups start one week out, {formatPickupDate(minDate)} or later.
        </p>
      </div>

      <div>
        <Label htmlFor="vd-pickup-address">Pickup address, if it differs (optional)</Label>
        <Input
          id="vd-pickup-address"
          autoComplete="street-address"
          className="mt-1.5"
          placeholder={form.address || 'Street address where we will pick it up'}
          value={form.pickup_address}
          onChange={(event) => set('pickup_address', event.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="vd-notes">Anything else we should know? (optional)</Label>
        <Textarea
          id="vd-notes"
          rows={4}
          className="mt-1.5"
          placeholder="Where the keys are kept, gate codes, a flat tire, and so on."
          value={form.notes}
          onChange={(event) => set('notes', event.target.value)}
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border p-4">
        <Checkbox
          id="vd-sms"
          className="mt-1"
          checked={form.sms_consent}
          onCheckedChange={(checked) => set('sms_consent', Boolean(checked))}
        />
        <div>
          <Label htmlFor="vd-sms" className="text-base font-semibold">
            Text me pickup updates
          </Label>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            We will text this number to schedule your pickup. Message and data rates may apply.
            Reply STOP to opt out.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-navy px-6 py-[13px] font-bold text-navy transition-colors hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy"
        >
          Back
        </button>
        <button type="submit" disabled={loading} className="mh-cta-primary flex-1 disabled:opacity-60">
          {loading ? 'Sending…' : 'Request Free Pickup'}
        </button>
      </div>
    </form>
  );
}