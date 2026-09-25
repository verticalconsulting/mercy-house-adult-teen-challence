import { Link } from 'react-router-dom';
import { Home, HeartHandshake } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/**
 * Branded 404 catch-all. Rendered for any unmatched URL (no Layout wrapper),
 * so it sets its own noindex meta and provides compassionate wayfinding back
 * to Home and to the Get Help / Admissions page.
 */
export default function PageNotFound() {
  useDocumentMeta({
    title: 'Page Not Found | Mercy House Adult & Teen Challenge',
    description:
      "We couldn't find that page. Return home or reach out to Mercy House Adult & Teen Challenge for faith-based recovery support in Mississippi.",
    path: '/404',
    noindex: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background dark:bg-slate-900">
      <div className="max-w-lg w-full text-center">
        <p className="mh-eyebrow mb-4">Mercy House Adult &amp; Teen Challenge</p>
        <h1 className="text-6xl md:text-7xl font-black text-navy dark:text-gold mb-3">404</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto mb-6" aria-hidden="true" />
        <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white mb-4">
          This page seems to have lost its way.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          The page you&rsquo;re looking for may have moved or is no longer here. But no one is too
          lost to find their way back &mdash; let us help you take the next step.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="mh-cta-primary">
            <Home className="w-5 h-5" /> Return Home
          </Link>
          <Link to="/IntakeForm" className="mh-cta-outline">
            <HeartHandshake className="w-5 h-5" /> Get Help / Admissions
          </Link>
        </div>
      </div>
    </div>
  );
}