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
      className={`bg-gold hover:bg-gold/90 text-navy font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      size={size}>
      
      <Link to={createPageUrl('Donate')} onClick={onItemClick} className="opacity-65">
        <Heart className="w-5 h-5 md:w-4 md:h-4 mr-2" />
        Donate Now
      </Link>
    </Button>);

}