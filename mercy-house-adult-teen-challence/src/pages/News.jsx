import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PullToRefresh from '../components/PullToRefresh';

export default function News() {
  const queryClient = useQueryClient();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['newsPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ published: true }, '-publish_date', 50),
    initialData: []
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['newsPosts'] });
  };

  const categoryColors = {
    news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    event: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    success_story: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    announcement: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            News & Events
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Stay updated with the latest news, events, and success stories from Mercy House
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy dark:border-gold mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 dark:text-slate-400">
                No posts available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={createPageUrl(`BlogPost?id=${post.id}`)}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {post.featured_image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={categoryColors[post.category] || categoryColors.news}>
                        <Tag className="w-3 h-3 mr-1" />
                        {post.category?.replace('_', ' ')}
                      </Badge>
                      {post.publish_date && (
                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.publish_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-navy dark:text-gold mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-navy dark:text-gold font-semibold">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </PullToRefresh>
  );
}