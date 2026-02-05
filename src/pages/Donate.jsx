import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, DollarSign, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Donate() {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('donation') === 'success') {
      toast.success('Thank you for your generous donation! 🙏');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('donation') === 'cancelled') {
      toast.info('Donation cancelled');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const presetAmounts = [25, 50, 100, 250, 500];

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
      const response = await base44.functions.invoke('createDonationCheckout', {
        amount: Math.round(amount * 100),
        email: email || undefined
      });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create checkout session');
        setLoading(false);
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
        {/* Hero */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">Make a Donation</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your generous gift helps us provide life-changing programs and support to those in need. 110% of individual donations go directly to our mission.
          </p>
        </div>

        {/* Donation Form */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-navy dark:text-gold text-center">Choose Your Donation Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 md:p-6 rounded-lg border-2 transition-all ${
                    selectedAmount === amount && !customAmount
                      ? 'border-gold bg-gold/10 dark:bg-gold/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-gold'
                  }`}
                >
                  <div className="text-2xl md:text-3xl font-bold text-navy dark:text-gold">
                    ${amount}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-base md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Or enter custom amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="pl-10 text-lg md:text-base"
                />
              </div>
            </div>

            {/* Email (optional) */}
            <div>
              <label className="block text-base md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email (optional - for receipt)
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg md:text-base"
              />
            </div>

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              disabled={loading || (!customAmount && !selectedAmount)}
              className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy py-6 md:py-4 text-lg md:text-base font-bold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Donate ${customAmount || selectedAmount}
                </>
              )}
            </Button>
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