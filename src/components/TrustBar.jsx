import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

/**
 * Utility bar above the header.
 *
 * A thin navy-950 band carrying the help line, so the single most important
 * thing on the site — a phone number that reaches a person — sits above
 * everything else on every page.
 */
export default function TrustBar() {
  return (
    <div className="hidden bg-navy-950 px-4 py-2.5 text-[13px] text-white/85 md:block">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href="tel:8558937333"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            855-893-7333
          </a>
          <a
            href="mailto:info@mercyhouseatc.com"
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            info@mercyhouseatc.com
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Georgetown &amp; Learned, Mississippi
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-gold">
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          501(c)(3) Nonprofit · 100% of Individual Donations Go to Mission
        </div>
      </div>
    </div>
  );
}
