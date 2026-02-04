import React from 'react';
import { Package, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductsPurpose() {
  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-5xl font-bold text-navy dark:text-gold mb-6">
              Products & Purpose
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Handcrafted products made by residents. Every purchase supports recovery and builds skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                Crafted With Purpose
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Our residents create beautiful, handcrafted products including woodwork, artwork, baked goods, and specialty items. Each piece represents hope, healing, and a step toward independence.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Through these creative enterprises, residents develop marketable skills in production, quality control, customer service, and entrepreneurship.
              </p>
              <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Our Products
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
                alt="Handcrafted products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Package,
                title: 'Product Categories',
                items: ['Woodwork & Furniture', 'Art & Crafts', 'Baked Goods', 'Candles & Soaps', 'Seasonal Items']
              },
              {
                icon: Heart,
                title: 'Your Impact',
                items: ['Funds recovery programs', 'Provides job training', 'Builds confidence', 'Develops work skills', 'Supports independence']
              },
              {
                icon: ShoppingCart,
                title: 'Where to Buy',
                items: ['Online store', 'Thrift store location', 'Local markets', 'Special events', 'Bulk orders welcome']
              }
            ].map((section, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <section.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white p-12 rounded-xl text-center">
            <h2 className="text-4xl font-bold mb-4">Custom & Bulk Orders</h2>
            <p className="text-xl mb-8 text-slate-200 max-w-3xl mx-auto">
              Need products for your business, church, or event? We offer custom orders and bulk pricing. Contact us to discuss your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-6 text-lg">
                Request a Quote
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-6 text-lg">
                View Product Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}