import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, TrendingUp, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MicroBusinesses() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&q=80"
            alt="Business operations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 dark:from-slate-900/95 dark:to-slate-900/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Workforce Development
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
            Training, Skills, and Sustainable Funding
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
            Purpose-Driven Enterprise
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
            Our workforce development businesses serve a dual purpose: providing residents with valuable job training and marketable skills while generating revenue to fund our operations. This innovative model ensures that <strong className="text-navy dark:text-gold">100% of individual donor proceeds go directly to our mission</strong>—an unheard-of standard in nonprofit work.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Through hands-on experience in real business environments, residents develop work ethics, professional skills, and financial literacy that prepare them for successful careers and independent living.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4" />
              <div className="text-4xl font-bold text-navy dark:text-gold mb-2">100%</div>
              <div className="text-slate-600 dark:text-slate-400">Donations to Mission</div>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-gold mx-auto mb-4" />
              <div className="text-4xl font-bold text-navy dark:text-gold mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-400">Residents Trained</div>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-gold mx-auto mb-4" />
              <div className="text-4xl font-bold text-navy dark:text-gold mb-2">15</div>
              <div className="text-slate-600 dark:text-slate-400">Years of Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Units */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Our Workforce Development Businesses
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'SuperTHRIFT',
                emoji: '🏪',
                description: 'Community thrift store offering quality secondhand goods while training residents in retail operations, customer service, and inventory management.',
                href: 'https://mercyhouseatc.superthriftdeals.org',
                external: true
              },
              {
                title: 'Vehicle Donation',
                emoji: '🚗',
                description: 'Accepting vehicle donations to support our mission. Provides tax benefits to donors and funding for our programs.',
                path: 'VehicleDonation',
                external: false
              },
              {
                title: 'Mercy House Auto Center',
                emoji: '🔧',
                description: 'Professional automotive training center where residents learn mechanics, body work, and automotive technology — preparing them for well-paying careers upon graduation.',
                path: 'MercyAutoAcademy',
                external: false
              },
              {
                title: 'Product With A Purpose',
                emoji: '📦',
                description: 'Specialty products crafted by residents, combining quality craftsmanship with purpose. Every purchase directly supports the Mercy House mission and resident development.',
                path: 'ProductsPurpose',
                external: false
              },
              {
                title: 'Mercy House Elite Gutters',
                emoji: '🏠',
                description: 'A full-service seamless gutter, downspout, and leaf guard installation company based in Brandon, MS. Residents receive hands-on job training in gutter system design, installation, cleaning, and maintenance — building real-world trade skills and work ethic. Backed by a 5-Year Craftsmanship Guarantee.',
                href: 'https://myelitegutters.com',
                external: true
              }
            ].map((business, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-6xl mb-4">{business.emoji}</div>
                <h3 className="text-2xl font-bold text-navy dark:text-gold mb-4">
                  {business.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  {business.description}
                </p>
                {business.external ? (
                  <a href={business.href} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                      Visit Website
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                ) : (
                  <Link to={createPageUrl(business.path)}>
                    <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Skills That Transform Lives</h2>
          <p className="text-xl mb-8 text-slate-200">
            Residents gain real-world experience in customer service, teamwork, time management, financial responsibility, and industry-specific skills that open doors to sustainable employment after graduation.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {['Professional Skills', 'Work Ethics', 'Financial Literacy'].map((skill, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-gold font-bold text-lg">{skill}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}