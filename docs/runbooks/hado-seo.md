# Runbook: Hado SEO prerendering

**What this solves:** the site is a client-rendered Vite SPA. Crawlers that do
not execute JavaScript see only `index.html`, whose hardcoded `<title>` and
`<link rel="canonical">` point at the homepage. That is why the migration
audit's Googlebot column reads `https://mercyhouseatc.org/` on *every* row —
every page currently canonicalises to the homepage for crawlers. Hado sits in
front at DNS level and serves crawlers a fully rendered snapshot instead.

**Important:** Hado renders whatever the React app produces. It does not
invent metadata. The per-route titles, descriptions, H1s and canonicals must
already be correct in the app — they are, as of this branch — and Hado only
makes them visible without JS.

## A caveat worth knowing

Google deprecated dynamic rendering as a *recommendation* in 2022. It is still
supported and is explicitly **not** cloaking so long as crawlers and humans
get equivalent content. A build-time prerender is the more durable long-term
answer. Hado was chosen here because Base44 owns `buildCommand` and its build
image is unlikely to have headless Chrome available, and because a DNS change
does not fight the Base44 Builder sync. Revisit if the hosting changes.

## Setup

1. Create the Hado account and add `mercyhouseatc.com`.
2. **Origin:** the Base44 deployment URL.
3. **Render wait: wait for network idle.** Do not use a fixed delay. The
   testimony (`/testimonies/:slug`), news (`/news/:slug`) and event detail
   pages fetch from Base44 *after* mount via React Query. A short fixed delay
   snapshots the loading skeleton, and Hado then caches a page whose `<h1>`
   is empty. `scripts/verify-rendered-seo.mjs` fails explicitly on this with
   "snapshot likely captured before data loaded".
4. **Cache refresh:** daily.
5. **Redirects:** bulk-import `docs/hado-redirects.csv` (30 rows, all 301).
   It is generated from `LEGACY_REDIRECTS` in `src/lib/canonical-map.js`.
   Regenerate rather than hand-editing it — the canonical map is the source
   of truth, and a hand-edited CSV will drift:

   ```bash
   npm run build   # regenerates sitemap.xml too
   ```

   To regenerate just the CSV, re-run the one-liner recorded in the Task 10
   ledger entry, or add a script if this becomes routine.
6. **robots.txt and sitemap.xml: pass through from the origin.** Do not let
   Hado manage its own copies. The origin's versions are generated from the
   canonical map at build time, are version-controlled, and are what
   `verify:seo` asserts against. Two sources of truth here means the sitemap
   silently stops matching the site.
7. Store the API key in the team password manager. No code in this repo needs
   it — `verify:seo` works against the public origin.
8. Make the DNS change.

## Verification

```bash
npm run verify:seo
```

Run it **before** the DNS change to capture the baseline — expect many
`canonical is https://mercyhouseatc.com/, expected <path>` failures,
reproducing the audit. Save that output. Then run it again afterwards and
expect `OK - N routes verified`.

Then confirm humans still get the SPA:

```bash
curl -s https://mercyhouseatc.com/donate | head -30
```

Expected: the normal shell with `<div id="root">` and the module script —
**not** the prerendered snapshot. Hado must serve snapshots only to crawlers.
If humans receive prerendered HTML too, that is a misconfiguration; and if
crawler and human content ever diverge in substance, it becomes cloaking.
