import React from 'react';
import { Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function DonateDropdown({ className = "", size = "default" }) {
  const handleGeneralDonate = () => {
    window.open('https://donate.mercyhouse.org', '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-gold hover:bg-gold/90 text-navy font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
          size={size}
        >
          <Heart className="w-4 h-4 mr-2" />
          Donate Now
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleGeneralDonate} className="cursor-pointer">
          <Heart className="w-4 h-4 mr-2 text-navy dark:text-gold" />
          <span className="font-semibold">General Donation</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to={createPageUrl('SponsorStudent')}>
            <Users className="w-4 h-4 mr-2 text-navy dark:text-gold" />
            <span className="font-semibold">Sponsor a Student</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}