import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Quote, Facebook, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(null);

  const fetchStories = async () => {
    try {
      const res = await base44.entities.Testimonial.filter({
        program_type: 'womens',
        published: true
      }, '-created_date', 6);
      setStories(res || []);
    } catch (e) {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const handleShare = async (story) => {
    setSharing(story.id);
    try {
      const res = await base44.functions.invoke('shareStoryToFacebook', { testimonial_id: story.id });
      if (res.data?.success) {
        toast.success('Success story shared to Facebook!');
        fetchStories();
      } else if (res.data?.skipped) {
        toast.info(res.data.reason || 'Story skipped');
      } else {
        toast.error(res.data?.error || 'Failed to share');
      }
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Failed to share to Facebook');
    } finally {
      setSharing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-2 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> Lives Transformed
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-3">
            Volunteer Success Stories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Real stories from the women whose lives have been changed through Mercy House, automatically shared with our Facebook community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
            >
              {story.photo_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={story.photo_url}
                    alt={story.graduate_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <Quote className="w-8 h-8 text-gold/40 mb-3" />
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed flex-1 line-clamp-4">
                  {story.testimonial_text}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="font-semibold text-navy dark:text-gold">{story.graduate_name}</p>
                  {story.graduation_year && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Graduated {story.graduation_year}</p>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {story.shared_to_facebook ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      <Facebook className="w-4 h-4" /> Shared to Facebook
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(story)}
                      disabled={sharing === story.id}
                      className="text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {sharing === story.id ? (
                        <><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> Sharing...</>
                      ) : (
                        <><Share2 className="w-4 h-4" /> Share to Facebook</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}