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

export default function DonateDropdown({ className = "", size = "default", onItemClick }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-gold hover:bg-gold/90 text-navy font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
          size={size}
        >
          <Heart className="w-5 h-5 md:w-4 md:h-4 mr-2" />
          Donate Now
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 md:w-56">
        <DropdownMenuItem asChild className="cursor-pointer py-4 md:py-2">
          <Link to={createPageUrl('Donate')} onClick={onItemClick}>
            <Heart className="w-6 h-6 md:w-4 md:h-4 mr-3 md:mr-2 text-navy dark:text-gold" />
            <span className="font-semibold text-lg md:text-sm">General Donation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer py-4 md:py-2">
          <Link to={createPageUrl('Support')} onClick={onItemClick}>
            <Heart className="w-6 h-6 md:w-4 md:h-4 mr-3 md:mr-2 text-navy dark:text-gold" />
            <span className="font-semibold text-lg md:text-sm">Monthly Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer py-4 md:py-2">
          <Link to={createPageUrl('SponsorStudent')} onClick={onItemClick}>
            <Users className="w-6 h-6 md:w-4 md:h-4 mr-3 md:mr-2 text-navy dark:text-gold" />
            <span className="font-semibold text-lg md:text-sm">Sponsor a Student</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}