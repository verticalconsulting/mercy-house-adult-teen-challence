import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DonateButton({ className = "", size = "default", monthly = false }) {
  return (
    <Link to={createPageUrl(monthly ? 'Support' : 'Donate')}>
      <Button
        className={`bg-gold hover:bg-gold/90 text-navy font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
        size={size}
      >
        <Heart className="w-4 h-4 mr-2" />
        Donate Now
      </Button>
    </Link>
  );
}