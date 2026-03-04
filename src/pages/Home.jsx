import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Heart, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonateButton from '../components/DonateButton';

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section aria-label="Hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80"
            alt="Families finding hope and a new beginning at Mercy House"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-5 leading-tight">
              A New Beginning
              <span className="block text-gold mt-2">Starts Here</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-slate-200 leading-relaxed">
              Providing comprehensive Christian faith-based solutions to life-controlling problems. Become mentally sound, emotionally balanced, and socially adjusted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('IntakeForm')}>
                <Button className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <DonateButton className="w-full sm:w-auto px-8 py-6 text-lg font-semibold" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section aria-labelledby="mission-heading" className="py-16 md:py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              To provide an effective and comprehensive Christian faith-based solution to life-controlling problems in order to become productive members of society. By applying biblical principles, we endeavor to help people become mentally sound, emotionally balanced, and socially adjusted.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section aria-labelledby="programs-heading" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-10 md:mb-12">Our Programs</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-52 md:h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Women supporting each other in Mercy House Women's Campus recovery program"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="800"
                  height="512"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-3 md:mb-4">Women's Campus</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-5 md:mb-6 text-sm md:text-base">
                  A safe, supportive environment where women can heal, grow, and rebuild their lives through faith-based recovery and life skills training.
                </p>
                <Link to={createPageUrl('WomensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn More About Women's Campus
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </article>

            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-52 md:h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80"
                  alt="Men building community and brotherhood at Mercy House Men's Campus"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="800"
                  height="512"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-3 md:mb-4">Men's Campus</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-5 md:mb-6 text-sm md:text-base">
                  Empowering men to overcome addiction and life-controlling issues through structured programming, spiritual development, and vocational training.
                </p>
                <Link to={createPageUrl('MensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn More About Men's Campus
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section aria-label="Impact statistics" className="py-16 md:py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '15+', label: 'Years of Service' },
              { value: '110%', label: 'Donations to Mission' },
              { value: '1000+', label: 'Lives Changed' },
              { value: '24/7', label: 'Support Available' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-4xl md:text-5xl font-bold text-gold mb-2">{value}</span>
                  <span className="text-slate-300 text-sm md:text-base">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Micro Businesses Section */}
      <section aria-labelledby="businesses-heading" className="py-16 md:py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 id="businesses-heading" className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-4">Micro Businesses</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our micro businesses provide job training, develop work skills, and fund our operations—ensuring 110% of individual donations go directly to our mission.
            </p>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" role="list">
            {[
              { name: 'Thrift Store', icon: '🏪', path: 'ThriftStore', desc: 'Affordable goods supporting our mission' },
              { name: 'Vehicle Donation', icon: '🚗', path: 'VehicleDonation', desc: 'Donate your vehicle to fund recovery' },
              { name: 'Mercy Auto Academy', icon: '🔧', path: 'MercyAutoAcademy', desc: 'Vocational auto repair training' },
              { name: 'Products & Purpose', icon: '📦', path: 'ProductsPurpose', desc: 'Handcrafted products with purpose' }
            ].map((business) => (
              <li key={business.name}>
                <Link
                  to={createPageUrl(business.path)}
                  aria-label={`${business.name} - ${business.desc}`}
                  className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-5 md:p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full"
                >
                  <span className="text-4xl md:text-5xl mb-3" aria-hidden="true">{business.icon}</span>
                  <h3 className="font-semibold text-navy dark:text-gold text-sm md:text-base">{business.name}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section aria-labelledby="cta-heading" className="py-16 md:py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-5 md:mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl mb-8 text-slate-200">
            Take the first step towards freedom and transformation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('IntakeForm')} className="w-full sm:w-auto">
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl">
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-6 text-lg font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}