import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';

/**
 * /freedom-gala — the annual fundraising banquet.
 *
 * Listed in the canonical URL map but never built, so the URL 404ed. The
 * prose below is the ministry's standing description of the event; the dated
 * details are isolated in EVENT_DETAILS so they can be updated each year
 * without touching the copy.
 */
const EVENT_DETAILS = {
  // Owner: replace with the confirmed date and venue before promoting this URL.
  date: 'Details for the next Freedom Gala will be announced soon.',
  venue: 'Georgetown, Mississippi',
};

export default function FreedomGala() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-navy dark:bg-slate-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Freedom Gala</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            An evening celebrating the men and women who have found freedom from addiction — and
            funding the next year of Christ-centered residential recovery at Mercy House.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            <Calendar className="w-8 h-8 text-gold mb-3" aria-hidden="true" />
            <h2 className="font-bold text-navy dark:text-gold mb-2">When</h2>
            <p className="text-slate-600 dark:text-slate-300">{EVENT_DETAILS.date}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            <MapPin className="w-8 h-8 text-gold mb-3" aria-hidden="true" />
            <h2 className="font-bold text-navy dark:text-gold mb-2">Where</h2>
            <p className="text-slate-600 dark:text-slate-300">{EVENT_DETAILS.venue}</p>
          </div>
        </div>

        <div className="max-w-none mb-12">
          <h2 className="text-2xl font-bold text-navy dark:text-gold mb-4">Why the Gala matters</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Mercy House Adult &amp; Teen Challenge charges residents a fraction of what a year of
            residential care actually costs. The difference is covered by donors — and the Freedom
            Gala is the single largest night of giving in our year. Every table sponsored puts a man
            or woman into a bed, a classroom, and a community that expects them to recover.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            The evening includes dinner, worship, and testimony from graduates who walked onto our
            campuses at the end of themselves and walked off with their families restored. If you
            have never seen what a year of structure and faith does to a life, this is the night to
            come and see it.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Sponsorship also keeps the lights on in the parts of the ministry that never make a
            brochure: the intake calls taken at midnight, the beds held open for someone still
            deciding, and the year of counseling, chapel, education and work training that follows.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center">
          <Ticket className="w-10 h-10 text-gold mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-navy dark:text-gold mb-3">
            Sponsor a table or reserve a seat
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Contact our team for sponsorship levels and seating, or give now to support the work the
            Gala funds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-navy dark:bg-gold text-white dark:text-navy font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact us about sponsorship
            </Link>
            <Link
              to="/donate"
              className="border-2 border-navy dark:border-gold text-navy dark:text-gold font-bold px-8 py-3 rounded-lg hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-colors"
            >
              Give now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
