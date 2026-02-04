import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DonateButton({ className = "", size = "default" }) {
  const handleDonate = () => {
    // Will be configured with actual donation link
    window.open('https://donate.mercyhouse.org', '_blank');
  };

  return (
    <Button
      onClick={handleDonate}
      className={`bg-gold hover:bg-gold/90 text-navy font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      size={size}
    >
      <Heart className="w-4 h-4 mr-2" />
      Donate Now
    </Button>
  );
}