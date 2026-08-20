import React from 'react';
import { Heart, Home, BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VirtuousGiveForm from '@/components/VirtuousGiveForm';
import NonprofitLegitimacy from '@/components/NonprofitLegitimacy';

// Mercy House recurring-gift Virtuous form (Stripe + Virtuous CRM).
const RECURRING_VIRTUOUS_FORM_ID = 'BD48ECA9-6E77-4CBC-81F7-D8A42A7751E8';

export default function RecurringDonation() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      {/* Hero Section */}
      <div className="bg-navy dark:bg-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-gold mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Become a Monthly Partner
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your recurring support provides stability and hope for residents on their journey to transformation.
            Your gift goes directly to housing, meals, program care, and ministry operations.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Secure Recurring Giving Form — Virtuous + Stripe */}
        <VirtuousGiveForm
          formId={RECURRING_VIRTUOUS_FORM_ID}
          title="Set Up Your Monthly Gift"
          subtitle="Choose your amount and set a monthly schedule inside the secure form below. Cancel or change your gift anytime."
          className="shadow-xl"
        />

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          <span>🔒 Secure checkout via Stripe</span>
          <span>·</span>
          <span>Tax-deductible · EIN 45-4670832</span>
          <span>·</span>
          <span>Cancel recurring gifts anytime</span>
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-6">
            Your Monthly Impact
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Home className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-bold text-navy dark:text-gold mb-2">Safe Housing</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Provide shelter, meals, and a healing environment
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-bold text-navy dark:text-gold mb-2">Education</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Fund life skills training and vocational programs
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <Users className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-bold text-navy dark:text-gold mb-2">Support Staff</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Enable counseling, mentorship, and spiritual guidance
            </p>
          </div>
        </div>
      </div>

      {/* Nonprofit Legitimacy */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <NonprofitLegitimacy />
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-3xl mx-auto">
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
                  Yes! You can cancel or modify your recurring gift at any time through the secure form or by contacting us.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my donation tax-deductible?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, all donations are 100% tax-deductible. You'll receive a receipt via email.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is my donation used?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  100% of your monthly gift goes directly to supporting residents through housing, meals, education, and comprehensive care programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}