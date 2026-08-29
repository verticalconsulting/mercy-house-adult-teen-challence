import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const blogCategoryColors = {
  news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  event: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  success_story: 'bg-gold/20 text-yellow-800 dark:bg-gold/10 dark:text-gold',
  announcement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const results = await base44.entities.BlogPost.filter({ slug, published: true }, '-publish_date', 1);
      if (results[0]) return results[0];
      // Fallback: param may be an id for posts without a slug
      try {
        return await base44.entities.BlogPost.get(slug);
      } catch {
        return null;
      }
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">Post Not Found</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          The story you're looking for may have been moved or is no longer available.
        </p>
        <Button onClick={() => navigate('/Events')} className="bg-navy dark:bg-gold text-white dark:text-navy">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to News & Events
        </Button>
      </div>
    );
  }

  return (
    <article className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/Events"
            className="inline-flex items-center gap-2 text-slate-200 hover:text-gold transition-colors mb-6 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News & Events
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={blogCategoryColors[post.category] || 'bg-gray-100 text-gray-800'}>
              <Tag className="w-3 h-3 mr-1" />
              {post.category?.replace('_', ' ')}
            </Badge>
            {post.publish_date && (
              <span className="flex items-center gap-1.5 text-sm text-slate-200">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publish_date), 'MMMM d, yyyy')}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg md:text-xl text-slate-200 leading-relaxed">{post.excerpt}</p>}
        </div>
      </section>

      {/* Featured image */}
      {post.featured_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      )}

      {/* Body */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="blog-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to="/Events">
              <Button
                variant="outline"
                className="border-navy text-navy dark:border-gold dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy"
              >
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
      </section>
    </article>
  );
}