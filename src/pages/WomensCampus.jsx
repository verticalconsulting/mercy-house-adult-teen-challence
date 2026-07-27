import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Heart, Users, BookOpen, Briefcase, Home, ArrowRight, Image, Video, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BedCountDisplay from '../components/BedCountDisplay';
import DonateButton from '../components/DonateButton';
import VirtuousGiveForm from '../components/VirtuousGiveForm';

// Virtuous form designated for Women's Center giving.
const MERCYHOUSE_WOMENS_CENTER_FORM_ID = '47F00F09-AB05-4CC6-960E-2688C20CFFA4';

function getEmbedUrl(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
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
          <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
        {item.description && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{item.description}</p>}
      </div>
    </div>
  );
}

function LightboxModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:text-gold transition-colors" onClick={onClose}>
        <X className="w-8 h-8" />
      </button>
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {item.media_type === 'photo' ? (
          <img src={item.media_url} alt={item.title} className="w-full rounded-xl max-h-[80vh] object-contain" />
        ) : (
          <div className="aspect-video w-full rounded-xl overflow-hidden">
            <iframe src={getEmbedUrl(item.media_url)} className="w-full h-full" allowFullScreen title={item.title} />
          </div>
        )}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.event_date && <p className="text-slate-300 text-sm mt-1">{new Date(item.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
          {item.description && <p className="text-slate-300 mt-2">{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function WomensCampus() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const { data: bedCounts } = useQuery({
    queryKey: ['bedCounts'],
    queryFn: () => base44.entities.BedCount.list(),
    initialData: []
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery({
    queryKey: ['womensCampusMedia'],
    queryFn: () => base44.entities.WomensCampusMedia.filter({ published: true }, '-event_date'),
  });

  const womensBedData = bedCounts.find((bc) => bc.program_type === 'womens');

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/bafdf70d4_lukayak.jpg"
            alt="Women's Campus"
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager" />

          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/60 dark:from-slate-900/95 dark:to-slate-900/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Women's Campus
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
            A sanctuary for healing, growth, and transformation
          </p>
        </div>
      </section>

      {/* Bed Count */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BedCountDisplay bedData={womensBedData} programName="Women's Campus" />
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                A Safe Place to Heal
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                At Mercy House, our women's campus team is here to walk with you every step of your recovery journey. Our heart is to see you experience true healing and lasting freedom in Christ.
              </p>
              <p className="italic text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                "He heals the brokenhearted and binds up their wounds." – Psalm 147:3
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                You don't have to walk this road alone. The Lord is near, and we would be honored to come alongside you as He restores and renews.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                We currently have space available and would love to welcome you into a safe, supportive environment of healing and hope. If you or someone you love needs support, please reach out—we're here for you.
              </p>
              <div className="flex gap-4">
                <Link to={createPageUrl('IntakeForm')}>
                  <Button className="bg-slate-500 text-white px-4 py-2 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 dark:text-navy">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <DonateButton />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
               <img
                  src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/257a28bc5_baptist.jpg"
                  alt="Women supporting each other"
                  className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Program Components
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            {
              icon: Heart,
              title: 'Spiritual Development',
              description: 'Biblical principles and faith-based counseling to address root causes',
              image: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/7b0c88056_generated_image.png'
            },
            {
              icon: Users,
              title: 'Group Support',
              description: 'Peer support groups and mentorship from women who understand your journey',
              image: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/6af431044_generated_image.png'
            },
            {
              icon: BookOpen,
              title: 'Education',
              description: 'GED preparation, life skills training, and personal development courses',
              image: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/93a99a3ee_generated_image.png'
            },
            {
              icon: Briefcase,
              title: 'Job Training',
              description: 'Vocational skills through our micro businesses and career development',
              image: 'https://media.base44.com/images/public/6983b4b00291b5dfd8507106/a3000b313_generated_image.png'
            }].
            map((feature, idx) =>
            <div
              key={idx}
              className="relative overflow-hidden bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              
              <div className="absolute inset-0 z-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              </div>

                <div className="relative z-10">
                  <feature.icon className="w-12 h-12 text-gold mb-4" />
                  <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            What to Expect
          </h2>
          
          <div className="space-y-6">
            {[
            {
              phase: 'Phase 1: Foundation (Months 1-3)',
              description: 'Detox support, orientation to program structure, establishing healthy routines, and beginning spiritual development'
            },
            {
              phase: 'Phase 2: Growth (Months 4-6)',
              description: 'Deep dive into biblical teaching, life skills classes, trauma counseling, and beginning work therapy'
            },
            {
              phase: 'Phase 3: Development (Months 7-9)',
              description: 'Advanced job training, leadership opportunities, financial literacy, and independent living preparation'
            },
            {
              phase: 'Phase 4: Transition (Months 10-12)',
              description: 'Job placement assistance, housing support, aftercare planning, and continued mentorship'
            }].
            map((item, idx) =>
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border-l-4 border-gold">

                <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">
                  {item.phase}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Five Foundations of Freedom */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-navy dark:text-gold mb-12">
            Five Foundations of Freedom
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Spiritual Foundation',
                description: 'Faith-based principles to guide recovery and purpose'
              },
              {
                title: 'Mental Health',
                description: 'Trauma-informed counseling and emotional wellness'
              },
              {
                title: 'Physical Wellness',
                description: 'Health, nutrition, and fitness for whole-person recovery'
              },
              {
                title: 'Educational Growth',
                description: 'GED preparation and life skills development'
              },
              {
                title: 'Vocational Skills',
                description: 'Job training and career development pathways'
              }
            ].map((foundation, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-navy dark:text-gold mb-3">
                  {foundation.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {foundation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Recent Events & Moments</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              See what life looks like on our women's campus — celebrations, milestones, and everyday moments of healing.
            </p>
          </div>
          {mediaLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p>Photos and videos from our campus events will appear here soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <MediaCard key={item.id} item={item} onClick={setSelectedMedia} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/WomensCampusGallery">
              <Button variant="outline" className="border-navy text-navy dark:border-gold dark:text-gold font-semibold px-8 py-4 text-lg">
                View Full Gallery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <LightboxModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />

      {/* Give to the Women's Center */}
      <section id="give-womens-center" className="py-20 bg-slate-50 dark:bg-slate-900 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-blush mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">Give to the Women's Center</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Your gift goes directly to the women's campus — housing, meals, counseling, and Christ-centered care for every woman walking through our doors.
            </p>
          </div>
          <VirtuousGiveForm formId={MERCYHOUSE_WOMENS_CENTER_FORM_ID} />
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
            🔒 Secure checkout · Tax-deductible · EIN 27-4670832
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 text-slate-200">
            Take the first step toward healing and transformation today.
          </p>
          <Link to={createPageUrl('IntakeForm')}>
            <Button className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-6 text-lg shadow-xl">
              Complete Intake Form
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}