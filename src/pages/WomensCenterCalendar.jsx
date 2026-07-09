import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MapPin, Users, Clock, ArrowRight, Heart, CalendarDays, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '../utils';
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import MonthCalendar from '@/components/volunteer/MonthCalendar';

export default function WomensCenterCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async (month, showLoading = true) => {
    if (showLoading) setLoading(true);
    const gridStart = startOfWeek(new Date(month.getFullYear(), month.getMonth(), 1));
    const gridEnd = endOfWeek(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    try {
      const res = await base44.functions.invoke('getWomensCenterCalendar', {
        timeMin: gridStart.toISOString(),
        timeMax: addDays(gridEnd, 1).toISOString()
      });
      setEvents(res.data?.events || []);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.error || 'Unable to load calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(currentMonth); }, [currentMonth]);

  const selectedDayEvents = useMemo(() => {
    return events
      .filter((e) => e.start && isSameDay(new Date(e.start), selectedDate))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [events, selectedDate]);

  // Upcoming events across the whole fetched window (for the list below the calendar)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.start && new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 6);
  }, [events]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-16 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/60d31fe5-e36f-4f89-20a1-faacd6810100/herobanner"
            alt="Mercy House Women's Center volunteers serving together"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Women's Center</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Volunteer Calendar</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upcoming volunteer needs synced live from our Google Calendar. Tap a day to see what's needed and who's committed.
          </p>
        </div>
      </section>

      {/* Calendar */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Month grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gold" /> Synced from Google Calendar
                </p>
                <Button variant="ghost" size="sm" onClick={() => fetchEvents(currentMonth)} disabled={loading} aria-label="Refresh calendar">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              {loading && events.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <MonthCalendar
                  events={events}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              )}
            </div>

            {/* Selected day panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-1">
                  {format(selectedDate, 'EEEE')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{format(selectedDate, 'MMMM d, yyyy')}</p>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400">No volunteer needs scheduled for this day.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedDayEvents.map((e) => (
                      <div key={e.id} className="border-l-4 border-gold pl-3">
                        <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{e.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-gold" />
                          {e.all_day ? 'All day' : format(new Date(e.start), 'h:mm a')}
                        </p>
                        {e.location && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-4 h-4 text-gold" /> {e.location}
                          </p>
                        )}
                        {e.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{e.description}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-navy dark:text-gold bg-navy/10 dark:bg-gold/10 px-2 py-0.5 rounded">
                            <Users className="w-3.5 h-3.5" />
                            {e.volunteer_count} volunteer{e.volunteer_count !== 1 ? 's' : ''}
                          </span>
                          {e.volunteer_count > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {e.volunteer_first_names.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-slate-600 dark:text-slate-300 mb-3 text-sm">Want to help at one of these?</p>
                  <Link to={createPageUrl('Volunteer')}>
                    <Button className="w-full bg-gold text-navy font-semibold hover:bg-gold/90">
                      <Heart className="w-4 h-4 mr-2" /> Apply to Volunteer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming list (below grid) */}
          {upcomingEvents.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-6">Upcoming Volunteer Needs</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-5 border-t-4 border-gold">
                    <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{e.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-2">
                      <Clock className="w-4 h-4 text-gold" />
                      {format(new Date(e.start), 'EEE, MMM d · h:mm a')}
                    </p>
                    {e.location && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-gold" /> {e.location}
                      </p>
                    )}
                    <p className="text-sm text-navy dark:text-gold font-medium mt-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> {e.volunteer_count} committed
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to={createPageUrl('Volunteer')}>
                  <Button size="lg" className="bg-navy text-white hover:bg-navy/90 text-lg px-8 py-5">
                    Apply to Volunteer <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}