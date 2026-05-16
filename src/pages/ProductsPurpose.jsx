import React from 'react';
import { Package, Heart, ShoppingCart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductsPurpose() {
  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <img src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/604c6e1a5_product-logo.png"

            alt="Product With A Purpose Logo"
            className="h-24 mx-auto mb-6" />
            
             <h1 className="text-5xl font-bold text-navy dark:text-gold mb-6">
               Product With A Purpose
             </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Handcrafted products made by residents. Every purchase supports recovery and builds skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                Crafted By Hand. Made By Men in Recovery.
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Every product you see — from hand-carved door hangers to custom woodwork — is created by the hands of men in our program. This isn't mass production. This is <strong>vocational transformation</strong>.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Through work therapy and craft development, residents learn discipline, attention to detail, and pride in their work. The skills they develop — carpentry, quality craftsmanship, customer focus — become the foundation for their independence.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                When you buy from Product With A Purpose, you're not just getting a beautiful, handmade item. You're investing in the transformation of a man's life.
              </p>
              <Button
                onClick={() => window.open('https://www.productwithapurpose.org/', '_blank')}
                className="bg-gold hover:bg-gold/90 text-navy font-bold text-lg px-8 py-6">
                
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Handmade Products
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-8">
              <div className="text-center space-y-6">
                <div className="bg-white dark:bg-slate-600 rounded-xl p-6 shadow-md">
                  <div className="text-5xl mb-3">🚪</div>
                  <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">Hand-Carved Door Hangers</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Wood. Crafted. Custom designs available.</p>
                </div>
                <div className="bg-white dark:bg-slate-600 rounded-xl p-6 shadow-md">
                  <div className="text-5xl mb-3">🛋️</div>
                  <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">Custom Woodwork</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Furniture, decor, and specialty pieces made to order.</p>
                </div>
                <div className="bg-white dark:bg-slate-600 rounded-xl p-6 shadow-md">
                  <div className="text-5xl mb-3">🎁</div>
                  <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">Seasonal Decor</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Home accents handmade with care and purpose.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
            {
              icon: Package,
              title: 'What We Make',
              items: ['Hand-carved door hangers', 'Custom woodwork & furniture', 'Decorative wall art', 'Seasonal home decor', 'Gift items & special orders']
            },
            {
              icon: Award,
              title: 'Built By Hand',
              items: ['100% handcrafted by program residents', 'Each piece is unique', 'Attention to quality & detail', 'Personal pride in every item', 'Work therapy in action']
            },
            {
              icon: Heart,
              title: 'Your Impact',
              items: ['Develops vocational skills', 'Funds recovery programs', 'Builds confidence & pride', 'Supports long-term independence', 'Transforms lives through work']
            }].
            map((section, idx) =>
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <section.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) =>
                <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white p-12 rounded-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Handmade by Men. Made With Purpose.</h2>
            <p className="text-xl mb-10 text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Every door hanger, piece of woodwork, and decor item you purchase supports the transformation of men in recovery. Custom and bulk orders welcome.
            </p>
            <Button
              onClick={() => window.open('https://www.productwithapurpose.org/', '_blank')}
              className="bg-gold hover:bg-gold/90 text-navy font-bold text-lg px-10 py-8 shadow-lg">
              
              <ShoppingCart className="w-6 h-6 mr-3" />
              Visit Product With A Purpose Store
            </Button>
          </div>
        </div>
      </section>
    </div>);

}