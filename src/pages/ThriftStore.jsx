import React from 'react';
import { ShoppingBag, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThriftStore() {
  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-4">🏪</div>
              <h1 className="text-5xl font-bold text-navy dark:text-gold mb-6">
                Mercy House Thrift Store
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Our community thrift store offers quality secondhand clothing, furniture, household items, and more at affordable prices. Every purchase supports recovery and transformation.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Residents gain hands-on experience in retail operations, customer service, inventory management, merchandising, and cash handling—skills that translate directly to future employment.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Thrift store interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <Clock className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">Store Hours</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Monday - Saturday<br />
                9:00 AM - 6:00 PM<br />
                Closed Sundays
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <MapPin className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">Location</h3>
              <p className="text-slate-600 dark:text-slate-300">
                123 Hope Street<br />
                Your City, ST 12345
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <Phone className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">Contact</h3>
              <p className="text-slate-600 dark:text-slate-300">
                (555) 123-4567<br />
                thrift@mercyhouse.org
              </p>
            </div>
          </div>

          <div className="mt-16 bg-navy dark:bg-slate-950 text-white p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-gold mb-4">Donations Welcome!</h2>
            <p className="text-lg mb-6">
              We accept gently used clothing, furniture, household items, books, and more. Your donations support our mission and help stock our store.
            </p>
            <Button className="bg-gold hover:bg-gold/90 text-navy">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Schedule a Donation Pickup
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}