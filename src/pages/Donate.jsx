import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, DollarSign, Loader2, RefreshCw, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignProgress from '../components/CampaignProgress';

export default function Donate() {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [donationType, setDonationType] = useState('one-time');
  const [campaignId, setCampaignId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignParam = urlParams.get('campaign');
    if (campaignParam) {
      setCampaignId(campaignParam);
    }
    if (urlParams.get('donation') === 'success' || urlParams.get('subscription') === 'success') {
      toast.success('Thank you for your generous donation! 🙏');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('donation') === 'cancelled' || urlParams.get('subscription') === 'cancelled') {
      toast.info('Donation cancelled');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const [intakeDonorEmail, setIntakeDonorEmail] = useState('');
  const [intakeDonorLoading, setIntakeDonorLoading] = useState(false);

  const presetAmounts = [25, 50, 100, 250, 500];
  const impactLabels = {
    25: 'Feed a resident for 3 days',
    50: 'Feed a resident for a week',
    100: 'Cover educational supplies',
    250: 'Support one resident for a month',
    500: 'Fund 2 months of transformation'
  };

  const handleDonorIntakeFee = async () => {
    if (!intakeDonorEmail) {
      toast.error('Please enter your email');
      return;
    }
    if (window.self !== window.top) {
      toast.error('Please use the published app to make donations');
      return;
    }
    setIntakeDonorLoading(true);
    try {
      const { data } = await base44.functions.invoke('createIntakeFeeCheckout', {
        paymentType: 'donor_pays',
        email: intakeDonorEmail,
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to start checkout');
        setIntakeDonorLoading(false);
      }
    } catch (err) {
      toast.error('Error starting checkout. Please try again.');
      setIntakeDonorLoading(false);
    }
  };

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!amount || amount < 5) {
      toast.error('Minimum donation is $5');
      return;
    }

    if (window.self !== window.top) {
      toast.error('Please use the published app to make donations');
      return;
    }

    setLoading(true);
    try {
      if (donationType === 'recurring') {
        const response = await base44.functions.invoke('createRecurringDonation', {
          amount: Math.round(amount * 100),
          email: email || undefined,
          campaignId: campaignId || undefined
        });
        
        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          toast.error('Failed to create checkout session');
          setLoading(false);
        }
      } else {
        const response = await base44.functions.invoke('createDonationCheckout', {
          amount: Math.round(amount * 100),
          email: email || undefined,
          campaignId: campaignId || undefined
        });
        
        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          toast.error('Failed to create checkout session');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to process donation');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero — Framing + Loss Aversion */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">Your Gift Changes Lives</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Every day without help is another day someone struggles alone. <strong>110% of individual donations</strong> go directly to our mission — your dollar works harder here than anywhere else.
          </p>
          {/* Social proof nudge */}
          <p className="mt-4 text-sm text-gold font-semibold">❤️ Join 1,000+ supporters who've already made a difference</p>
        </div>

        {/* Active Campaigns */}
        {!campaignId && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-navy dark:text-gold mb-6 text-center">Active Campaigns</h2>
            <CampaignProgress />
          </div>
        )}

        {/* Donation Form */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-navy dark:text-gold text-center" id="donation-form-title">Choose Your Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Donation Type Tabs */}
            <Tabs value={donationType} onValueChange={setDonationType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-time">One-Time Gift</TabsTrigger>
                <TabsTrigger value="recurring">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Monthly Support
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Preset Amounts — Goal-Gradient + Impact Framing */}
            <fieldset>
              <legend className="sr-only">Select a donation amount</legend>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {presetAmounts.map(amount => {
                  const isSelected = selectedAmount === amount && !customAmount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                      aria-pressed={isSelected}
                      aria-label={`$${amount} — ${impactLabels[amount]}`}
                      className={`p-4 md:p-5 rounded-lg border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                        isSelected
                          ? 'border-gold bg-gold/10 dark:bg-gold/20 ring-2 ring-gold'
                          : 'border-slate-200 dark:border-slate-700 hover:border-gold'
                      }`}
                    >
                      <div className="text-2xl md:text-3xl font-bold text-navy dark:text-gold">${amount}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight hidden md:block">{impactLabels[amount]}</div>
                    </button>
                  );
                })}
              </div>
              {/* Show selected impact on mobile */}
              {selectedAmount && !customAmount && (
                <p className="mt-2 text-sm text-center text-gold font-medium md:hidden" aria-live="polite">
                  Your ${selectedAmount} will: {impactLabels[selectedAmount]}
                </p>
              )}
            </fieldset>

            {/* Custom Amount */}
            <div>
              <label htmlFor="custom-amount" className="block text-base md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                <Input
                  id="custom-amount"
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Enter amount (min $5)"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                  className="pl-10 text-lg md:text-base"
                  aria-describedby="custom-amount-hint"
                />
              </div>
              <p id="custom-amount-hint" className="text-xs text-slate-500 mt-1">Minimum donation is $5</p>
            </div>

            {/* Email (optional) */}
            <div>
              <label htmlFor="donor-email" className="block text-base md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email <span className="font-normal text-slate-500">(optional — for tax receipt)</span>
              </label>
              <Input
                id="donor-email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg md:text-base"
              />
            </div>

            {/* Donate Button — Loss Aversion + Regret Aversion */}
            <Button
              onClick={handleDonate}
              disabled={loading || (!customAmount && !selectedAmount)}
              className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy py-6 md:py-4 text-lg md:text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-busy={loading}
              aria-live="polite"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" /><span>Processing…</span></>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" aria-hidden="true" />
                  {donationType === 'recurring'
                    ? `Give $${customAmount || selectedAmount}/month — Transform a Life`
                    : `Donate $${customAmount || selectedAmount} — Make an Impact Today`}
                </>
              )}
            </Button>
            {/* Regret aversion + trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 text-center">
              <span>🔒 Secure checkout via Stripe</span>
              <span>·</span>
              <span>110% goes to mission</span>
              {donationType === 'recurring' && <><span>·</span><span>Cancel anytime, no questions asked</span></>}
            </div>
          </CardContent>
        </Card>

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
            <div className="text-4xl md:text-5xl font-bold text-gold mb-2">$250</div>
            <p className="text-base md:text-sm text-slate-600 dark:text-slate-300">Supports one resident for a full month</p>
          </div>
        </div>
      </div>
    </div>
  );
}