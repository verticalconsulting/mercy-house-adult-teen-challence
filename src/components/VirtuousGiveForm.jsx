import React, { useEffect, useRef, useState } from 'react';

/**
 * VirtuousGiveForm — embeds a Virtuous giving form (Stripe + Virtuous CRM).
 *
 * The Virtuous embed script renders a PCI-compliant payment form inside its
 * own hosted iframe, so card data never touches this app. We simply inject
 * the script with the right data-attributes and let Virtuous own the form.
 *
 * The form itself is configured in the Virtuous Form Builder (gift array,
 * recurring toggle, frequency, branding). This component is intentionally
 * dumb: give it a `formId` and it renders that form.
 *
 * @param {string} formId  The Virtuous form ID (data-vform).
 * @param {string} orgId   Virtuous org ID (default Mercy House: "5169").
 * @param {string} title   Optional heading shown above the embed.
 * @param {string} subtitle  Optional supporting line under the title.
 * @param {string} className Extra classes for the outer wrapper.
 */
export default function VirtuousGiveForm({
  formId,
  orgId = '5169',
  title,
  subtitle,
  className = '',
}) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!formId || !containerRef.current) return;

    // Virtuous's embed script keys off the script element's data attributes
    // and renders the form where the script tag sits in the DOM.
    const script = document.createElement('script');
    script.src = 'https://cdn.virtuoussoftware.com/virtuous.embed.min.js';
    script.async = true;
    script.setAttribute('data-vform', formId);
    script.setAttribute('data-orgId', orgId);
    script.setAttribute('data-isGiving', 'true');
    script.setAttribute('data-merchantType', 'StripeUnified');
    script.setAttribute('data-dependencies', '[]');
    script.onload = () => setLoaded(true);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      setLoaded(false);
    };
  }, [formId, orgId]);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 pt-6 text-center">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-gold">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-2 text-base md:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">
        {/* Accessible affordance while the iframe form mounts */}
        {!loaded && (
          <div className="flex items-center justify-center py-16 text-slate-400" role="status" aria-live="polite">
            <span className="text-sm">Loading secure giving form…</span>
          </div>
        )}
        <div ref={containerRef} className="virtuous-embed-host min-h-[400px]" aria-label="Mercy House secure giving form" />
      </div>
    </div>
  );
}