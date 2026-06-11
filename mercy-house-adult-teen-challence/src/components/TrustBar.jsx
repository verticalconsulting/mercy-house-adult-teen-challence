import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-6">
          <a href="tel:8558937333" className="flex items-center gap-1.5 hover:text-navy dark:hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />
            855-893-7333
          </a>
          <a href="mailto:info@mercyhouseatc.com" className="flex items-center gap-1.5 hover:text-navy dark:hover:text-gold transition-colors">
            <Mail className="w-4 h-4" />
            info@mercyhouseatc.com
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Georgetown &amp; Learned, Mississippi
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-navy dark:text-gold font-semibold">
          <Heart className="w-4 h-4" />
          501(c)(3) Nonprofit · EIN 99-1943281 · 100% of Individual Donations Go to Mission
        </div>
      </div>
    </div>
  );
}