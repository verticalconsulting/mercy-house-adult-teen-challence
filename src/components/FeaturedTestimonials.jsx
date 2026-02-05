import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';

export default function FeaturedTestimonials() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ featured: true, published: true }, '-created_date', 3),
    initialData: []
  });

  if (testimonials.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-lg"
        >
          <Quote className="w-8 h-8 text-gold mb-4" />
          <p className="text-base md:text-base text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
            "{testimonial.testimonial_text.slice(0, 200)}{testimonial.testimonial_text.length > 200 ? '...' : ''}"
          </p>
          <div className="flex items-center gap-3">
            {testimonial.photo_url && (
              <img
                src={testimonial.photo_url}
                alt={testimonial.graduate_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-bold text-navy dark:text-gold">
                {testimonial.graduate_name}
              </p>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                Class of {testimonial.graduation_year}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}