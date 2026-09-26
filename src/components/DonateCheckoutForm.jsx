import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Heart, Loader2, AlertCircle, Lock } from 'lucide-react';

const PRESETS = [25, 50, 100, 250];

/*
 * Stripe Checkout donation form — one-time or monthly. Mirrors the
 * Sponsor a Student flow: Stripe handles payment, the webhook syncs each
 * gift to Virtuous CRM. Checkout is blocked inside an iframe preview.
 */
export default function DonateCheckoutForm({ campaignId }) {
  const [frequency, setFrequency] = useState('one_time');
  const [preset, setPreset] = useState(50);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  const customAmount = custom ? parseFloat(custom) : 0;
  const dollars = customAmount > 0 ? customAmount : preset;
  const cents = Math.round(dollars * 100);

  const handleDonate = async () => {
    setError(null);
    if (inIframe) {
      setError('For secure checkout, please open this page from the published app in a new tab.');
      return;
    }
    if (!cents || cents < 500) {
      setError('Please enter an amount of at least $5.');
      return;
    }
    setLoading(true);
    try {
      const fn = frequency === 'monthly' ? 'createRecurringDonation' : 'createDonationCheckout';
      const res = await base44.functions.invoke(fn, { amount: cents, campaignId: campaignId || '' });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e) {
      console.error('Donation checkout error:', e);
      setError(e?.message || 'Unable to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mh-card p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-navy dark:text-gold text-center mb-1">Make Your Gift</h2>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
        Give once or set up monthly support — the choice is yours.
      </p>

      {/* Frequency toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6" role="group" aria-label="Gift frequency">
        {[
          { value: 'one_time', label: 'One-time' },
          { value: 'monthly', label: 'Monthly' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFrequency(opt.value)}
            aria-pressed={frequency === opt.value}
            className={`py-2.5 rounded-md text-sm font-semibold transition-colors ${
              frequency === opt.value
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Amount presets */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {PRESETS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => { setPreset(amt); setCustom(''); }}
            aria-pressed={!custom && preset === amt}
            className={`py-3 rounded-md text-sm font-bold border transition-colors ${
              !custom && preset === amt
                ? 'bg-navy text-white border-navy'
                : 'bg-white dark:bg-slate-800 text-navy dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-navy'
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
        <input
          type="number"
          min="5"
          step="1"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Other amount"
          aria-label="Custom donation amount"
          className="w-full pl-8 pr-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Donate button */}
      <button
        type="button"
        onClick={handleDonate}
        disabled={loading}
        className="mh-cta-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
        <span>
          Donate{dollars > 0 ? ` $${dollars}` : ''}{frequency === 'monthly' ? '/mo' : ''}
        </span>
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}

      {/* Trust signals */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 text-center">
        <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> Secure checkout via Stripe</span>
        <span>·</span>
        <span>Tax-deductible · EIN 45-4670832</span>
        <span>·</span>
        <span>Cancel recurring gifts anytime</span>
      </div>
    </div>
  );
}