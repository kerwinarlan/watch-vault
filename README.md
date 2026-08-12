# ChronoVault (watch-vault)

A high-end luxury watch reseller inventory platform with an admin broadcast
suite. Public dark-mode catalog, add/edit inventory, and a Broadcast Hub that
pushes promotional posts to Viber and socials through **web-native deep links** -
no paid bot API required.

## System Overview

ChronoVault is a full-stack portfolio project built on Next.js 16 (App Router):

1. **Public Catalog** - a dark luxury storefront with filter chips (Brand,
   Price, Condition, Availability), a keyboard-navigable photo gallery modal,
   and "Inquire on Viber" deep-link buttons on every watch.
2. **Admin & Broadcast Suite** (`/admin`) - a form to add/edit watches
   (Name, Reference #, Price in USD/PHP, Condition, Status, image URLs), an
   inventory list, and a Broadcast Hub that formats a high-converting promo
   post with one-click Copy, "Open Viber App with Pre-filled Post", and
   Facebook / X / WhatsApp share intents.
3. **Supabase backend** - a `watches` table with Row Level Security:
   public read, admin write.

## The problem: Viber's €100/mo bot fee

Official Viber bots now carry a mandatory **€100/month fee**. The classic
integration (POST to `chatapi.viber.com/pa/post` with a bot token) therefore
costs money and requires certified-webhook infrastructure. ChronoVault
bypasses the bot API entirely:

| Capability | Mechanism | Cost |
|---|---|---|
| Broadcast to Viber | `viber://forward?text=<encoded>` opens Viber with the post pre-filled in the forward composer | €0 |
| Desktop fallback | Copy Text button | €0 |
| Share to socials | Facebook / X / WhatsApp share intent URLs | €0 |
| Catalog inquiries | `viber://forward` with a per-watch inquiry message | €0 |

Result: full broadcast capability with zero API fees and zero webhook
infrastructure. `viber://forward` works on iOS and Android Viber; Copy Text
covers desktop.

## Tech Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **Tailwind CSS v4** - custom luxury theme (ink/gold/ivory palette,
  Playfair Display + Inter via `next/font`)
- **Supabase** (Postgres) - RLS: public read for the catalog, admin writes
  through a service-role route handler that never reaches the browser
- **Node's built-in test runner** - behavior tests with zero test framework

## Features

**Catalog (`/`)**
- Filter chips: Brand, Price range (USD-equivalent, PHP pegged at 56/USD),
  Condition, Availability - single-select with toggle + Reset
- Photo gallery modal: thumbnails, prev/next, arrow-key and Escape support
- "Inquire on Viber" CTA per watch (pre-filled inquiry via deep link)
- `/?watch=<id>` opens a specific listing's modal (used by broadcast links)

**Admin & Broadcast (`/admin`)**
- Add/edit watch form: Name, Brand, Reference #, Price, Currency (USD/PHP),
  Condition (New/Pre-owned/Mint), Status (Available/Reserved/Sold), image URLs
- Inventory list with Edit / Broadcast actions
- Broadcast Hub: formats the promo post, then one-click:
  Copy Text · Open Viber (pre-filled) · Share Facebook · Share X · Share WhatsApp

**Schema (`supabase/schema.sql`)**
- `watches` table with CHECK constraints on currency/condition/status
- RLS: `public read` for SELECT, `admin write` policies for authenticated
- Indexes on `brand` and `status` for catalog filters

## Repository Layout

```
app/                pages (/, /admin) + POST/PUT /api/admin/watches
components/         catalog.tsx, admin.tsx (client components)
lib/                types.ts, supabase.ts, broadcast.ts (deep-link engine)
supabase/           schema.sql, seed.sql (5 sample watches)
tests/              broadcast.test.ts (node:test)
```

## Agentic Workflow

Three parallel workstreams were dispatched, orchestrated by the lead agent:

| Agent | Workstream | Deliverable |
|---|---|---|
| Agent 1 | Public Catalog UI | `components/catalog.tsx`, `app/page.tsx`, gallery modal |
| Agent 2 | Admin & Broadcast Engine | `components/admin.tsx`, broadcast deep-link engine, `app/api/admin/watches/route.ts` |
| Agent 3 | Database Schema | `supabase/schema.sql` + `seed.sql` (RLS: public read / admin write) |

Orchestration pattern: the shared contracts were written first
(`lib/types.ts` Watch model, `lib/broadcast.ts` formatter + deep links) so the
three workstreams stayed independent and merged cleanly into the App Router
tree. Assembly was validated with the behavior test suite, `eslint`, a
production `next build`, and finally the `no-mistakes` validation pipeline
before the initial commit reached `main`.

## Local Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

1. Create a Supabase project, run `supabase/schema.sql` then `supabase/seed.sql`
   in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (project API settings)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, powers admin writes)
   - `NEXT_PUBLIC_SITE_URL` (used in broadcast listing links)

## Validation

```bash
npm test          # 6 behavior tests for the deep-link engine (node:test)
npm run lint      # eslint (Next.js flat config)
npm run build     # Next.js 16 production build + TypeScript
```

## Notes

- The admin API route is **unauthenticated by design** for this portfolio
  demo. Gate it behind Supabase Auth / Vercel protection before production.
- `viber://forward` opens Viber's forward composer with the post pre-filled on
  mobile; Copy Text is the universal fallback.
- Image URLs are admin-entered and arbitrary, so the catalog uses `<img>` with
  graceful `onError` fallbacks instead of `next/image` (which hard-fails on
  unconfigured hosts).
