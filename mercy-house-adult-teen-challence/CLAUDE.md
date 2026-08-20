# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website + back-office app for **Mercy House Adult Teen Challenge**, a faith-based addiction-recovery nonprofit. It is a **Base44 app**: a Vite + React 18 (JSX) frontend in `src/`, backed by Base44's hosted platform (auth, database entities, serverless functions) defined in `base44/`. Code pushed to this repo is also reflected in the Base44 Builder, and vice-versa — the platform owns several files (see "Generated / platform-owned files").

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # Production build to ./dist
npm run preview    # Preview the production build
npm run lint       # ESLint (--quiet; errors only)
npm run lint:fix   # ESLint autofix
npm run typecheck  # tsc against jsconfig.json (checkJs on src/pages, src/components, Layout)
```

There is **no test runner** configured. Don't claim tests pass — there are none.

Requires `.env.local` with `VITE_BASE44_APP_ID` and `VITE_BASE44_APP_BASE_URL` (see `README.md`). The app id is also committed in `base44/.app.jsonc`.

## Architecture

### Frontend ↔ Base44 backend
Everything talks to the backend through a single client: `src/api/base44Client.js` exports `base44` (from `@base44/sdk`). Connection params (`appId`, `token`, `appBaseUrl`, `functionsVersion`) come from `src/lib/app-params.js`, which reads them from URL query params (e.g. `?access_token=...`), then `localStorage` (`base44_*` keys), then Vite env vars — in that order. The client is configured `requiresAuth: false`, so public pages render for anonymous visitors.

Three access patterns through `base44`:
- **Entities (database):** `base44.entities.<Name>.list() | filter(query, sort, limit) | create(data) | update(id, data)`. Entity schemas live in `base44/entities/*.jsonc` (JSON Schema + row-level security in the `rls` block). Examples: `Application`, `VehicleDonation`, `Volunteer`, `Testimonial`, `BlogPost`, `Campaign`, `Event`, `Resident`, `BedCount`, `WomensCampusMedia`.
- **Functions (serverless):** `base44.functions.invoke('<name>', payload)`. Each is a Deno handler at `base44/functions/<name>/entry.ts` using `npm:@base44/sdk` and `Deno.env.get(...)` for secrets (Stripe keys, etc.). Payments (`create*Checkout`, `stripeWebhook`), Google integrations (Search Console, Drive, Facebook), and LLM-backed generation (`generateTestimonial`) live here.
- **Integrations / auth:** `base44.auth.me() | isAuthenticated() | redirectToLogin() | logout()`; inside functions, `base44.integrations.Core.SendEmail/InvokeLLM` and `base44.asServiceRole.*` for privileged operations.

Server-side authorization is enforced by each entity's `rls` block (e.g. residents/staff see only their own `Application`; `admin` role sees all). The frontend's `requiresAuth: false` is **not** the security boundary — RLS is.

**Form submissions** write through Base44, not a third-party form host: public forms call either `base44.entities.<Name>.create(...)` or a serverless function via `base44.functions.invoke('submitIntakeApplication' | 'createDonationCheckout' | ...)` (see `Donate`, `IntakeForm`, `VehicleDonationForm`, `SponsorStudent`, `Support`). The one exception is `src/pages/Volunteer.jsx`, which uses `@formspree/react` — don't treat Formspree as the house pattern.

### Routing
Two-tier and partly auto-generated:
- `src/pages.config.js` is **auto-generated** — pages are registered automatically from files. The only hand-editable value is `mainPage`. Do not add imports there manually.
- `src/App.jsx` builds routes from `pagesConfig.PAGES` (path `/PascalCasePageName`) **and** declares additional routes by hand (e.g. `/MeetTheTeam`, `/About`, `/help-for-dependency-abuse`, `/FreedomClassic`). When adding a page that isn't auto-picked-up, wire it into the `<Routes>` block in `App.jsx`.
- Build hrefs with `createPageUrl(name)` from `src/utils/index.ts` (prefixes `/`, replaces spaces with `-`).

`src/Layout.jsx` wraps every page (nav, footer, floating chat/WhatsApp buttons). `NavigationTracker`, `ScrollRestoration`/`ScrollToTop`, React Query (`src/lib/query-client.js`), and `AuthProvider` (`src/lib/AuthContext.jsx`) wrap the app in `App.jsx`. Data fetching is **TanStack React Query** + the `base44` client — follow the existing `useQuery({ queryKey, queryFn: () => base44.entities... })` pattern.

### Employee/admin area
`src/pages/EmployeePortal.jsx` is the staff back-office: it gates on `base44.auth` and composes the managers in `src/components/employee/*` (Applications, Volunteers, Testimonials, Blog, Campaigns, Events, Integrations, Agent, WomensCampusMedia) plus analytics (`DonationFunnel`, `SearchPerformance`). Public-facing recovery/donation pages are the rest of `src/pages/`.

### AI assistant
`base44/agents/mercy_house_assistant.jsonc` defines the site chatbot (surfaced by `src/components/FloatingAIChat.jsx`) — a scoped, read-only assistant with per-entity `tool_configs`. `base44/connectors/*.jsonc` declare external connectors (Gmail, Google Analytics/Search Console, Google Drive).

## UI conventions

- **shadcn/ui** primitives in `src/components/ui/` (Radix + CVA + Tailwind). Config in `components.json`. Treat these as vendored — they're excluded from lint/typecheck; don't hand-edit unless intentionally customizing.
- Tailwind (`tailwind.config.js`) with `class`-based dark mode (`next-themes` + `DarkModeToggle`). `framer-motion` for animation, `lucide-react` for icons, `sonner`/`react-hot-toast` for toasts, `recharts` for analytics charts, `react-leaflet` for maps.
- Path alias `@/` → `src/` (in `jsconfig.json` and the Vite/Base44 plugin).
- The project is **JS/JSX, not TS**, for app code (only `src/utils/index.ts` and the `base44/functions` are TS). `jsconfig.json` runs `checkJs` over `src/pages`, `src/components` (excluding `ui`), and `Layout.jsx`.

## Generated / platform-owned files — edit with care

- `src/pages.config.js` — auto-generated route registry (only `mainPage` is editable).
- `base44/` — mirrors Base44 Builder state; entity schemas, functions, agents, connectors. Editing here changes the live app config on next push/sync.
- Root-level `pages/Home`, `pages/VehicleDonation`, `pages/WomensCampus` (extensionless) — Base44 page-registration artifacts that duplicate files under `src/pages/`. The real source is `src/pages/*.jsx`.
- `src/components/ui/` — shadcn/ui generated primitives.

## Deployment

Build/serve commands are declared in `base44/config.jsonc` (`installCommand`, `buildCommand`, `serveCommand`, `outputDirectory: ./dist`). Publishing is done from Base44.com (or via repo push, which syncs to the Builder) — there is no separate CI/deploy script in this repo.