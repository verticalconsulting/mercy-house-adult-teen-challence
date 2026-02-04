import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId
  });

  const categoryColors = {
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    event: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    success_story: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    announcement: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">Post Not Found</h1>
          <Link to={createPageUrl('Blog')}>
            <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Featured Image */}
      {post.featured_image && (
        <div className="h-[60vh] overflow-hidden relative">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl('Blog')}>
            <Button variant="ghost" className="mb-6 text-navy dark:text-gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News & Events
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Badge className={categoryColors[post.category] || categoryColors.news}>
              <Tag className="w-3 h-3 mr-1" />
              {post.category?.replace('_', ' ')}
            </Badge>
            {post.publish_date && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publish_date), 'MMMM d, yyyy')}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-8">
            {post.title}
          </h1>

          {post.event_date && (
            <div className="bg-gold/10 border-l-4 border-gold p-4 rounded mb-8">
              <p className="text-navy dark:text-gold font-semibold">
                📅 Event Date: {format(new Date(post.event_date), 'MMMM d, yyyy')}
              </p>
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}