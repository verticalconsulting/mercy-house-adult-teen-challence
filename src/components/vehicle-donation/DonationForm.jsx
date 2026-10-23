import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle } from 'lucide-react';
import { trackEvent, trackFormSubmit } from '@/lib/analytics';
import { submitVehicleDonation } from '@/lib/formspree';
import StepIndicator from './StepIndicator';
import StepContact from './StepContact';
import StepVehicle from './StepVehicle';

const STEP_LABELS = ['Your Info', 'Your Vehicle'];
const PHONE_DISPLAY = '(601) 572-7296';
const PHONE_HREF = 'tel:6015727296';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  donation_type: 'car',
  vehicle_year: '',
  vehicle_make: '',
  vehicle_model: '',
  condition: 'running',
  mileage: '',
  title_status: 'have_title',
  address: '',
  city: '',
  state: 'MS',
  zip: '',
  pickup_date: '',
  notes: '',
};

/**
 * Two-step vehicle donation request.
 *
 * The request is written to the VehicleDonation entity (the ministry's record
 * of donors and pickups) and mirrored to Formspree for the team inbox. The
 * entity write is the one that must succeed; email delivery is best-effort and
 * never blocks the donor's confirmation.
 */
export default function DonationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const goToVehicle = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('Please add your first and last name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please add an email address we can send your receipt to.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please add a phone number so we can schedule the pickup.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.vehicle_make.trim() || !form.vehicle_model.trim()) {
      setError('Please add your vehicle make and model.');
      return;
    }

    setLoading(true);
    setError('');

    const notes = [
      form.pickup_date ? `Preferred pickup: ${form.pickup_date}` : '',
      form.notes.trim(),
    ]
      .filter(Boolean)
      .join(' | ');

    const donation = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      donation_type: form.donation_type,
      vehicle_year: form.vehicle_year ? Number(form.vehicle_year) : null,
      vehicle_make: form.vehicle_make.trim(),
      vehicle_model: form.vehicle_model.trim(),
      vehicle_condition: form.condition,
      mileage: form.mileage ? Number(form.mileage) : null,
      title_status: form.title_status,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      zip: form.zip.trim() || null,
      additional_notes: notes || null,
    };

    try {
      await base44.entities.VehicleDonation.create(donation);
    } catch (err) {
      console.error('VehicleDonation.create failed', err);
      setError(`We couldn't send your request. Please try again, or call us at ${PHONE_DISPLAY}.`);
      setLoading(false);
      return;
    }

    try {
      await submitVehicleDonation({
        ...donation,
        pickup_date: form.pickup_date || '',
        notes: form.notes.trim(),
        submitted_from: window.location.href,
      });
    } catch (err) {
      console.error('Vehicle donation email delivery failed', err);
    }

    trackFormSubmit('vehicle_donation', { donation_type: form.donation_type });
    trackEvent('vehicle_donation_requested', { source: 'vehicle-donation-program' });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="py-6 text-center" role="status">
        <CheckCircle className="mx-auto h-14 w-14 text-navy dark:text-gold" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold text-navy dark:text-gold">Thank You!</h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          We received your vehicle donation request. A team member will call you within one
          business day to confirm the details and schedule your free pickup.
        </p>
        <p className="mt-6 text-base text-muted-foreground">
          Need us sooner?{' '}
          <a href={PHONE_HREF} className="font-semibold text-gold-accessible underline">
            Call {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} labels={STEP_LABELS} />
      {step === 1 ? (
        <StepContact form={form} set={set} onNext={goToVehicle} error={error} />
      ) : (
        <StepVehicle
          form={form}
          set={set}
          onBack={() => {
            setError('');
            setStep(1);
          }}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}