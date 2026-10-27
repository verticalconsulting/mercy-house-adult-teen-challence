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
import VehicleFields from './VehicleFields';
import { DONATION_TYPES, TITLE_OPTIONS, isPropertyType } from '@/lib/vehicleDonationOptions';

/** Step 1 — who is donating, what is being donated, and where it is. */
export default function StepDonationDetails({ form, set, onNext, error }) {
  const isProperty = isPropertyType(form.donation_type);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      className="space-y-6"
      noValidate
    >
      <fieldset className="space-y-5 rounded-xl border border-border p-5">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible">
          About you
        </legend>
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
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-border p-5">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible">
          What are you donating?
        </legend>
        <div>
          <Label htmlFor="vd-type">Donation type</Label>
          <Select value={form.donation_type} onValueChange={(value) => set('donation_type', value)}>
            <SelectTrigger id="vd-type" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DONATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isProperty ? (
          <div>
            <Label htmlFor="vd-property">Tell us about the property</Label>
            <Textarea
              id="vd-property"
              rows={4}
              className="mt-1.5"
              placeholder="Address, acreage or square footage, and the condition it is in."
              value={form.property_description}
              onChange={(event) => set('property_description', event.target.value)}
            />
          </div>
        ) : (
          <VehicleFields form={form} set={set} donationType={form.donation_type} />
        )}

        <div>
          <Label htmlFor="vd-title">Do you have the title?</Label>
          <Select value={form.title_status} onValueChange={(value) => set('title_status', value)}>
            <SelectTrigger id="vd-title" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TITLE_OPTIONS.map((title) => (
                <SelectItem key={title.value} value={title.value}>
                  {title.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-border p-5">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible">
          {isProperty ? 'Where is the property?' : 'Where is the vehicle?'}
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
      </fieldset>

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