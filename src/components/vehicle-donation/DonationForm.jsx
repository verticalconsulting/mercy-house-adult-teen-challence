import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle } from 'lucide-react';
import { trackEvent, trackFormSubmit } from '@/lib/analytics';
import { submitVehicleDonation } from '@/lib/formspree';
import { formatPickupDate, getMinPickupDate, isPickupDateAllowed } from '@/lib/pickupDates';
import { getUtmParams } from '@/lib/utmTracking';
import { isPropertyType } from '@/lib/vehicleDonationOptions';
import StepIndicator from './StepIndicator';
import StepDonationDetails from './StepDonationDetails';
import StepPickup from './StepPickup';

const STEP_LABELS = ['Your Donation', 'Pickup'];
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
  vehicle_trim: '',
  body_style: '',
  engine: '',
  fuel_type: '',
  drive_type: '',
  vin: '',
  vin_decoded: 'false',
  mileage: '',
  vehicle_condition: 'running',
  title_status: 'have_title',
  property_description: '',
  address: '',
  city: '',
  state: 'MS',
  zip: '',
  pickup_date: '',
  pickup_address: '',
  notes: '',
  sms_consent: false,
};

const numberOrNull = (value) => (value === '' || value === null ? null : Number(value));
const textOrNull = (value) => (value && value.trim() ? value.trim() : null);

/**
 * Two-step donation request.
 *
 * The request is written to the VehicleDonation entity (the ministry's record
 * of donors and pickups) and mirrored to Formspree for the team inbox, tagged
 * with the ad click that produced it. The entity write is the one that must
 * succeed; email delivery is best-effort and never blocks the donor.
 */
export default function DonationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Every step, and the thank-you screen, opens at the top of the form rather
  // than wherever the previous step left the page scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, submitted]);

  const goToPickup = () => {
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
    if (isPropertyType(form.donation_type)) {
      if (!form.property_description.trim()) {
        setError('Please tell us a little about the property.');
        return;
      }
    } else if (!form.vehicle_make.trim() || !form.vehicle_model.trim()) {
      setError('Please add the make and model, or enter the VIN and let us fill them in.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPickupDateAllowed(form.pickup_date)) {
      setError(
        `Pickup dates start one week out. Please choose ${formatPickupDate(getMinPickupDate())} or later.`
      );
      return;
    }

    setLoading(true);
    setError('');

    const property = isPropertyType(form.donation_type);
    const attribution = getUtmParams();

    const donation = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      donation_type: form.donation_type,
      vehicle_year: property ? null : numberOrNull(form.vehicle_year),
      vehicle_make: property ? null : textOrNull(form.vehicle_make),
      vehicle_model: property ? null : textOrNull(form.vehicle_model),
      vehicle_trim: property ? null : textOrNull(form.vehicle_trim),
      body_style: property ? null : textOrNull(form.body_style),
      engine: property ? null : textOrNull(form.engine),
      fuel_type: property ? null : textOrNull(form.fuel_type),
      drive_type: property ? null : textOrNull(form.drive_type),
      vin: property ? null : textOrNull(form.vin),
      vin_decoded: !property && Boolean(form.vin_decoded === 'true'),
      mileage: property ? null : numberOrNull(form.mileage),
      vehicle_condition: property ? null : form.vehicle_condition,
      title_status: form.title_status,
      property_description: property ? textOrNull(form.property_description) : null,
      address: textOrNull(form.address),
      city: textOrNull(form.city),
      state: textOrNull(form.state),
      zip: textOrNull(form.zip),
      pickup_date: form.pickup_date || null,
      pickup_address: textOrNull(form.pickup_address),
      additional_notes: textOrNull(form.notes),
      sms_consent: form.sms_consent,
      gclid: attribution.gclid || null,
      fbclid: attribution.fbclid || null,
      utm_source: attribution.utm_source || null,
      utm_medium: attribution.utm_medium || null,
      utm_campaign: attribution.utm_campaign || null,
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
        vin_decoded: donation.vin_decoded ? 'true' : 'false',
        sms_consent: donation.sms_consent ? 'yes' : 'no',
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
          We received your donation request. A team member will contact you within one business day
          to confirm the details and schedule your free pickup.
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
        <StepDonationDetails form={form} set={set} onNext={goToPickup} error={error} />
      ) : (
        <StepPickup
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