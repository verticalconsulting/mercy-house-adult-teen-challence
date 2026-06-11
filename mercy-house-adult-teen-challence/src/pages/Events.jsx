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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'blog'
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ published: true }, 'event_date'),
    initialData: []
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ published: true }, '-publish_date'),
    initialData: []
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    await queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
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

  const categoryLabels = {
    workshop: 'Workshop', outreach: 'Outreach', community_event: 'Community Event',
    fundraiser: 'Fundraiser', service: 'Service', other: 'Other'
  };
  const blogCategoryColors = {
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    event: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    success_story: 'bg-gold/20 text-yellow-800 dark:text-gold',
    announcement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-4xl font-bold text-navy dark:text-gold mb-4">
            News & Events
          </h1>
          <p className="text-xl md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Stay connected — upcoming programs, community events, and stories from our ministry
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-slate-800 rounded-xl p-1.5 max-w-xs mx-auto shadow">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'events' ? 'bg-navy text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />Events
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'blog' ? 'bg-navy text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Newspaper className="w-4 h-4" />Blog
          </button>
        </div>

        {/* ===== EVENTS TAB ===== */}
        {activeTab === 'events' && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <MobileSelect value={categoryFilter} onValueChange={setCategoryFilter} placeholder="All Categories" triggerClassName="w-full sm:w-64">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
                <SelectItem value="outreach">Outreach Programs</SelectItem>
                <SelectItem value="community_event">Community Events</SelectItem>
                <SelectItem value="fundraiser">Fundraisers</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </MobileSelect>
              <MobileSelect value={dateFilter} onValueChange={setDateFilter} placeholder="Upcoming Events" triggerClassName="w-full sm:w-64">
                <SelectItem value="upcoming">Upcoming Events</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
                <SelectItem value="all">All Events</SelectItem>
              </MobileSelect>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold mx-auto"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-500 dark:text-slate-400">No events found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    {event.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={categoryColors[event.category]}>{categoryLabels[event.category] || event.category}</Badge>
                        {event.registration_required && <Badge variant="outline" className="text-sm">Registration Required</Badge>}
                      </div>
                      <CardTitle className="text-navy dark:text-gold">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm mt-2">
                        <Calendar className="w-4 h-4" />{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />{format(new Date(event.event_date), 'h:mm a')}{event.end_date && ` – ${format(new Date(event.end_date), 'h:mm a')}`}
                      </CardDescription>
                      {event.location && (
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />{event.location}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm line-clamp-3">{event.description}</p>
                      {event.registration_link && (
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                            Register Now <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== BLOG TAB ===== */}
        {activeTab === 'blog' && (
          <>
            {blogLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold mx-auto"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-500 dark:text-slate-400">No posts yet — check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setSelectedEvent({ ...post, _type: 'blog' })}>
                    {post.featured_image && (
                      <div className="h-48 overflow-hidden">
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={blogCategoryColors[post.category] || 'bg-gray-100 text-gray-800'}>
                          {post.category?.replace('_', ' ')}
                        </Badge>
                        {post.publish_date && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {format(new Date(post.publish_date), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-navy dark:text-gold line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">{post.excerpt || post.content?.slice(0, 150)}</p>
                      <Button variant="ghost" className="mt-3 p-0 h-auto text-navy dark:text-gold font-semibold text-sm hover:underline">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        </div>

        {/* Event Detail Dialog */}
        {selectedEvent && !selectedEvent._type && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <Badge className={`w-fit mb-2 ${categoryColors[selectedEvent.category]}`}>{categoryLabels[selectedEvent.category]}</Badge>
                <DialogTitle className="text-navy dark:text-gold text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              {selectedEvent.image_url && <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-lg" />}
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" />{format(new Date(selectedEvent.event_date), 'EEEE, MMMM d, yyyy')}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" />{format(new Date(selectedEvent.event_date), 'h:mm a')}{selectedEvent.end_date && ` – ${format(new Date(selectedEvent.end_date), 'h:mm a')}`}</div>
                {selectedEvent.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" />{selectedEvent.location}</div>}
                {selectedEvent.capacity && <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gold" />Capacity: {selectedEvent.capacity}</div>}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{selectedEvent.description}</p>
              {selectedEvent.registration_link && (
                <a href={selectedEvent.registration_link} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-navy dark:bg-gold text-white dark:text-navy">Register Now <ExternalLink className="w-4 h-4 ml-2" /></Button>
                </a>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Blog Post Detail Dialog */}
        {selectedEvent && selectedEvent._type === 'blog' && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={blogCategoryColors[selectedEvent.category] || 'bg-gray-100 text-gray-800'}>
                    {selectedEvent.category?.replace('_', ' ')}
                  </Badge>
                  {selectedEvent.publish_date && (
                    <span className="text-xs text-slate-500">{format(new Date(selectedEvent.publish_date), 'MMMM d, yyyy')}</span>
                  )}
                </div>
                <DialogTitle className="text-navy dark:text-gold text-xl leading-snug">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              {selectedEvent.featured_image && (
                <img src={selectedEvent.featured_image} alt={selectedEvent.title} className="w-full h-52 object-cover rounded-lg" />
              )}
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedEvent.content}</ReactMarkdown>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PullToRefresh>
  );
}