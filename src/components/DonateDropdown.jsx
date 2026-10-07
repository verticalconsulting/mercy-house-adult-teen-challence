import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

/**
 * Header Donate button. Goes straight to the Donate page — no dropdown.
 * Kept the same props/signature as the old dropdown so existing call sites
 * (header nav, mobile floating button, footer) don't need to change.
 */
export default function DonateDropdown({ className = "", size = "default", onItemClick }) {
  return (
    <Button
      asChild
      size={size}
      className={`border border-[#263f5b] bg-navy text-white rounded-md shadow-[0_4px_10px_rgba(21,39,58,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-navy-900 hover:shadow-[0_5px_13px_rgba(21,39,58,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] active:bg-navy-950 active:shadow-[0_2px_5px_rgba(21,39,58,0.24)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-gold focus-visible:ring-0 transition-[background-color,box-shadow,color] duration-[180ms] ease-out ${className}`}>
      <Link to={createPageUrl('Donate')} onClick={onItemClick}>
        <Heart className="text-gold fill-current animate-heart-beat" />
        Donate Now
      </Link>
    </Button>);

}