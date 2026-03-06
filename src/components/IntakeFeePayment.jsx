import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Calendar, DollarSign, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function IntakeFeePayment({ applicantName, applicantEmail }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState(applicantEmail || '');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'full',
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Pay in Full',
      subtitle: '$1,000 one-time',
      description: 'Single payment covering the full intake fee.',
      badge: null,
    },
    {
      id: 'installment',
      icon: <Calendar className="w-6 h-6" />,
      title: 'Monthly Installments',
      subtitle: '$100/month × 10 months',
      description: 'Spread the intake fee over 10 monthly payments with no extra cost.',
      badge: 'Most Flexible',
    },
  ];

  const handlePay = async () => {
    if (!selectedPlan) {
      toast.error('Please select a payment plan');
      return;
    }
    if (!email) {
      toast.error('Please enter your email for receipt');
      return;
    }
    if (window.self !== window.top) {
      toast.error('Please use the published app to process payments');
      return;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('createIntakeFeeCheckout', {
        paymentType: selectedPlan,
        email,
        applicantName: applicantName || '',
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to start checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Payment error. Please call (601) 720-3718 for help.');
      setLoading(false);
    }
  };

  return (
    <Card className="border-gold/30 bg-gold/5 dark:bg-gold/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-navy dark:text-gold">
          <CreditCard className="w-5 h-5" />
          Intake Fee Payment — $1,000
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A one-time $1,000 intake fee covers your initial program costs. Choose how you'd like to pay — or ask your intake coordinator about waiver options.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-gold bg-gold/10 dark:bg-gold/20 ring-2 ring-gold'
                  : 'border-slate-200 dark:border-slate-700 hover:border-gold/60'
              }`}
            >
              {plan.badge && (
                <span className="absolute top-2 right-2 bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className={`mb-2 ${selectedPlan === plan.id ? 'text-gold' : 'text-slate-500'}`}>
                {plan.icon}
              </div>
              <div className="font-bold text-navy dark:text-white text-base">{plan.title}</div>
              <div className="text-gold font-semibold text-sm">{plan.subtitle}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">{plan.description}</div>
              {selectedPlan === plan.id && (
                <Check className="absolute bottom-3 right-3 w-4 h-4 text-gold" />
              )}
            </button>
          ))}
        </div>

        <div>
          <Label htmlFor="intake_fee_email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email for receipt
          </Label>
          <Input
            id="intake_fee_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mt-1"
          />
        </div>

        <Button
          onClick={handlePay}
          disabled={loading || !selectedPlan || !email}
          className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-bold py-5"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing…</>
          ) : (
            <><CreditCard className="w-4 h-4 mr-2" />Proceed to Secure Checkout</>
          )}
        </Button>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          🔒 Secure payment via Stripe · Need help? Call (601) 720-3718
        </p>
      </CardContent>
    </Card>
  );
}