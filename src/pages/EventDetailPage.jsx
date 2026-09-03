import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import SocialShareButtons from '@/components/SocialShareButtons';
import { useShareMeta } from '@/hooks/useShareMeta';

const categoryLabels = {
  workshop: 'Workshop', outreach: 'Outreach', community_event: 'Community Event',
  fundraiser: 'Fundraiser', service: 'Service', other: 'Other'
};
const categoryColors = {
  workshop: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  outreach: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  community_event: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  fundraiser: 'bg-gold/20 text-yellow-800 dark:bg-gold/10 dark:text-gold',
  service: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => base44.entities.Event.get(id),
    enabled: !!id,
  });

  useShareMeta({
    title: event?.title,
    description: event?.description,
    image: event?.image_url,
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-navy dark:text-gold mb-3">Event not found</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">The event you're looking for may have been removed.</p>
        <Link to="/Events"><Button variant="outline">Back to News & Events</Button></Link>
      </div>
    );
  }

  return (
    <article className="bg-background dark:bg-slate-900">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-deep" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent" />
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
          <Badge className={`w-fit mb-4 ${categoryColors[event.category] || categoryColors.other}`}>
            {categoryLabels[event.category] || event.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">{event.title}</h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-slate-700 dark:text-slate-300 mb-8">
          <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gold" />{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</div>
          <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gold" />{format(new Date(event.event_date), 'h:mm a')}{event.end_date && ` – ${format(new Date(event.end_date), 'h:mm a')}`}</div>
          {event.location && <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-gold" />{event.location}</div>}
          {event.capacity && <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gold" />Capacity: {event.capacity}</div>}
        </div>

        {event.description && (
          <div className="blog-content text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            <ReactMarkdown>{event.description}</ReactMarkdown>
          </div>
        )}

        {event.registration_link && (
          <div className="mt-8">
            <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
              <Button className="bg-gold text-navy hover:bg-gold-accessible hover:text-white">
                Register Now <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-gold-accessible mb-3">Share this event</p>
            <SocialShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={event.title} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to="/Events">
              <Button variant="outline" className="border-navy text-navy dark:border-gold dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy">
                <ArrowLeft className="w-4 h-4 mr-2" /> All News & Events
              </Button>
            </Link>
            <Link to="/Donate">
              <Button className="bg-gold text-navy hover:bg-gold-accessible hover:text-white">
                Support Our Ministry <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}