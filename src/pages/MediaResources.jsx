import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon, Video, X, Calendar, Tag, Eye } from 'lucide-react';

const categoryLabels = {
  general: 'General',
  outreach: 'Outreach',
  fundraiser: 'Fundraiser',
  graduation: 'Graduation',
  service: 'Service',
  community_event: 'Community Event',
  other: 'Other'
};

function getEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default function MediaResources() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['mediaResources'],
    queryFn: () => base44.entities.MediaResource.list('-created_date', 100),
    initialData: []
  });

  const filtered = items.filter((i) => filter === 'all' ? true : i.media_type === filter);

  const openLightbox = (item) => {
    setLightbox({
      ...item,
      embedUrl: getEmbedUrl(item.media_url)
    });
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-950 py-20 text-center text-white">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult &amp; Teen Challenge</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Media Resources</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          A visual gallery of God's work through our community — events, outreaches, graduations, and moments of life change.
        </p>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', icon: Eye },
            { key: 'photo', label: 'Photos', icon: ImageIcon },
            { key: 'video', label: 'Videos', icon: Video }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === f.key ? 'bg-navy dark:bg-gold text-white dark:text-navy' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-gold'}`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="text-center text-slate-500 py-20">Loading media…</div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-slate-500 dark:text-slate-400 py-20">
              No media available right now. Please check back soon.
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => {
              const embed = getEmbedUrl(item.media_url);
              const isVideo = item.media_type === 'video';
              return (
                <button
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {isVideo ? (
                    embed ? (
                      <iframe src={embed} title={item.title} className="w-full h-full pointer-events-none" loading="lazy" />
                    ) : (
                      <video src={item.media_url} className="w-full h-full object-cover" muted />
                    )
                  ) : (
                    <img src={item.media_url} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="text-left text-white">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</p>
                      {item.event_date && <p className="text-xs text-slate-300">{new Date(item.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                    </div>
                  </div>
                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.media_type === 'video' ? (
              lightbox.embedUrl ? (
                <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
                  <iframe src={lightbox.embedUrl} title={lightbox.title} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
                </div>
              ) : (
                <video src={lightbox.media_url} controls className="w-full max-h-[70vh] rounded-lg" />
              )
            ) : (
              <img src={lightbox.media_url} alt={lightbox.title} className="w-full max-h-[70vh] object-contain rounded-lg" />
            )}
            <div className="mt-4 text-white">
              <h2 className="text-xl font-bold">{lightbox.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300 mt-1">
                {lightbox.event_name && <span><Tag className="w-4 h-4 inline mr-1" />{lightbox.event_name}</span>}
                {lightbox.event_date && <span><Calendar className="w-4 h-4 inline mr-1" />{new Date(lightbox.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                {lightbox.category && <span className="text-gold">{categoryLabels[lightbox.category]}</span>}
              </div>
              {lightbox.description && <p className="text-slate-300 mt-2 text-sm leading-relaxed">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}