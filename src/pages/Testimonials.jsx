import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Quote } from 'lucide-react';
import PullToRefresh from '../components/PullToRefresh';

export default function Testimonials() {
  const queryClient = useQueryClient();
  
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ published: true }, '-created_date'),
    initialData: []
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
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
          <div className="flex justify-center mb-4">
            <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/f6447f59c_Guyincar.webp"
              alt="Mercy House alumnus giving a thumbs up in his work van"
              className="rounded-2xl shadow-lg max-w-md w-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mb-6">
            Staying successful!
          </p>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            It&rsquo;s good to see our alumni out working and staying successful! The hard work begins when they graduate and have to live out the life they learned while with us! Keep him in your prayers and thank you everyone for the support in helping guys like him succeed! 🙌🏻🙏🙏 We want to instill in our men the value of family and becoming the man God created them to be. A lot of healing has to take place but we love seeing families being restored! 🙌🏻🙏
          </p>
          <p className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mt-10 mb-4">
            A Life Restored!
          </p>
          <div className="flex justify-center mb-4">
            <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/e2e2a34d1_Billyrehab.webp"
              alt="Mercy House graduate Billy enjoying time outdoors with his children"
              className="rounded-2xl shadow-lg max-w-md w-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            We love seeing photos of our graduates! Billy&rsquo;s life has been restored, and he now gets to enjoy making memories with his children! 🙌🏻🇺🇸❤️🙌🏾 We&rsquo;re proud of you, Billy!
          </p>
          <p className="text-2xl md:text-3xl font-bold text-navy dark:text-gold mt-10 mb-4">
            What restoration looks like!
          </p>
          <div className="flex justify-center mb-4">
            <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/2f423746b_churchpraiserehab.webp"
              alt="A mother and daughter worshipping together at a Mercy House church service"
              className="rounded-2xl shadow-lg max-w-md w-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            Look at this precious little girl raising her little hand in worship of Jesus with her mom in church. What you may not know is right beside them is the little girl&rsquo;s dad who graduated from Mercy House Adult &amp; Teen Challenge in 2018. Chris and Ashley were married after his graduation and are raising their children to love Jesus. This is what restoration looks like &ndash; completely turning a family line around. ❤️
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


      </div>
      </div>
    </PullToRefresh>
  );
}