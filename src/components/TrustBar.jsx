import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

/**
 * Sticky utility bar — wireframe approach C.
 *
 * Navy band carrying the confidential help line, so the single most important
 * thing on the site (a phone number that reaches a person) is above everything
 * else on every page. The gold dot is the wireframe's "primary action" marker.
 */
export default function TrustBar() {
  return (
    <div className="hidden bg-navy px-4 py-2.5 text-white md:block">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <a
            href="tel:8558937333"
            className="flex items-center gap-1.5 font-semibold transition-colors hover:text-gold"
          >
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-gold" />
            <Phone className="h-4 w-4" aria-hidden="true" />
            Confidential help line: 855-893-7333
          </a>
          <a
            href="mailto:info@mercyhouseatc.com"
            className="flex items-center gap-1.5 text-slate-200 transition-colors hover:text-gold"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            info@mercyhouseatc.com
          </a>
          <span className="flex items-center gap-1.5 text-slate-200">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Georgetown &amp; Learned, Mississippi
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-200">
          <Heart className="h-4 w-4 text-gold" aria-hidden="true" />
          501(c)(3) Nonprofit · EIN 99-1943281 · 100% of Individual Donations Go to Mission
        </div>
      </div>
    </div>
  );
}
