import React, { useState, useEffect } from 'react';
import { Construction } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Maintenance / construction banner for the homepage.
 * Reads the `maintenance_banner_enabled` SiteSetting to decide whether to show.
 * Defaults to hidden if the setting is missing or unreadable.
 */
export default function MaintenanceBanner() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await base44.entities.SiteSetting.filter(
          { key: 'maintenance_banner_enabled' },
          { limit: 1 }
        );
        if (!cancelled) {
          setEnabled(items[0]?.value === 'true');
        }
      } catch (err) {
        // Setting may not exist yet — default to hidden.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading || !enabled) return null;

  return (
    <div className="mh-construction-banner text-white" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-center sm:px-6 lg:px-8">
        <Construction className="h-5 w-5 flex-shrink-0 text-gold" aria-hidden="true" />
        <p className="text-sm font-semibold sm:text-base">
          New website under construction today — please, no donations today. Check back soon!
        </p>
      </div>
    </div>
  );
}