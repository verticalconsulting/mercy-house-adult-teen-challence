import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Check, Loader2, Users, Home, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function Support() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      toast.success('Thank you for your monthly support! You will receive a confirmation email.');
    } else if (params.get('subscription') === 'cancelled') {
      toast.error('Subscription cancelled. Feel free to try again anytime.');
    }
  }, []);

  const subscriptionPlans = [
    {
      name: 'Basic Support',
      amount: 25,
      priceId: 'price_1SxDysKHFeI9Ceo2dlhYM7Bc',
      description: 'Help provide meals and basic necessities',
      icon: Heart,
      features: [
        'Support 1 resident per month',
        'Monthly impact updates',
        'Tax-deductible donation'
      ]
    },
    {
      name: 'Partner Support',
      amount: 50,
      priceId: 'price_1SxDysKHFeI9Ceo2T3pvT8eo',
      stripeLink: 'https://donate.stripe.com/test_aFa9AUa2raZH3N76h7fAc00',
      description: 'Become a ministry partner',
      icon: Users,
      features: [
        'Support 2 residents per month',
        'Monthly impact updates',
        'Partner recognition',
        'Tax-deductible donation'
      ],
      popular: true
    },
    {
      name: 'Champion Support',
      amount: 100,
      priceId: 'price_1SxDysKHFeI9Ceo2H27cbIny',
      description: 'Champion life transformation',
      icon: Home,
      features: [
        'Support 4+ residents per month',
        'Quarterly progress reports',
        'Champion recognition',
        'Exclusive ministry updates',
        'Tax-deductible donation'
      ]
    }
  ];

  const handleSubscribe = async (plan) => {
    // Check if running in iframe
    if (window.self !== window.top) {
      toast.error('Subscriptions must be completed from the published app. Please open the app in a new tab.');
      return;
    }

    // Use direct Stripe payment link if available
    if (plan.stripeLink) {
      window.location.href = plan.stripeLink;
      return;
    }

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.priceId);

    try {
      const { data } = await base44.functions.invoke('createSubscriptionCheckout', {
        priceId: plan.priceId,
        email: email
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      {/* Hero Section */}
      <div className="bg-navy dark:bg-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Become a Monthly Partner
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your recurring support provides stability and hope for residents on their journey to transformation.
            100% of donations go directly to our mission.
          </p>
        </div>
      </div>

      {/* Email Input */}
      <div className="max-w-md mx-auto px-4 -mt-8 mb-12">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <Label htmlFor="email" className="text-base">Your Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="supporter@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              We'll send your receipt and impact updates here
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.priceId}
                className={`relative ${
                  plan.popular
                    ? 'border-gold border-2 shadow-xl scale-105'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold text-navy px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <Icon className="w-12 h-12 text-navy dark:text-gold mx-auto mb-4" />
                  <CardTitle className="text-2xl text-navy dark:text-gold">
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-navy dark:text-white">
                      ${plan.amount}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading || !email}
                    className={`w-full font-bold ${
                      plan.popular
                        ? 'bg-gold hover:bg-gold/90 text-navy'
                        : 'bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy'
                    }`}
                  >
                    {loading && selectedPlan === plan.priceId ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe Monthly'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Impact Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-6">
            Your Monthly Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <Home className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="font-bold text-navy dark:text-gold mb-2">Safe Housing</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Provide shelter, meals, and a healing environment
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="font-bold text-navy dark:text-gold mb-2">Education</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Fund life skills training and vocational programs
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <Users className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="font-bold text-navy dark:text-gold mb-2">Support Staff</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Enable counseling, mentorship, and spiritual guidance
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes! You can cancel or modify your subscription at any time through your Stripe customer portal.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my donation tax-deductible?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, all donations are 100% tax-deductible. You'll receive monthly receipts via email.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is my donation used?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  100% of your monthly donation goes directly to supporting residents through housing, meals, education, and comprehensive care programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}