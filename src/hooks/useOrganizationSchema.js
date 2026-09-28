import { useEffect } from 'react';

// Same origin as useDocumentMeta — override both together via VITE_SITE_URL.
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.com';

/**
 * Site-wide NonprofitOrganization JSON-LD (name, address, phone, sameAs),
 * with the two residential campuses as `department` sub-entities so each
 * carries its own Google Business Profile and (for the Women's Campus) its
 * own Facebook page.
 *
 * Built by a pure function so it can be asserted on without a DOM; the hook
 * below is only the injection.
 */
export function buildOrganizationSchema(origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    '@id': `${origin}/#organization`,
    name: 'Mercy House Adult & Teen Challenge',
    url: origin,
    logo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/f6308df5-e751-45c6-6b95-9631b3eb7800/menulogo',
    telephone: '+1-601-720-3718',
    email: 'info@mercyhouseatc.com',
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
      'https://www.instagram.com/mercyhouseatc',
      'https://www.youtube.com/@mercyhouseadultteenchallen9271',
      'https://share.google/GyzRNUbGc5gb8iPvw',
    ],
    department: [
      {
        '@type': 'LocalBusiness',
        name: "Mercy House Adult & Teen Challenge - Men's Campus",
        url: `${origin}/programs-locations/mens-campus`,
        telephone: '+1-601-720-3718',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1110 Mary St',
          addressLocality: 'Georgetown',
          addressRegion: 'MS',
          postalCode: '39078',
          addressCountry: 'US',
        },
        sameAs: ['https://share.google/GyzRNUbGc5gb8iPvw'],
      },
      {
        '@type': 'LocalBusiness',
        name: "Mercy House Adult & Teen Challenge - Women's Campus",
        url: `${origin}/programs-locations/womens-campus`,
        telephone: '+1-601-720-3718',
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
}

/**
 * Injects the organisation JSON-LD once on mount. Unlike per-route SEO meta
 * this doesn't change on navigation, so it belongs in Layout rather than
 * SeoManager.
 */
export function useOrganizationSchema() {
  useEffect(() => {
    const schema = buildOrganizationSchema(SITE_ORIGIN);

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
