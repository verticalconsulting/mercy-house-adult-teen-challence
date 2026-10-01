import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/**
 * ThankYou — the post-donation gratitude page.
 *
 * After a donor completes a gift (Stripe checkout or Virtuous form) they land
 * here. The page adds their name to a public "wall of blessing" alongside
 * every other giver, and renders the full wall of names. Tone is faith-filled
 * and grateful.
 *
 * The donor's name can arrive two ways:
 *   1. `?name=Jane` query param — set by the donation redirect when known.
 *   2. A short form on the page — for when the redirect can't carry a name
 *      (e.g. Stripe Checkout, which doesn't pass the customer name forward).
 * Either path creates one Donor record; the wall then re-fetches and shows it.
 */
export default function ThankYou() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState('');

  useDocumentMeta({
    title: 'Thank You — Mercy House Adult Teen Challenge',
    description: 'A wall of blessing honoring every giver whose generosity fuels restoration at Mercy House.',
  });

  // Load the wall of donors.
  const loadDonors = async () => {
    try {
      const page = await base44.entities.Donor.filter(
        {},
        { sort: '-created_date', limit: 200, fields: ['display_name', 'message', 'anonymous', 'created_date'] }
      );
      setDonors(page.items || []);
    } catch (err) {
      // Non-critical — the wall still renders with a graceful note.
      console.error('Failed to load donor wall:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();

    // If the redirect carried a name, pre-fill and auto-add it once.
    const params = new URLSearchParams(window.location.search);
    const passedName = params.get('name')?.trim();
    if (passedName) {
      setName(passedName);
      addDonor(passedName, '', false, true);
    }
  }, []);

  const addDonor = async (donorName, donorMessage, isAnonymous, isAuto = false) => {
    if (!donorName.trim() && !isAnonymous) {
      setError('Please enter a name to add to the wall.');
      return false;
    }
    setSubmitting(true);
    setError('');
    try {
      const resolvedName = isAnonymous ? 'A Friend of Mercy House' : donorName.trim();
      await base44.entities.Donor.create({
        name: donorName.trim() || 'Anonymous',
        message: donorMessage.trim() || undefined,
        anonymous: isAnonymous,
        display_name: resolvedName,
      });
      setJustAdded(true);
      if (!isAuto) {
        setName('');
        setMessage('');
        setAnonymous(false);
      }
      await loadDonors();
      return true;
    } catch (err) {
      console.error('Failed to add donor:', err);
      setError('Something went wrong adding your name. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDonor(name, message, anonymous);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero — gratitude band */}
      <section className="relative overflow-hidden bg-navy-deep dark:bg-slate-950 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -top-16 -right-10 text-[220px] font-black leading-none">MH</div>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/15 mb-6">
            <Heart className="w-8 h-8 text-gold" aria-hidden="true" />
          </div>
          <p className="mh-eyebrow text-gold mb-4">A Wall of Blessing</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Thank You for Your Gift
          </h1>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            "Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver."
            <span className="block mt-2 text-base text-gold font-semibold">— 2 Corinthians 9:7</span>
          </p>
          <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your generosity is a blessing to the men, women, and families walking
            toward freedom at Mercy House. Because of you, lives are being restored
            and hope is being renewed. Your name now stands alongside a family of
            givers who believe in second chances.
          </p>
        </div>
      </section>

      {/* Add your name — if not already added via redirect */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-12 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          {justAdded ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 mb-4">
                <Sparkles className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">Your Name Is on the Wall</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-5">
                Thank you for blessing Mercy House. Your generosity changes lives.
              </p>
              <a
                href="#donor-wall"
                className="mh-cta-primary"
              >
                See the Wall of Blessing
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2 text-center">
                Add Your Name to the Wall
              </h2>
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
                Join the family of givers whose names stand as a testimony of faith and compassion.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="donor-name" className="block text-sm font-semibold text-navy dark:text-slate-200 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane, The Williams Family"
                    disabled={submitting}
                    className="w-full h-12 px-4 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="donor-message" className="block text-sm font-semibold text-navy dark:text-slate-200 mb-1.5">
                    A Short Blessing <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="donor-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A word of encouragement or a verse that moved you…"
                    rows={2}
                    maxLength={280}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold resize-none"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    disabled={submitting}
                    className="w-5 h-5 rounded border-slate-300 text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    List me anonymously as "A Friend of Mercy House"
                  </span>
                </label>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mh-cta-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding…' : 'Add My Name to the Wall'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Donor Wall */}
      <section id="donor-wall" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center mb-10">
          <p className="mh-eyebrow mb-3">With Grateful Hearts</p>
          <h2 className="mh-h2 dark:text-white mb-3">The Wall of Blessing</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Every name here represents a life touched, a prayer answered, and a
            future rewritten by God's grace. Thank you for standing with Mercy House.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-gold rounded-full animate-spin" />
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-gold mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-500 dark:text-slate-400">
              Be the first to add your name to the wall of blessing.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-navy/10 dark:bg-gold/10 mb-3">
                    <Heart className="w-4 h-4 text-gold" aria-hidden="true" />
                  </div>
                  <p className="font-bold text-navy dark:text-gold text-sm md:text-base leading-tight break-words">
                    {donor.display_name || donor.name}
                  </p>
                  {donor.message && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic leading-snug line-clamp-3">
                      "{donor.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center mt-10 text-sm text-slate-400 dark:text-slate-500">
              {donors.length} {donors.length === 1 ? 'name' : 'names'} of blessing on the wall
            </p>
          </>
        )}
      </section>

      {/* Closing scripture band */}
      <section className="bg-navy dark:bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" aria-hidden="true" />
          <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-3">
            "And God is able to bless you abundantly, so that in all things at all
            times, having all that you need, you will abound in every good work."
          </p>
          <p className="text-gold font-semibold">— 2 Corinthians 9:8</p>
          <p className="mt-6 text-slate-200 leading-relaxed">
            Thank you for being the hands and feet of Jesus. Your gift brings hope,
            healing, and a new beginning to those who need it most.
          </p>
        </div>
      </section>
    </div>
  );
}