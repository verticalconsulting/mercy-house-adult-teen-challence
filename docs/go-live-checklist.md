# Go-live checklist — mercyhouseatc.com SEO + analytics cutover

Nothing flips to production until every line is ticked. Items marked
**(unverified by implementation)** could not be checked from the development
environment — no network egress, no account credentials — and are therefore
genuinely unknown, not merely unticked.

## Build

- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `dist/sitemap.xml`, `dist/robots.txt` and `dist/_headers` are present
- [ ] `dist/_headers` contains **no** site-wide `/*` noindex block
- [ ] `grep -c '<loc>' dist/sitemap.xml` matches the indexable route count

## Environment

- [ ] `VITE_SITE_URL=https://mercyhouseatc.com` set in the Base44 deploy env
- [ ] `VITE_GTM_ID` set to the real container id — **while it is the default
      placeholder `GTM-XXXXXXX`, `shouldTrack()` returns false and nothing is
      measured at all**
- [ ] `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`, `AUTOMATION_SECRET` set on the
      Base44 functions

## Analytics — see `runbooks/google-ads-migration.md`

- [ ] GTM container published, GA4 + Ads tags firing off the six events
- [ ] GA4 DebugView shows all six conversions **(unverified by implementation)**
- [ ] `contact_click` is Secondary or low-value, not donation-equivalent
- [ ] Legacy Ads conversion tags still running in parallel — remove only
      after two weeks of agreement within ~10%
- [ ] Virtuous webhook payload validated against GA4's **debug** endpoint —
      the normal endpoint returns 204 for malformed events **(unverified by
      implementation; see `runbooks/virtuous-webhook.md`)**

## Content

- [ ] All five testimony records exist with `slug`, `published: true`,
      `consent_confirmed: true` and a `consent_date`
- [ ] **Decide:** the `/testimonies` index still filters on `published` only,
      not `consent_confirmed`. It publishes graduate names and stories with
      no recorded consent. This predates the change but is not what "consent
      confirmed for each named graduate" implies. Gate it, or accept it
      deliberately.
- [ ] A published `BlogPost` exists with `slug: ministry-updates`, carrying
      the **migrated copy from the old .org post**, not a rewrite — that post
      has existing clicks and links to preserve
- [ ] `/freedom-gala` has the confirmed date and venue in `EVENT_DETAILS`
- [ ] Instagram handle in `useOrganizationSchema.js` confirmed (currently a
      guess: `instagram.com/mercyhouseatc`)
- [ ] Organisation-level Google Business Profile confirmed (currently reuses
      the Men's Campus listing)
- [ ] `/thrift-store` and `/womens-center-calendar` confirmed against the
      original CSV — they were absent from the supplied map and are currently
      indexable

## Prerendering — see `runbooks/hado-seo.md`

- [ ] Baseline `npm run verify:seo` captured **before** the DNS change
- [ ] Hado configured with **network-idle** render wait, not a fixed delay
- [ ] `docs/hado-redirects.csv` imported (30 × 301)
- [ ] robots.txt and sitemap.xml pass through from the origin
- [ ] DNS change live
- [ ] `npm run verify:seo` passes clean **(unverified by implementation)**
- [ ] `curl` as a human returns the SPA shell, not the snapshot

## Search Console — see `runbooks/gsc-domain-verification.md`

- [ ] **Domain** property for `mercyhouseatc.com` verified by DNS TXT
      **(unverified by implementation)**
- [ ] Verification TXT record left in place
- [ ] `sitemap.xml` submitted
- [ ] The `.org` property retained, with Change of address set to `.com`

## Payments — see `runbooks/payment-e2e-test.md`

- [ ] All 9 rows of the matrix pass **(unverified by implementation)**
- [ ] Every expected email received, with recipient and delay recorded
- [ ] Stripe returned to live mode, test charges refunded, test records purged

## Known open questions

- [ ] **`main.mercyhouseworks.org` and the storage-bucket logo do not exist
      anywhere in this repo.** The audit reports them in today's schema, but
      this codebase's schema points at `imagedelivery.net`. Either the audit
      crawled a different build (likely the old `.org` WordPress site), or
      `mercyhouseatc.com` is not yet pointed at this Base44 app. Resolve this
      first — if the domain does not serve this code, none of the above
      reaches a live visitor.
