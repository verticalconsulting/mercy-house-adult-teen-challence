import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import CampaignProgress from '../components/CampaignProgress';
import NonprofitLegitimacy from '../components/NonprofitLegitimacy';
import VirtuousGiveForm from '../components/VirtuousGiveForm';

// Mercy House — Virtuous giving form (one-time + recurring, Stripe + Virtuous CRM).
const MERCYHOUSE_VIRTUOUS_FORM_ID = '7033B8F5-8F23-42AC-8934-BFAC670B91CA';
// Dedicated Virtuous form for the $1,000 intake-fee sponsorship gift.
const MERCYHOUSE_INTAKE_FEE_FORM_ID = 'AE0BD86D-8C6F-43F0-87BB-E9E85FB8FCA6';

export default function Donate() {
  const [campaignId, setCampaignId] = React.useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignParam = urlParams.get('campaign');
    if (campaignParam) {
      setCampaignId(campaignParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero — Framing + Loss Aversion */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">Your Gift Changes Lives</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Every day without help is another day someone struggles alone. Your gift goes directly to supporting residents through housing, meals, program care, and daily ministry operations.
          </p>
          {/* Social proof nudge */}
          <p className="mt-4 text-sm text-gold font-semibold">❤️ Join 1,000+ supporters who've already made a difference</p>
        </div>

        {/* Active Campaigns */}
        {!campaignId && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-navy dark:text-gold mb-6 text-center">Active Campaigns</h2>
            <CampaignProgress ctaPath="/WomensCampus#give-womens-center" />
          </div>
        )}

        {/* Secure Giving Form — Virtuous + Stripe */}
        <div className="mb-8">
          <VirtuousGiveForm
            formId={MERCYHOUSE_VIRTUOUS_FORM_ID}
            title="Make Your Gift"
            subtitle="Give once or set up monthly support — the choice is yours inside the secure form below."
            className="mb-6"
          />
          {/* Trust signals under the form */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 text-center">
            <span>🔒 Secure checkout via Stripe</span>
            <span>·</span>
            <span>Tax-deductible · EIN 27-4670832</span>
            <span>·</span>
            <span>Cancel recurring gifts anytime</span>
          </div>
        </div>

        {/* Give Someone a Fresh Start — Intake Fee Sponsorship */}
        <div className="mb-12 rounded-2xl border-2 border-gold/40 bg-gold/5 dark:bg-gold/10 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Heart className="w-7 h-7 text-gold mt-1 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-navy dark:text-gold text-xl font-bold">Give Someone a Fresh Start</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Cover the <strong>$1,000 intake fee</strong> for the next person entering Mercy House. Your gift removes the last barrier standing between someone and a new beginning.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            💡 <strong>How it works:</strong> Your $1,000 donation is held in a dedicated fund. When the next applicant is accepted, their intake fee is covered by your gift — and they're notified someone believed in them before they even arrived.
          </p>
          <VirtuousGiveForm
            formId={MERCYHOUSE_INTAKE_FEE_FORM_ID}
            subtitle="Sponsor an intake fee — enter $1,000 in the secure form below."
          />
        </div>

        {/* How Funds Are Used */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-2 text-center">How Your Donation Is Used</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
            Mercy House is a 501(c)(3) nonprofit. Every gift helps sustain our residential ministry programs.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🏠', label: 'Housing & Facilities', desc: 'Safe, stable residential housing for men and women in the program' },
              { emoji: '🍽️', label: 'Meals & Nutrition', desc: 'Three daily meals provided to every resident throughout their stay' },
              { emoji: '📖', label: 'Program & Ministry', desc: 'Biblical teaching, counseling, life skills classes, and vocational training' },
              { emoji: '⚙️', label: 'Daily Operations', desc: 'Utilities, staff, transportation, and the infrastructure that keeps our doors open' },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-navy dark:text-gold text-sm mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            EIN and financial documentation available upon request —{' '}
            <a href="mailto:info@mercyhouseatc.com" className="underline hover:text-navy dark:hover:text-gold">info@mercyhouseatc.com</a>
          </p>
        </div>

        {/* Nonprofit Legitimacy */}
        <div className="mb-12">
          <NonprofitLegitimacy />
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold mb-2">$50</div>
            <p className="text-base md:text-sm text-slate-600 dark:text-slate-300">Provides meals for one resident for a week</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold mb-2">$100</div>
            <p className="text-base md:text-sm text-slate-600 dark:text-slate-300">Covers educational materials and supplies</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold mb-2">$1,000</div>
            <p className="text-base md:text-sm text-slate-600 dark:text-slate-300">Covers a new resident's full intake fee</p>
          </div>
        </div>
      </div>
    </div>
  );
}