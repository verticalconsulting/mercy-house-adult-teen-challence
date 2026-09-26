import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Heart, Loader2 } from 'lucide-react';

/*
 * Triggers a Stripe Checkout subscription for the $40/month student
 * sponsorship plan and redirects the donor to Stripe. Stripe is the
 * payment provider; the donation is synced to Virtuous after payment.
 */
export default function SponsorCheckoutButton({
  residentName,
  residentId,
  children,
  className,
  iconClass = 'w-5 h-5',
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSponsor = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await base44.functions.invoke('createSponsorshipCheckout', {
        residentName: residentName || '',
        residentId: residentId || '',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e) {
      console.error('Sponsorship checkout error:', e);
      setError(e?.message || 'Unable to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSponsor}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className || ''}`}
      >
        {loading ? <Loader2 className={`${iconClass} animate-spin`} /> : <Heart className={iconClass} />}
        <span>{children || 'Become a Sponsor'}</span>
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">{error}</p>
      )}
    </>
  );
}