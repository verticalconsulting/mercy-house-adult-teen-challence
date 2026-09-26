import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Phone, Printer, MapPin, Clock, Mail, ArrowRight, MessageCircle, Star, ExternalLink } from 'lucide-react';

const GOOGLE_BUSINESS_URL = 'https://www.google.com/maps/place/Mercy+House+Adult+%26+Teen+Challenge+-+Men%27s+Campus/@32.4647,-90.3947,17z/';

const googleReviews = [
  { text: 'The best place on earth to go. This place is a chain breaker.', author: 'Google Reviewer' },
  { text: 'Best place in the world — it helped my pawpaw in so many different ways. Thank y\u2019all so much.', author: 'Avery Guillory' },
  { text: 'I think it\u2019s really great what you are doing and that you are helping others get clean.', author: 'Marie Hall' },
];
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Hero */}
      <header className="bg-navy dark:bg-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We're Here for You</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            The hardest part is reaching out. Our intake team will meet you exactly where you are — with compassion, not judgment.
          </p>
          <a
            href="tel:6017203718"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-lg text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-xl"
            aria-label="Call our intake coordinator at (601) 720-3718"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Call Intake: (601) 720-3718
          </a>
          <p className="text-slate-400 text-sm mt-4">Available Monday – Friday, 8am – 5pm CST</p>
        </div>
      </header>

      <main id="contact-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Housing Assistance Notice */}
        <section aria-label="Housing assistance notice" className="mb-12">
          <div className="mx-auto max-w-3xl rounded-lg border border-gold/40 bg-gold/10 p-5 dark:bg-gold/10">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              <span className="font-bold text-navy dark:text-gold">Housing Assistance Notice:</span>{' '}
              Mercy House Adult &amp; Teen Challenge is a faith-based recovery and Christian discipleship ministry. We are not a public housing authority and do not administer Section 8, Housing Choice Vouchers, HUD housing, or rental-assistance programs.
            </p>
          </div>
        </section>

        {/* Campus Cards */}
        <section aria-labelledby="campuses-heading">
          <h2 id="campuses-heading" className="text-3xl font-bold text-navy dark:text-gold mb-8 text-center">
            Find a Campus Near You
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">

            {/* Men's Campus */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold text-2xl">Men's Campus</CardTitle>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Georgetown, Mississippi</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <address className="not-italic space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Physical Address</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        1110 Mary St<br />
                        Georgetown, MS 39078
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Mailing Address</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        PO Box 266<br />
                        Georgetown, MS 39078
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Office Phone</p>
                      <a href="tel:8558937333" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        855-89-FREEDOM (855-893-7333)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Coordinator</p>
                      <a href="tel:6017203718" className="text-gold font-bold hover:text-gold/80 transition-colors">
                        (601) 720-3718
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Printer className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Fax</p>
                      <p className="text-slate-600 dark:text-slate-300">(601) 858-2420</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">General Email</p>
                      <a href="mailto:info@mercyhouseatc.com" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        info@mercyhouseatc.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Email</p>
                      <a href="mailto:intake@mercyhouseatc.com" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        intake@mercyhouseatc.com
                      </a>
                    </div>
                  </div>
                </address>

                <Link to={createPageUrl('MensCampus')}>
                  <Button variant="outline" className="w-full border-navy dark:border-gold text-navy dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all mt-2">
                    View Men's Program
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Women's Campus */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-navy dark:text-gold text-2xl">Women's Campus</CardTitle>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Learned, Mississippi</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <address className="not-italic space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Physical Address</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        5257 Learned Rd<br />
                        Learned, MS 39154
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Mailing Address</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        PO Box 266<br />
                        Georgetown, MS 39078
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Office Phone</p>
                      <a href="tel:8558937333" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        855-89-FREEDOM (855-893-7333)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Coordinator</p>
                      <a href="tel:6017203718" className="text-gold font-bold hover:text-gold/80 transition-colors">
                        (601) 720-3718
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Printer className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Fax</p>
                      <p className="text-slate-600 dark:text-slate-300">(601) 858-2420</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">General Email</p>
                      <a href="mailto:info@mercyhouseatc.com" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        info@mercyhouseatc.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Intake Email</p>
                      <a href="mailto:intake@mercyhouseatc.com" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors">
                        intake@mercyhouseatc.com
                      </a>
                    </div>
                  </div>
                </address>

                <Link to={createPageUrl('WomensCampus')}>
                  <Button variant="outline" className="w-full border-navy dark:border-gold text-navy dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all mt-2">
                    View Women's Program
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Google Reviews */}
        <section aria-labelledby="reviews-heading" className="mb-12">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="bg-navy dark:bg-slate-950 text-white px-6 py-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={i < 4 ? 'w-7 h-7 fill-gold text-gold' : 'w-7 h-7 fill-gold/40 text-gold/40'}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-3xl font-bold ml-2">4.4</span>
              </div>
              <p className="text-slate-300 text-sm mb-1">Rated 4.4 out of 5 on Google</p>
              <p className="text-slate-400 text-xs">Based on 26 Google reviews</p>
            </div>
            <div className="p-6 md:p-8">
              <h2 id="reviews-heading" className="text-2xl font-bold text-navy dark:text-gold mb-6 text-center">
                What People Are Saying on Google
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {googleReviews.map((review, i) => (
                  <figure key={i} className="rounded-xl border border-slate-100 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic mb-3">
                        &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <figcaption className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      &mdash; {review.author}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="text-center">
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-navy dark:bg-gold text-white dark:text-navy font-bold px-6 py-3 rounded-lg hover:bg-navy/90 dark:hover:bg-gold/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Read All Reviews on Google
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Hours + Apply CTA */}
        <section aria-labelledby="hours-heading" className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy dark:text-gold text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" aria-hidden="true" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-base">
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-900 dark:text-white">Monday – Friday</dt>
                  <dd className="text-slate-600 dark:text-slate-300">8:00 am – 5:00 pm CST</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-900 dark:text-white">Saturday – Sunday</dt>
                  <dd className="text-slate-500 dark:text-slate-400">Closed</dd>
                </div>
              </dl>
              <div className="mt-5 bg-gold/10 border border-gold/30 rounded-lg p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  💡 In a crisis outside office hours? Call <a href="tel:988" className="text-gold font-bold">988</a> (Suicide & Crisis Lifeline) or text HOME to 741741.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy dark:bg-slate-950 text-white border-0">
            <CardHeader>
              <CardTitle className="text-gold text-xl">Ready to Take the First Step?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-base leading-relaxed">
                Our online intake application takes about 20 minutes. You can save progress and come back anytime — or call us and we'll walk you through it together.
              </p>
              <Link to={createPageUrl('IntakeForm')}>
                <Button className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-5">
                  Start Your Application
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <a href="tel:6017203718">
                <Button variant="outline" className="w-full border-2 border-gold/50 text-gold hover:bg-gold/10 py-5 font-semibold">
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  Call (601) 720-3718 Instead
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>


      </main>
    </div>
  );
}