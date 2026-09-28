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

## Current state (measured 2026-09-28)

`npm run verify:seo` against `https://mercyhouseatc.com` reported **209
failures**. Read correctly, that output says Hado is working and the *build
behind it is stale*:

- Every canonical route returns **200 with its own correct `<title>` and a
  rendered `<h1>`**, with no JavaScript executed, and the response carries
  `server: Fly/...`. Prerendering is live and per-route uniqueness reaches
  crawlers. This was the original defect and it is fixed.
- All 38 routes report **`canonical is null`** and **`no meta description`**,
  and all 38 still reference **`mercyhouseworks.org`**. Nothing on this branch
  can produce that: `useDocumentMeta` writes both tags, and the
  `mercyhouseworks.org` references were removed in Task 5. The deployed build
  therefore **predates this branch**.
- All **30 legacy redirects** return the wrong status — the CSV below has not
  been imported yet.
- The five `/testimonies/:slug` pages serve **identical bodies** and share one
  title: those routes do not exist in the deployed build, so the SPA fallback
  answers them.
- `/get-help-now` and `/vehicle-donation-program/form` are **indexable when
  they should be noindex**, and 12 pages fall under the body-copy floor.

**So the first action is not a Hado setting — it is deploying this branch.**
Re-run `verify:seo` after the deploy; most of the 209 should clear on their
own, and what remains is genuinely Hado configuration. Raw output is kept at
`.superpowers/sdd/2026-09-28-seo-analytics-cutover/verify-baseline.txt` for
the before/after comparison.

## Setup

1. Create the Hado account and add `mercyhouseatc.com`.
2. **Origin:** the Base44 deployment URL.
3. **Render wait: wait for network idle.** Do not use a fixed delay. The
   testimony (`/testimonies/:slug`), news (`/news/:slug`) and event detail
   pages fetch from Base44 *after* mount via React Query. A short fixed delay
   snapshots the loading skeleton, and Hado then caches a page whose `<h1>`
   is empty. `scripts/verify-rendered-seo.mjs` fails explicitly on this with
   "snapshot likely captured before data loaded".
4. **Redirects:** bulk-import `docs/hado-redirects.csv` (30 rows, all 301).
   It is generated from `LEGACY_REDIRECTS` in `src/lib/canonical-map.js`.
   Regenerate rather than hand-editing it — the canonical map is the source
   of truth, and a hand-edited CSV will drift:

   ```bash
   npm run build   # regenerates sitemap.xml too
   ```

   To regenerate just the CSV, re-run the one-liner recorded in the Task 10
   ledger entry, or add a script if this becomes routine.
5. Store the API key in the team password manager. No code in this repo needs
   it — `verify:seo` works against the public origin.
6. Work through **Domain Settings** below.

## Domain Settings, field by field

The plan's Task 10 said to let Hado pass `/robots.txt` and `/sitemap.xml`
through from the origin. **That option does not exist in this panel** — Hado
states that Base44 apps require both files to be configured in Hado, and
serves whatever is pasted here. So the origin copies stay the version-
controlled source of truth and this panel holds a *copy* that must be
re-pasted whenever the canonical map changes. Two stores, one of them manual:
that is the standing drift risk in this setup, and `verify:seo`'s sitemap
assertions are what catch it.

### robots.txt

Paste [`public/robots.txt`](../../public/robots.txt) byte for byte:

```
User-agent: *
Allow: /

Sitemap: https://mercyhouseatc.com/sitemap.xml
```

Do **not** add `Disallow` for `/get-help-now` or
`/vehicle-donation-program/form`. They are noindex deliberately, and a
disallowed URL can never be crawled to discover its noindex — see the header
comment in `src/lib/canonical-map.js`.

### sitemap.xml

Paste the contents of [`public/sitemap.xml`](../../public/sitemap.xml) — 37
`<loc>` entries, generated by `scripts/generate-sitemap.mjs` from
`INDEXABLE_PATHS`. Not the one-URL template Hado pre-fills.

No `lastmod` by design (a build timestamp on every URL teaches Google to
ignore the field), and the two noindex routes are excluded.

**Re-paste after every change to `canonical-map.js`.** `npm run build` writes
the current file; `verify:seo` fails on any URL in `INDEXABLE_PATHS` that the
served sitemap omits.

### Search Indexing

**Override noindex on origin: ON.** This is the switch that decides whether
any of the rest matters — Base44 stamps `noindex` on app origins, and without
the override the whole site stays out of search however good the markup is.
(As measured above, the live domain already returns `x-robots-tag: index,
follow`, so this appears to be on; confirm rather than assume.)

**Blocked paths** — routes the router serves that are not in the sitemap and
must not be indexed. Blocked paths keep the origin's noindex, so this is the
enforcement that does not depend on the app:

```
/home
/files
/employee-portal
/donation-funnel
/search-performance
```

That is the complete list of routed-but-unlisted paths: `/home` is the
deliberate noindexed homepage alias, and the other four are staff-only. Pages
like `Login`, `Register` and `ResetPassword` exist as files but are **not**
registered in `src/pages.config.js` and not hand-declared in `App.jsx`, so no
route serves them — do not list them here.

Deliberately **not** blocked: `/get-help-now` and
`/vehicle-donation-program/form`. Both must keep getting prerendered, because
`verify:seo` fetches every canonical route and asserts a real `<h1>` plus 120+
words on each; blocking them makes Hado serve the bare shell and those
assertions fail. Their noindex comes from the per-route `<meta name="robots">`
that `useDocumentMeta` writes.

### Content Security Policy

Optional, and it is hardening rather than SEO. Hado's pre-filled example
(`default-src 'self'; script-src 'self' https://js.stripe.com`) would break
this site: it blocks Google Fonts, GTM, the Virtuous embed, the Base44 image
CDNs, Supabase, YouTube and Vimeo. A policy that matches the origins actually
used in `src/`:

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://js.stripe.com https://cdn.virtuoussoftware.com https://forms.virtuoussoftware.com https://connect.facebook.net https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://widgets.guidestar.org https://app.candid.org;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
img-src 'self' data: blob: https://media.base44.com https://base44.com https://imagedelivery.net https://images.unsplash.com https://img.youtube.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://www.facebook.com https://widgets.guidestar.org;
connect-src 'self' https://qtrypzzcjebvfcihiynt.supabase.co https://*.base44.com https://*.base44.app https://api.stripe.com https://forms.virtuoussoftware.com https://formspree.io https://ipapi.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://td.doubleclick.net;
frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://events.golfstatus.com https://js.stripe.com https://checkout.stripe.com https://drive.google.com https://app.candid.org https://www.googletagmanager.com https://td.doubleclick.net;
form-action 'self' https://formspree.io https://checkout.stripe.com https://forms.virtuoussoftware.com;
base-uri 'self';
object-src 'none';
frame-ancestors 'self' https://tagassistant.google.com
```

- `'unsafe-inline'` in `script-src` is unavoidable with GTM Custom HTML tags.
  A nonce cannot help here: Hado serves *cached* snapshots, so any nonce in
  them is reused across visitors and buys nothing.
- `frame-ancestors` allows `tagassistant.google.com` because GTM Preview
  loads the site in an iframe there. Tighten to `'none'` once the container is
  published and debugging is done.
- **Run it in report-only mode first.** Then load `/donate`,
  `/donate/monthly`, `/golf-tournament`, `/media`,
  `/programs-locations/womens-campus` and `/womens-center-calendar` — the
  pages carrying third-party embeds — and read the console before enforcing.
- **The real cost:** the analytics design deliberately keeps every tag in GTM
  so retuning needs no deploy. An enforcing CSP partly undoes that — a tag
  added in the GTM UI for a new vendor is blocked until someone edits this
  policy, and CSP failures are silent unless you are looking at the console.
  Leaving CSP empty is a defensible choice.

### Sitemap Path

`sitemap.xml`. Matches the generator output, the `Sitemap:` line in
robots.txt, and what gets submitted to Search Console.

### Cache Freshness

**Daily** (the plan default), no per-path rules. Content changes on a human
cadence here. Revisit only if `/events` or `/news` starts publishing several
times a week.

### Render Concurrency

**Platform default.** 37 routes against static hosting plus Supabase reads
will not strain the origin. Step it down only if bulk renders start producing
empty `<h1>`s or Supabase rate-limit errors.

### Full Site Refresh

**Budgeted — one per month.** Do not spend it exploring. The one use that
earns it is the cutover: the moment this branch is deployed, every cached
snapshot still carries the stale build's null canonical and
`mercyhouseworks.org` references. Refresh once, *after* `verify:seo` passes,
not before.

### Default Rendering Language

**en-US**, explicitly. The app has no i18n and no language detection, so
"Auto-detect" only adds a variable that can misfire.

### Danger Zone

Nothing to do. Deleting the domain also destroys the analytics history needed
to compare against the old `.org` property.

## Verification

```bash
npm run verify:seo
```

Expect `OK - 39 routes verified against https://mercyhouseatc.com`. Every
failure line names the route and the specific assertion; treat each as a real
defect rather than tuning the script. `VERIFY_TIMEOUT_MS` (default 15000)
bounds each request so a blackholed origin reports instead of hanging.

Then confirm humans still get the SPA:

```bash
curl -s https://mercyhouseatc.com/donate | head -30
```

Expected: the normal shell with `<div id="root">` and the module script —
**not** the prerendered snapshot. Hado must serve snapshots only to crawlers.
If humans receive prerendered HTML too, that is a misconfiguration; and if
crawler and human content ever diverge in substance, it becomes cloaking.
