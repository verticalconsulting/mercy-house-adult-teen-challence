import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Quote, ArrowLeft } from 'lucide-react';
import { useShareMeta } from '@/hooks/useShareMeta';

/**
 * A single graduate's story at /testimonies/:slug.
 *
 * `consent_confirmed: true` is part of the *query filter*, not a render-time
 * guard: a story whose consent has not been recorded must be unfetchable by
 * this page, not merely hidden by it. Revoking consent in the portal takes
 * the page down on the next load.
 */
export default function TestimonyPage() {
  const { slug } = useParams();

  const { data: story, isLoading } = useQuery({
    queryKey: ['testimony', slug],
    queryFn: async () => {
      const rows = await base44.entities.Testimonial.filter(
        { slug, published: true, consent_confirmed: true },
        '-created_date',
        1
      );
      return rows?.[0] || null;
    },
    enabled: !!slug,
  });

  // useShareMeta appends the " | Mercy House Adult Teen Challenge" suffix
  // itself, so the title passed here is the bare story name.
  //
  // When no consented record loads we must actively publish a noindex, not
  // simply stay quiet. These five paths have hand-written entries in
  // `pageSeo` naming the graduate, and SeoManager has already applied them by
  // the time this runs. Staying quiet would leave a 200 response titled
  // "Van Pope's Story", described with his addiction history, and marked
  // index,follow — over a body that says the story is unavailable. Revoking
  // consent has to remove the person from the index, not just from the page.
  const found = Boolean(story);
  useShareMeta({
    title: found ? `${story.graduate_name}'s Story` : 'Story Not Found',
    description: found
      ? (story.description || story.testimonial_text || '').slice(0, 160)
      : 'This graduate story is not available.',
    path: `/testimonies/${slug}`,
    image: found ? story.photo_url : undefined,
    noindex: !found,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <span className="text-slate-400">Loading story&hellip;</span>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-navy dark:text-gold mb-4">Story Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            This story isn&rsquo;t available. Read the other graduate testimonies instead.
          </p>
          <Link to="/testimonies" className="text-navy dark:text-gold font-semibold hover:underline">
            Back to all testimonies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/testimonies"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All testimonies
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">
          {story.graduate_name}&rsquo;s Story
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {story.program_type === 'womens' ? "Women's Campus" : "Men's Campus"}
          {story.graduation_year ? ` · Class of ${story.graduation_year}` : ''}
        </p>

        {story.photo_url && (
          <img
            src={story.photo_url}
            alt={`${story.graduate_name}, a graduate of Mercy House Adult & Teen Challenge`}
            className="w-full rounded-2xl mb-8 object-cover"
            loading="eager"
          />
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-l-4 border-gold">
          <Quote className="w-10 h-10 text-gold mb-4" aria-hidden="true" />
          <blockquote className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {story.testimonial_text}
          </blockquote>
        </div>

        {story.description && (
          <div className="mt-8 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {story.description}
          </div>
        )}

        <div className="mt-12 bg-navy dark:bg-slate-950 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Your story can start today</h2>
          <p className="text-slate-300 mb-6">
            Mercy House Adult &amp; Teen Challenge has walked with men and women out of addiction for
            over 15 years. Admissions are open.
          </p>
          <Link
            to="/get-help-now"
            className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Get help now
          </Link>
        </div>
      </div>
    </article>
  );
}
