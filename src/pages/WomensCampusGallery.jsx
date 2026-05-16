import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Image, Video, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getEmbedUrl(url) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Already an embed URL
  return url;
}

function MediaCard({ item, onClick }) {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
      onClick={() => onClick(item)}
    >
      {item.media_type === 'photo' ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.media_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 rounded-full p-1.5">
            <Image className="w-4 h-4 text-navy dark:text-gold" />
          </div>
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-gold/80 transition-colors duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 rounded-full p-1.5">
            <Video className="w-4 h-4 text-navy dark:text-gold" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-4 left-4 text-white text-sm font-medium">{item.title}</p>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-navy dark:text-gold">{item.title}</h3>
        {item.event_date && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {new Date(item.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        {item.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}

function LightboxModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <div
        className="max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === 'photo' ? (
          <img src={item.media_url} alt={item.title} className="w-full rounded-xl max-h-[80vh] object-contain" />
        ) : (
          <div className="aspect-video w-full rounded-xl overflow-hidden">
            <iframe
              src={getEmbedUrl(item.media_url)}
              className="w-full h-full"
              allowFullScreen
              title={item.title}
            />
          </div>
        )}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.event_date && (
            <p className="text-slate-300 text-sm mt-1">
              {new Date(item.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {item.description && <p className="text-slate-300 mt-2">{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function WomensCampusGallery() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['womensCampusMedia'],
    queryFn: () => base44.entities.WomensCampusMedia.filter({ published: true }, '-event_date'),
  });

  const filtered = filter === 'all' ? media : media.filter((m) => m.media_type === filter);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/bafdf70d4_lukayak.jpg"
            alt="Women's Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 dark:from-slate-900/95 dark:to-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Women's Campus Gallery</h1>
          <p className="text-xl text-slate-200">Recent events, milestones, and moments of transformation</p>
        </div>
      </section>

      {/* Back link + Filters */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/WomensCampus"
            className="inline-flex items-center gap-2 text-navy dark:text-gold font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Women's Campus
          </Link>
          <div className="flex gap-2">
            {['all', 'photo', 'video'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? 'bg-navy text-white dark:bg-gold dark:text-navy' : ''}
              >
                {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎥 Videos'}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-white dark:bg-slate-800 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              <p className="text-xl">No media has been added yet.</p>
              <p className="mt-2 text-sm">Check back soon for photos and videos from our women's campus events!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <MediaCard key={item.id} item={item} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <LightboxModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}