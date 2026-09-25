import { useEffect } from 'react';

// Same origin as useDocumentMeta — flip both together at DNS cutover via VITE_SITE_URL.
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.org';

/**
 * Site-wide NonprofitOrganization JSON-LD (name, address, phone, sameAs),
 * with the two residential campuses as `department` sub-entities so each
 * carries its own Google Business Profile and (for the Women's Campus) its
 * own Facebook page. Injected once on mount — unlike per-route SEO meta,
 * this doesn't change on navigation, so it belongs in Layout rather than
 * SeoManager.
 *
 * Instagram isn't confirmed yet — add it to the top-level sameAs once given.
 */
export function useOrganizationSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'NonprofitOrganization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'Mercy House Adult & Teen Challenge',
      url: SITE_ORIGIN,
      logo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/f6308df5-e751-45c6-6b95-9631b3eb7800/menulogo',
      telephone: '+1-601-720-3718',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1110 Mary St',
        addressLocality: 'Georgetown',
        addressRegion: 'MS',
        postalCode: '39078',
        addressCountry: 'US',
      },
      sameAs: [
        'https://www.facebook.com/mercyhouseteenchallenge',
        'https://www.youtube.com/@mercyhouseadultteenchallen9271',
      ],
      department: [
        {
          '@type': 'LocalBusiness',
          name: "Mercy House Adult & Teen Challenge - Men's Campus",
          url: `${SITE_ORIGIN}/programs-locations/mens-campus`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1110 Mary St',
            addressLocality: 'Georgetown',
            addressRegion: 'MS',
            postalCode: '39078',
            addressCountry: 'US',
          },
          sameAs: [
            'https://share.google/GyzRNUbGc5gb8iPvw',
          ],
        },
        {
          '@type': 'LocalBusiness',
          name: "Mercy House Adult & Teen Challenge - Women's Campus",
          url: `${SITE_ORIGIN}/programs-locations/womens-campus`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Learned',
            addressRegion: 'MS',
            addressCountry: 'US',
          },
          sameAs: [
            'https://share.google/DOC7lwO3we4Bb0ij7',
            'https://www.facebook.com/profile.php?id=61584021626464',
          ],
        },
      ],
    };

    let script = document.getElementById('organization-schema');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'organization-schema';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, []);
}
