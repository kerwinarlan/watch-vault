<div align="center">

# ⌚ ChronoVault

**Luxury watch reseller inventory platform + admin broadcast suite**

[![Next.js](https://img.shields.io/badge/Next.js%2016-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![node:test](https://img.shields.io/badge/tests-node:test-5FA04E)](https://nodejs.org/api/test.html)

</div>

A high-end luxury watch reseller storefront with a private inventory manager
and a one-click **broadcast suite** that pushes promotional posts to Viber,
Facebook, X and WhatsApp through **web-native deep links** - no paid bot API
required.

---

## Table of Contents

- [Why it exists: the EUR 100/mo Viber bot fee](#why-it-exists-the-eur-100mo-viber-bot-fee)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [API Reference](#api-reference)
- [Deep-Link Engine](#deep-link-engine)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Validation](#validation)
- [Agentic Workflow](#agentic-workflow)
- [Notes & Roadmap](#notes--roadmap)

---

## Why it exists: the EUR 100/mo Viber bot fee

Official Viber bots now carry a mandatory **EUR 100/month fee**, and the
classic integration (`POST chatapi.viber.com/pa/post` with a bot token) also
requires certified-webhook infrastructure. ChronoVault bypasses the bot API
entirely:

| Capability | Mechanism | Cost |
|---|---|---|
| Broadcast to Viber | `viber://forward?text=<encoded>` opens Viber with the post pre-filled in the forward composer | EUR 0 |
| Desktop fallback | Copy Text button | EUR 0 |
| Share to socials | Facebook / X / WhatsApp share intent URLs | EUR 0 |
| Catalog inquiries | `viber://forward` with a per-watch inquiry message | EUR 0 |

Result: full broadcast capability with zero API fees and zero webhook
infrastructure. `viber://forward` works on iOS and Android Viber; Copy Text
covers desktop.

## Features

**Catalog (`/`)**

- Dark luxury storefront with an ink/gold/ivory palette and Playfair Display
  typography
- Filter chips: Brand, Price range (USD-equivalent; PHP pegged at 56/USD),
  Condition, Availability - single-select with toggle and Reset
- Photo gallery modal: thumbnails, prev/next, arrow-key and Escape support
- "Inquire on Viber" CTA on every watch (pre-filled inquiry via deep link)
- `/?watch=<id>` opens a specific listing's modal - this is what broadcast
  links point back to

**Admin & Broadcast (`/admin`)**

- Add/edit watch form: Name, Brand, Reference #, Price, Currency (USD/PHP),
  Condition (New / Pre-owned / Mint), Status (Available / Reserved / Sold),
  image URLs
- Inventory list with per-watch Edit and Broadcast actions
- Broadcast Hub: formats a high-converting promo post, then one-click:
  **Copy Text** · **Open Viber (pre-filled)** · **Share Facebook** ·
  **Share X** · **Share WhatsApp**

**Schema (`supabase/schema.sql`)**

- `watches` table with CHECK constraints on currency / condition / status
- Row Level Security: public read for the catalog, admin write for
  authenticated users
- Indexes on `brand` and `status` for catalog filtering

## Tech Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **Tailwind CSS v4** - custom `@theme` luxury design tokens
- **Supabase (Postgres)** - RLS: public read for the catalog; admin writes go
  through a server-side service-role route handler that never reaches the
  browser
- **Node's built-in test runner** (`node:test`) - 6 behavior tests with zero
  test framework; TypeScript types stripped at runtime via
  `--experimental-strip-types`

## Repository Layout

```
app/                pages (/, /admin) + POST/PUT /api/admin/watches
components/         catalog.tsx, admin.tsx (client components)
lib/                types.ts, supabase.ts, broadcast.ts (deep-link engine)
supabase/           schema.sql, seed.sql (5 sample watches)
tests/              broadcast.test.ts (node:test)
.env.example        documented env vars (see Local Setup)
```

## API Reference

### `POST /api/admin/watches`

Creates a watch. **Returns `201`** with the created row on success.

Request body:

| Field | Type | Rules |
|---|---|---|
| `title` | string | required, non-empty |
| `brand` | string | required, non-empty |
| `price` | number | required, non-negative |
| `currency` | `"USD" \| "PHP"` | required |
| `condition` | `"New" \| "Pre-owned" \| "Mint"` | required |
| `status` | `"Available" \| "Reserved" \| "Sold"` | required |
| `reference` | string \| null | optional |
| `images` | string[] | optional, empty strings filtered out |

Errors: `400` invalid body or validation failure, `503` Supabase env vars not
configured, `500` database error.

### `PUT /api/admin/watches`

Updates an existing watch. Body must include the same fields as POST plus
`id` (positive integer). **Returns `200`** with the updated row, or **`404`**
when no watch matches the id (`PGRST116`).

> Both routes are **unauthenticated by design** for this portfolio demo. Gate
> them behind Supabase Auth or Vercel protection before production use.

## Deep-Link Engine

All broadcast behavior lives in `lib/broadcast.ts`, fully unit-tested:

| Function | Purpose |
|---|---|
| `buildPromoText(watch, siteUrl)` | Formats the promo post (title, ref, price, status, CTA, listing link). Omits the link when `siteUrl` is empty so no broken relative URL is ever shared |
| `listingUrl(watch, siteUrl)` | Builds `https://site/?watch=<id>`, strips trailing slashes |
| `inquireOnViberText(watch)` | Per-watch inquiry message pre-filled into Viber |
| `viberForwardLink(text)` | `viber://forward?text=<encoded>` deep link |
| `shareLinks(text, url)` | Facebook sharer, X intent, WhatsApp `wa.me` links |

`formatPrice` and `priceInUsd` live in `lib/types.ts` - `Intl.NumberFormat`
with zero decimal places, and the PHP-at-56/USD conversion used by the
price-range filter.

## Local Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

1. Create a Supabase project, then run `supabase/schema.sql` followed by
   `supabase/seed.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - project
     API settings (safe for the browser)
   - `SUPABASE_SERVICE_ROLE_KEY` - server-only; powers admin writes
   - `NEXT_PUBLIC_SITE_URL` - your public origin, used in broadcast listing
     links (omit only if you do not want a listing link in posts)

## Deployment

ChronoVault is a standard Next.js 16 app and deploys to any platform that
supports it (Vercel, Netlify, Cloudflare Workers):

1. Push the repo and import it in your platform's dashboard.
2. Set the four env vars from `.env.example` in the project settings.
3. Re-run `supabase/schema.sql` against your production Supabase project.

## Validation

```bash
npm test          # 6 behavior tests for the deep-link engine (node:test)
npm run lint      # eslint (Next.js flat config)
npm run build     # Next.js 16 production build + TypeScript type-check
```

The initial scaffold was also driven through the `no-mistakes` validation
pipeline: automated review surfaced 4 findings (dead 404 branch in the PUT
route, `Number("")` coercing empty price to $0, an unhandled clipboard
rejection, and broken relative listing links when `SITE_URL` is unset) - all
fixed and re-verified before the branch reached `main`.

## Agentic Workflow

Three parallel workstreams were dispatched and orchestrated by the lead agent:

| Workstream | Deliverable |
|---|---|
| Public Catalog UI | `components/catalog.tsx`, `app/page.tsx`, gallery modal |
| Admin & Broadcast Engine | `components/admin.tsx`, broadcast deep-link engine, `app/api/admin/watches/route.ts` |
| Database Schema | `supabase/schema.sql` + `seed.sql` (RLS: public read / admin write) |

The shared contracts were written first (`lib/types.ts` Watch model,
`lib/broadcast.ts` formatter + deep links) so the three workstreams stayed
independent and merged cleanly into the App Router tree.

## Notes & Roadmap

- The catalog uses `<img>` with graceful `onError` fallbacks instead of
  `next/image` because admin-entered image URLs are arbitrary and
  `next/image` hard-fails on unconfigured hosts.
- `viber://forward` opens Viber's forward composer with the post pre-filled on
  mobile; Copy Text is the universal fallback.
- **Roadmap (not yet built):** Supabase Auth on the admin route, image upload
  to Supabase Storage, and a `?utm_source=` parameter on broadcast links to
  measure which channel converts.
