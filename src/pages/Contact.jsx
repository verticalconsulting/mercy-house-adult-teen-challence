import React from 'react';
import { Phone, Printer, MapPin, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-navy dark:bg-slate-950 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">We're Here for You</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Taking the first step is the hardest part — we make it easy. Call or write anytime.
          </p>
          {/* Social proof + urgency nudge */}
          <a
            href="tel:6017203718"
            className="inline-flex items-center gap-2 mt-6 bg-gold hover:bg-gold/90 text-navy font-bold px-6 py-3 rounded-lg text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Call Intake Now: (601) 720-3718
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Men's Campus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold text-xl md:text-2xl">Men's Campus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Address</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">
                    1110 Mary St<br />
                    PO Box 266<br />
                    Georgetown, MS 39078
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Office Phone</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">855-89-FREEDOM</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">855-893-7333</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Intake Coordinator</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">(601) 720-3718</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Printer className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Intake Fax</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">601 858-2420</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Women's Campus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold text-xl md:text-2xl">Women's Campus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Address</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">
                    5257 Learned Rd<br />
                    Learned, MS 39154
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Phone</p>
                  <p className="text-base md:text-base text-slate-600 dark:text-slate-300">855-893-7333</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Office Hours */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-navy dark:text-gold text-xl md:text-2xl">Office Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1" />
              <div>
                <p className="text-base md:text-base text-slate-900 dark:text-white font-semibold mb-2">
                  Monday – Friday: 8am - 5pm
                </p>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300">
                  Saturday – Sunday: Closed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy dark:text-gold text-xl md:text-2xl">General Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 md:w-5 md:h-5 text-navy dark:text-gold mt-1" />
              <div>
                <p className="font-semibold text-base md:text-base text-slate-900 dark:text-white">Email</p>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300">info@mercyhouse.org</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
              <h3 className="font-bold text-lg md:text-base text-navy dark:text-gold mb-3">Ready to Start Your Journey?</h3>
              <p className="text-base md:text-base text-slate-600 dark:text-slate-300 mb-4">
                Contact our intake coordinator to begin the application process or to learn more about our programs.
              </p>
              <a
                href="tel:6017203718"
                className="inline-block w-full md:w-auto text-center bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy px-6 py-4 md:py-3 rounded-lg text-base md:text-base font-semibold transition-colors"
              >
                Call Intake: (601) 720-3718
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}