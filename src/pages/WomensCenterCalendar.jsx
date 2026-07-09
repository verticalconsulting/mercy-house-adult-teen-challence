import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, Users, Clock, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '../utils';
import { format } from 'date-fns';

export default function WomensCenterCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.functions.invoke('getWomensCenterCalendar')
      .then(res => {
        setEvents(res.data?.events || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.response?.data?.error || 'Unable to load events');
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1522211987412-29c4e3a2e3e3?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Women's Center</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Volunteer &amp; Events Calendar</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See upcoming opportunities at our Women's Center and the volunteers committed to each.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <p className="text-center text-slate-500 dark:text-slate-400 text-lg py-12">Loading events…</p>
          ) : error ? (
            <p className="text-center text-red-600 text-lg py-12">{error}</p>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500 dark:text-slate-400">No upcoming events scheduled. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map(e => (
                <div key={e.id} className="border-l-4 border-gold rounded-r-xl bg-slate-50 dark:bg-slate-700 p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">{e.title}</h2>
                      <div className="space-y-1 text-slate-600 dark:text-slate-300">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold" />
                          {format(new Date(e.event_date), 'EEEE, MMM dd, yyyy · h:mm a')}
                        </p>
                        {e.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold" />
                            {e.location}
                          </p>
                        )}
                      </div>
                      {e.description && (
                        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{e.description}</p>
                      )}
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <Badge className="bg-navy text-white">
                          <Users className="w-4 h-4 mr-1" />
                          {e.volunteer_count} volunteer{e.volunteer_count !== 1 ? 's' : ''}
                        </Badge>
                        {e.volunteer_count > 0 && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Coming: {e.volunteer_first_names.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:w-48 flex md:flex-col gap-2">
                      <Link to={createPageUrl('Volunteer')} className="flex-1">
                        <Button className="w-full bg-gold text-navy font-semibold hover:bg-gold/90">
                          <Heart className="w-4 h-4 mr-2" /> Volunteer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-lg">Want to serve with us? Apply to volunteer today.</p>
            <Link to={createPageUrl('Volunteer')}>
              <Button size="lg" className="bg-navy text-white hover:bg-navy/90 dark:bg-navy dark:hover:bg-navy/90 text-lg px-8 py-5">
                Apply to Volunteer <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}