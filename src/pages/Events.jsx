import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileSelect } from '@/components/ui/mobile-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, ExternalLink, Clock, MapPin, ArrowLeft, Newspaper } from 'lucide-react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { SelectItem } from '@/components/ui/select';
import PullToRefresh from '../components/PullToRefresh';
import ReactMarkdown from 'react-markdown';

export default function Events() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ published: true }, 'event_date'),
    initialData: []
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  const categoryColors = {
    workshop: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    outreach: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    community_event: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    fundraiser: 'bg-gold/20 text-yellow-800 dark:bg-gold/10 dark:text-gold',
    service: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const today = startOfDay(new Date());
    
    const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
    
    let dateMatch = true;
    if (dateFilter === 'upcoming') {
      dateMatch = isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    } else if (dateFilter === 'past') {
      dateMatch = isBefore(eventDate, today);
    }
    
    return categoryMatch && dateMatch;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-4xl font-bold text-navy dark:text-gold mb-4">
            Events & Programs
          </h1>
          <p className="text-xl md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join us for upcoming workshops, outreach programs, and community events
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <MobileSelect 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
            placeholder="All Categories"
            triggerClassName="w-full sm:w-64"
          >
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="workshop">Workshops</SelectItem>
            <SelectItem value="outreach">Outreach Programs</SelectItem>
            <SelectItem value="community_event">Community Events</SelectItem>
            <SelectItem value="fundraiser">Fundraisers</SelectItem>
            <SelectItem value="service">Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </MobileSelect>

          <MobileSelect 
            value={dateFilter} 
            onValueChange={setDateFilter}
            placeholder="Upcoming Events"
            triggerClassName="w-full sm:w-64"
          >
            <SelectItem value="upcoming">Upcoming Events</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
            <SelectItem value="all">All Events</SelectItem>
          </MobileSelect>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold mx-auto"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 md:w-12 md:h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-xl md:text-lg text-slate-500 dark:text-slate-400">No events found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={categoryColors[event.category]}>
                      {event.category.replace('_', ' ')}
                    </Badge>
                    {event.registration_required && (
                      <Badge variant="outline" className="text-base md:text-sm">Registration Required</Badge>
                    )}
                  </div>
                  <CardTitle className="text-navy dark:text-gold">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base md:text-sm mt-2">
                    <Calendar className="w-5 h-5 md:w-4 md:h-4" />
                    {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2 text-base md:text-sm">
                    <Clock className="w-5 h-5 md:w-4 md:h-4" />
                    {format(new Date(event.event_date), 'h:mm a')}
                    {event.end_date && ` - ${format(new Date(event.end_date), 'h:mm a')}`}
                  </CardDescription>
                  {event.location && (
                    <CardDescription className="flex items-center gap-2 text-base md:text-sm">
                      <MapPin className="w-5 h-5 md:w-4 md:h-4" />
                      {event.location}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 text-base md:text-sm">
                    {event.description}
                  </p>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-base md:text-sm text-slate-500 mb-4">
                      <Users className="w-5 h-5 md:w-4 md:h-4" />
                      Capacity: {event.capacity} people
                    </div>
                  )}
                  {event.registration_link && (
                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                        Register Now
                        <ExternalLink className="w-5 h-5 md:w-4 md:h-4 ml-2" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </PullToRefresh>
  );
}