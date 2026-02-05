import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ published: true }, '-created_date'),
    initialData: []
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <Quote className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-gold mb-4">
            Stories of Transformation
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Hear from graduates whose lives have been forever changed through faith, community, and perseverance.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold mb-4" />
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                "{testimonial.testimonial_text}"
              </p>
              <div className="flex items-center gap-4">
                {testimonial.photo_url && (
                  <img
                    src={testimonial.photo_url}
                    alt={testimonial.graduate_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-navy dark:text-gold text-lg">
                    {testimonial.graduate_name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.program_type === 'mens' ? "Men's" : "Women's"} Campus Graduate • Class of {testimonial.graduation_year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">Loading testimonials...</div>
        )}

        {!isLoading && testimonials.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            No testimonials available yet.
          </div>
        )}
      </div>
    </div>
  );
}