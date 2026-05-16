import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Calendar, Users, Mail, Trophy, Flag, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FreedomClassic() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1920&q=80"
            alt="Golf course"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/2abf977fd_freedom-golf.png"
              alt="Freedom Golf Classic — Mercy House Adult & Teen Challenge"
              className="h-48 md:h-64 w-auto object-contain bg-white rounded-2xl px-6 py-4 shadow-2xl"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            12th Annual Freedom Classic
          </h1>
          <p className="text-2xl text-gold font-semibold mb-2">Golf Tournament</p>
          <p className="text-xl text-slate-300 mb-8">Monday, October 19, 2026</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:khardin@mercyhouseatc.com">
              <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl">
                <Trophy className="mr-2 w-5 h-5" />
                Register Your Team
              </Button>
            </a>
            <a href="mailto:info@mercyhouseatc.com">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-6 text-lg font-semibold">
                <Mail className="mr-2 w-5 h-5" />
                Sponsorship Inquiry
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key Details Strip */}
      <section className="bg-gold py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-navy text-center">
          <div className="flex items-center justify-center gap-2 font-semibold text-lg">
            <Calendar className="w-5 h-5" />
            Monday, October 19, 2026
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold text-lg">
            <Flag className="w-5 h-5" />
            Four Person Scramble
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold text-lg">
            <MapPin className="w-5 h-5" />
            Madison, Mississippi
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left Column */}
            <div className="space-y-8">
              {/* Event Details */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Event Details
                </h2>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <div>
                    <p className="font-semibold text-navy dark:text-gold">Date</p>
                    <p>Monday, October 19, 2026</p>
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-gold">Format</p>
                    <p>Four Person Scramble</p>
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-gold">Schedule</p>
                    <p className="italic text-slate-500 dark:text-slate-400">Schedule of Events: TBD</p>
                  </div>
                </div>
              </div>

              {/* Registration Cost */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Registration
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Foursome</p>
                      <p className="text-sm text-slate-500">Four players, one team entry</p>
                    </div>
                    <span className="text-2xl font-bold text-navy dark:text-gold">TBD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Individual</p>
                      <p className="text-sm text-slate-500">Single player entry</p>
                    </div>
                    <span className="text-2xl font-bold text-navy dark:text-gold">TBD</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a href="mailto:khardin@mercyhouseatc.com">
                    <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-bold py-4 text-lg">
                      Register Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Venues */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Venues
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-gold pl-4">
                    <p className="font-bold text-lg text-navy dark:text-white">Annandale Golf Club</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      100 Annandale Golf Club Drive<br />
                      Madison, MS 39110
                    </p>
                    <a
                      href="https://maps.google.com/?q=100+Annandale+Golf+Club+Drive+Madison+MS+39110"
                      className="inline-block mt-2 text-sm text-navy dark:text-gold font-medium hover:underline"
                    >
                      Get Directions →
                    </a>
                  </div>
                  <div className="border-l-4 border-navy dark:border-gold pl-4">
                    <p className="font-bold text-lg text-navy dark:text-white">Reunion Golf & Country Club</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      150 Greensward Dr<br />
                      Madison, MS 39110
                    </p>
                    <a
                      href="https://maps.google.com/?q=150+Greensward+Dr+Madison+MS+39110"
                      className="inline-block mt-2 text-sm text-navy dark:text-gold font-medium hover:underline"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>

              {/* Sponsorship */}
              <div className="bg-navy dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Sponsorship Opportunities
                </h2>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  Sponsoring the Freedom Classic is a powerful way to support men and women on their journey to freedom from addiction. Your sponsorship directly funds Mercy House's life-changing programs.
                </p>
                <p className="text-slate-300 mb-6">Sponsorship packages available — contact us for details.</p>
                <a href="mailto:info@mercyhouseatc.com">
                  <Button className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-3 text-base">
                    Inquire About Sponsorship
                  </Button>
                </a>
              </div>

              {/* Questions */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Questions?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Reach out to our team and we'll be happy to help.</p>
                <div className="space-y-2">
                  <a href="mailto:info@mercyhouseatc.com" className="block text-navy dark:text-gold font-medium hover:underline">
                    info@mercyhouseatc.com
                  </a>
                  <a href="mailto:khardin@mercyhouseatc.com" className="block text-navy dark:text-gold font-medium hover:underline">
                    khardin@mercyhouseatc.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-gold mb-4">Play Golf. Change Lives.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Every swing you take supports men and women finding freedom from life-controlling addiction. 
            100% of individual donations go directly to Mercy House's mission of faith-based recovery.
          </p>
          <Link to={createPageUrl('Donate')}>
            <Button variant="outline" className="border-2 border-navy dark:border-gold text-navy dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy px-8 py-4 text-lg font-semibold">
              Support the Mission
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}