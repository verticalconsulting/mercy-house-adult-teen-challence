import React, { useEffect, useRef, useState } from 'react';
import { ensureVirtuousReady } from '@/lib/virtuousEmbed';

/**
 * VirtuousGiveForm — embeds a Virtuous giving form (Stripe + Virtuous CRM).
 *
 * The Virtuous embed renders a PCI-compliant payment form inside its own
 * hosted iframe, so card data never touches this app. The form itself is
 * configured in the Virtuous Form Builder (gift array, recurring toggle,
 * branding). This component is intentionally dumb: give it a `formId` and it
 * renders that form.
 *
 * Embed mechanics: we place a `<script data-vform>` placeholder in the
 * container and ensure the Virtuous embed script is loaded once for the whole
 * app (see @/lib/virtuousEmbed). The embed's own one-shot DOM scan renders
 * placeholders present on first load; for forms mounted later (client-side
 * navigation, re-renders) we render directly via the global `virtuousForm`.
 *
 * NOTE — Virtuous Giving Forms require the embedding domain to be whitelisted
 * in Virtuous Giving Settings → Payment Processor → Organization Domains. On
 * a non-whitelisted host the iframe won't render, so we watch the container
 * for injected content and fall back to a helpful message instead of
 * spinning forever.
 *
 * @param {string} formId   The Virtuous form ID (data-vform).
 * @param {string} orgId    Virtuous org ID (default Mercy House: "5169").
 * @param {string} title    Optional heading shown above the embed.
 * @param {string} subtitle Optional supporting line under the title.
 * @param {string} className Extra classes for the outer wrapper.
 */
const RENDER_TIMEOUT_MS = 15000;
// How long to wait for the embed's own one-shot scan to render this form
// before rendering it directly. The scan runs synchronously when the forms
// library finishes loading, so a couple of frames is plenty.
const SCAN_GRACE_MS = 300;

export default function VirtuousGiveForm({
  formId,
  orgId = '5169',
  title,
  subtitle,
  className = '',
}) {
  const containerRef = useRef(null);
  // loading | ready | failed
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!formId || !containerRef.current) return;

    let observer;
    let timeout;
    let renderTimer;
    let cancelled = false;

    const markReadyIfRendered = () => {
      const host = containerRef.current;
      // The placeholder <script> is itself a child, so don't count it — wait
      // until Virtuous injects real markup (an iframe or wrapper element).
      if (host && Array.from(host.children).some((c) => c.tagName.toLowerCase() !== 'script')) {
        setStatus('ready');
        return true;
      }
      return false;
    };

    observer = new MutationObserver(() => {
      if (!cancelled) markReadyIfRendered();
    });
    observer.observe(containerRef.current, { childList: true, subtree: true });

    timeout = setTimeout(() => {
      if (cancelled) return;
      if (!markReadyIfRendered()) setStatus('failed');
    }, RENDER_TIMEOUT_MS);

    // Placeholder the embed's scan (and virtuousForm) locate by data-vform.
    const placeholder = document.createElement('script');
    placeholder.setAttribute('data-vform', formId);
    placeholder.setAttribute('data-orgId', orgId);
    placeholder.setAttribute('data-isGiving', 'true');
    placeholder.setAttribute('data-merchantType', 'StripeUnified');
    placeholder.setAttribute('data-dependencies', '[]');

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(placeholder);

    // Ensure the embed + forms library are loaded once, then render this form
    // directly if the embed's one-shot scan didn't already (client-side nav,
    // re-mounts, or multiple forms on one page).
    ensureVirtuousReady()
      .then(({ virtuousForm, apiUrl }) => {
        if (cancelled) return;
        renderTimer = setTimeout(() => {
          if (cancelled) return;
          if (markReadyIfRendered()) return; // scan already handled it
          try {
            virtuousForm({
              organizationId: orgId,
              formId,
              isGiving: true,
              merchantType: 'StripeUnified',
              virtuousFormsApiUrl: apiUrl,
            });
          } catch (err) {
            console.error('Virtuous form render failed:', err);
          }
        }, SCAN_GRACE_MS);
      })
      .catch((err) => {
        if (!cancelled) console.error('Virtuous embed failed to load:', err);
      });

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (timeout) clearTimeout(timeout);
      if (renderTimer) clearTimeout(renderTimer);
      if (containerRef.current) containerRef.current.innerHTML = '';
      setStatus('loading');
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
        {status === 'loading' && (
          <div className="flex items-center justify-center py-16 text-slate-400" role="status" aria-live="polite">
            <span className="text-sm">Loading secure giving form…</span>
          </div>
        )}
        {status === 'failed' && (
          <div className="text-center py-12 px-4" role="alert">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              The secure giving form couldn't load on this domain.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Virtuous Giving Forms must be published on a whitelisted domain. Add this site to
              Virtuous Giving Settings → Payment Processor → Organization Domains, or open the form
              on your published Mercy House domain.
            </p>
          </div>
        )}
        <div ref={containerRef} className="virtuous-embed-host min-h-[400px]" aria-label="Mercy House secure giving form" />
      </div>
    </div>
  );
}