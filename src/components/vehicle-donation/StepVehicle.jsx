import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'suv', label: 'SUV or van' },
  { value: 'truck', label: 'Truck' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'rv', label: 'RV or camper' },
  { value: 'boat', label: 'Boat' },
  { value: 'other', label: 'Something else' },
];

const CONDITIONS = [
  { value: 'running', label: 'Running' },
  { value: 'not_running', label: 'Not running' },
  { value: 'needs_repairs', label: 'Needs repairs' },
];

const TITLES = [
  { value: 'have_title', label: 'I have the title' },
  { value: 'no_title', label: 'I do not have the title' },
  { value: 'in_process', label: 'Title is in process' },
];

/** Step 2 — the vehicle itself, where it is, and anything else we should know. */
export default function StepVehicle({ form, set, onBack, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="vd-type">Vehicle type</Label>
        <Select value={form.donation_type} onValueChange={(value) => set('donation_type', value)}>
          <SelectTrigger id="vd-type" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VEHICLE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="vd-year">Year</Label>
          <Input
            id="vd-year"
            type="number"
            inputMode="numeric"
            min="1900"
            max="2100"
            placeholder="2015"
            className="mt-1.5"
            value={form.vehicle_year}
            onChange={(event) => set('vehicle_year', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-make">Make</Label>
          <Input
            id="vd-make"
            placeholder="Toyota"
            className="mt-1.5"
            value={form.vehicle_make}
            onChange={(event) => set('vehicle_make', event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="vd-model">Model</Label>
          <Input
            id="vd-model"
            placeholder="Camry"
            className="mt-1.5"
            value={form.vehicle_model}
            onChange={(event) => set('vehicle_model', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="vd-condition">Condition</Label>
          <Select value={form.condition} onValueChange={(value) => set('condition', value)}>
            <SelectTrigger id="vd-condition" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="vd-mileage">Mileage (optional)</Label>
          <Input
            id="vd-mileage"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="85000"
            className="mt-1.5"
            value={form.mileage}
            onChange={(event) => set('mileage', event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="vd-title">Title</Label>
        <Select value={form.title_status} onValueChange={(value) => set('title_status', value)}>
          <SelectTrigger id="vd-title" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TITLES.map((title) => (
              <SelectItem key={title.value} value={title.value}>
                {title.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-5 rounded-xl border border-border p-5">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible">
          Where is the vehicle?
        </legend>
        <div>
          <Label htmlFor="vd-address">Street address</Label>
          <Input
            id="vd-address"
            autoComplete="street-address"
            className="mt-1.5"
            value={form.address}
            onChange={(event) => set('address', event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="vd-city">City</Label>
            <Input
              id="vd-city"
              autoComplete="address-level2"
              className="mt-1.5"
              value={form.city}
              onChange={(event) => set('city', event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="vd-state">State</Label>
            <Input
              id="vd-state"
              autoComplete="address-level1"
              className="mt-1.5"
              value={form.state}
              onChange={(event) => set('state', event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="vd-zip">ZIP code</Label>
            <Input
              id="vd-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              className="mt-1.5"
              value={form.zip}
              onChange={(event) => set('zip', event.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="vd-pickup-date">Preferred pickup date (optional)</Label>
          <Input
            id="vd-pickup-date"
            type="date"
            className="mt-1.5"
            value={form.pickup_date}
            onChange={(event) => set('pickup_date', event.target.value)}
          />
        </div>
      </fieldset>

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

      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-navy px-6 py-[13px] font-bold text-navy transition-colors hover:bg-navy hover:text-white"
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