# Mercy House ATC: Mobile Performance Audit (2026-10-01)

Scope: the replacement build in this repo (Base44 / React / Vite), measured against Google Core Web Vitals, mobile-first standards, and the Google Ad Grants website policy. The live mercyhouseatc.com is still the previous site (it shows an "under construction, no donations today" notice), so the numbers below are lab measurements of this build, not of the live site.

## 1. Summary

- The site shipped as one 3 MB JavaScript file that every visitor downloaded before seeing anything, including the employee portal and chart libraries. Each page is now its own small download.
- Page weight on first load fell from about 2.9 MB to about 0.5 MB, and lab Largest Contentful Paint (LCP) fell from about 13 s to about 5 s on a throttled mobile connection.
- It is not yet at Google's "Good" bar (LCP 2.5 s). The biggest remaining cause is the site waiting on a Base44 backend call before it draws any page (see Remaining items, #1).
- No colors, fonts, logos, photos or wording were changed.

## 2. Scorecard (lab, mobile, Lighthouse, median of 3 runs, same throttling, both builds gzip-served)

| Metric | Before | After | Google "Good" |
|---|---|---|---|
| Performance score | 52 | 67 | 90+ (internal target) |
| LCP | 13.3 s | 5.0 s | ≤ 2.5 s |
| TBT (lab stand-in for INP) | 499 ms | 387 ms | ≤ 200 ms |
| CLS | 0 | 0 | ≤ 0.1 |
| First load transfer | 2,882 KB | 523 KB | n/a |
| Accessibility | 93 | 93 | 90+ |
| SEO | 100 | 100 | 90+ |
| Best Practices | 96 | 96 | 90+ |

Method notes (be upfront with the client):
- Google's PageSpeed Insights API returned HTTP 429 (shared free quota) on every attempt, so Lighthouse was run locally against production builds of the old and new code. Re-run PageSpeed Insights once the site is live on mercyhouseatc.com for official numbers.
- The sandbox cannot reach the Base44 backend, so these runs exclude that API round trip. Real-world LCP will be somewhat slower than shown until Remaining item #1 is done.
- To be fair to the "before" build, its Google Fonts link was removed (it cannot load from the sandbox). Real "before" performance was likely worse than shown.
- No field (CrUX) data exists yet: the new build is not live. After launch, field data appears after about 28 days.
- The `errors-in-console`, `valid-source-maps` and `landmark-one-main` flags in the runs are sandbox/timing artifacts (backend unreachable; `<main>` exists in `Layout.jsx`). Confirm on the live site.

## 3. Changes made (all on branch `claude/fervent-wozniak-u8af8s`)

| # | Change | Why | Where |
|---|---|---|---|
| 1 | Route-level code splitting: every page except Home loads on demand; floating chat widget loads separately | Entry bundle 2.99 MB to 0.95 MB (676 KB to 284 KB gzipped); portal and charts no longer sent to donors | `src/App.jsx`, `src/pages.config.js`, `src/Layout.jsx` |
| 2 | Hero photo served in 3 sizes (640 / 1024 / 1792 px) via `srcset`; phones now download about 32-95 KB instead of 893 KB | LCP element is the hero image | `SiteHero.jsx`, `Home.jsx`, `public/assets/images/` |
| 3 | Program card photos converted to WebP: men's 996 KB to 113 KB, women's 328 KB to 30 KB | Page weight | `Home.jsx`, `HomeImageManager.jsx` |
| 4 | Roboto self-hosted (same family, weights 400/500/700/900, Latin subset) instead of Google Fonts | Removes a render-blocking third-party request chain | `src/main.jsx`, `index.html`, `package.json` |
| 5 | Virtuous tracker loads after page load and when the browser is idle (same script, same org ID) | Keeps tracking from competing with first paint and taps | `index.html` |
| 6 | Added missing `/manifest.json` (now with icons) (it was linked but did not exist, a 404 on every page); added `theme-color` (#2F4E6F) | Broken link / Best Practices | `public/manifest.json`, `index.html` |
| 7 | Footer links and "Read more graduate stories" now 44 px tall tap targets (were 21-24 px) | Brand rule and WCAG 2.2 target size | `Layout.jsx`, `Home.jsx` |
| 9 | Favicon, Apple touch icon and manifest icons from the approved logo; full street address added to the site footer | Brand/trust, Ad Grants address requirement | `public/assets/images/mercyhouse-mark-*.png`, `index.html`, `Layout.jsx` |
| 8 | Skipped the first-load slide-in animation on main content (page-to-page transitions still animate) | Hero no longer waits on an off-screen animation | `Layout.jsx` |

Verified in a mobile browser at 360 x 800 and 390 x 844: no horizontal scroll, hero renders, Roboto loads from the site, no tap target under 44 px, 78/78 unit tests pass, production build succeeds. Lint reports the same 44 pre-existing errors before and after (none introduced).

## 4. Google Ad Grants readiness (policy page re-read 2026-10-01; no changes from the checklist)

| Requirement | Status | Notes |
|---|---|---|
| Domain ownership, no redirect to third party | Needs client input | .org 301-redirects to .com (fine, same org). Confirm Mercy House has admin control of mercyhouseatc.com. |
| Substantial, unique content | Pass (replacement build) | About, Programs, Campuses, Contact, FAQ, News, Testimonials present. Mission and program content is on-page; only annual reports/financials are PDFs (fine as supplements). |
| Clear mission, address, EIN | Pass | Mission is prominent. EIN 45-4670832 and 501(c)(3) appear on the live site. Footer previously listed only Georgetown & Learned, MS. Client confirmed 1110 Mary St, Georgetown, MS 39078; now shown in the site-wide footer, Contact page and organization schema. |
| Navigation and working links | Open | `manifest.json` 404 fixed. Run a full link crawl after launch (about 28 internal routes plus external business links). |
| Fast loading | Improved, not yet passing | See scorecard. Needs Remaining #1. |
| Mobile-friendly | Pass | Responsive, viewport correct, no horizontal scroll, tap targets fixed. |
| HTTPS, no mixed content | Needs verification | Build uses HTTPS assets. Confirm certificate and http-to-https redirect on the live domain. |
| Commercial limits | Pass (confirm) | No ad networks found in code. Thrift store and vehicle donation are mission-linked; make sure each states how proceeds fund programs. |
| Under-construction / "no donations" notice | **Blocker if left on** | The live site shows this notice. Turn off the `maintenance_banner_enabled` setting at launch; Google flags placeholder pages. |

Not covered by this audit: Ad Grants account rules (5% CTR, conversion tracking, keyword quality, campaign structure).

Wording for the client: "Google reviews Ad Grants sites case by case; these fixes address every published website requirement."

## 5. Remaining items

| # | Item | Severity | Effort | Owner |
|---|---|---|---|---|
| 1 | **Every page waits for a Base44 API call (`public-settings`) before drawing anything** (`App.jsx` spinner gated on `AuthContext`). Render public pages immediately and resolve sign-in in the background. Largest remaining LCP lever; changes sign-in behavior, so test on staging with the backend. | High | M | Corey |
| 2 | Entry bundle is still 0.95 MB (284 KB gzipped). Split vendor chunks; check framer-motion and the Base44 SDK usage on the first screen. | High | M | Corey |
| 3 | Maintenance banner loads after an API call and pushes content down when enabled (layout shift risk). Turn it off at launch. | Medium | S | Client |
| 4 | ~~Favicon is the Base44 logo~~ **Done:** favicon, Apple touch icon and manifest icons now use the Star Man mark cropped from the approved colored logo (owner-authorized crop; wordmark and ® removed, artwork otherwise unaltered). | Done | n/a | n/a |
| 5 | Header logo is hosted on imagedelivery.net with no width/height. Self-host the approved `colored-long` / `white-long` logo with dimensions. | Medium | S | Corey |
| 6 | Two gold buttons above the fold on mobile ("Donate Now" in header, "Start Your Journey" in hero). **Owner-approved exception** to the one-primary-CTA brand rule; no change made. | Accepted | n/a | Client |
| 7 | `og:image` / `twitter:image` missing from `index.html` defaults (a per-page default exists in `useDocumentMeta.js`; verify it renders on social share). | Low | S | Corey |
| 8 | Several pages hot-link images from `media.base44.com` at full size (About, Programs, etc.). Compress and add `width`/`height`. | Medium | M | Corey |
| 9 | Add web-vitals reporting to GA4 to get real-user numbers. | Low | S | Corey |
| 10 | `pages.config.js` is marked auto-generated by Base44. If Base44 regenerates it, re-apply item 1 of Changes (lazy imports). | Medium | S | Corey |

## 6. Ongoing care (monthly)

Re-run PageSpeed Insights mobile on Home, Donate, Get Help, and top landing pages; check Search Console Core Web Vitals and broken links; confirm donation flow and forms; compress any new photos before upload.

---

## Internal note for Corey (not for the client)

- Upsell fits: monthly website care and performance retainer (monitoring, image compression on uploads, link checks); Ad Grants management (needs the site fixes above first, then campaign build, conversion tracking and the 5% CTR upkeep); GA4 web-vitals setup.
- Worth doing first: Remaining #1 (about half of the remaining LCP gap) and turning the maintenance banner off at launch. Everything else is polish.
- Client decisions needed: who controls the domain, confirmation that thrift store and vehicle donation pages state how proceeds support the mission.
- I did not touch: the auth flow, brand colors/fonts/logos, copy. Nothing was published to production.
