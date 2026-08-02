# Nexora — Marketing Website + Enterprise Admin CMS

Next.js 15 (App Router) + TypeScript + Tailwind CSS. Premium light-mode
public site, plus a full Admin CMS, repository-pattern data layer, and
Supabase-ready backend.

## Quick start

```bash
npm install
npm run dev
```

- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin/login

**Demo admin accounts** (see "Auth" below — these are a mock, not real security):
- Admin — `admin@nexora.ai` / `nexora-admin` (full access)
- Editor — `editor@nexora.ai` / `nexora-editor` (no delete, no Settings)

Configure the primary admin account via `.env.local`:
```
NEXT_PUBLIC_ADMIN_EMAIL=admin@nexora.ai
NEXT_PUBLIC_ADMIN_PASSWORD=your-password
```

## Folder structure

```
app/
  (public pages)         Home, Services, Industries, Portfolio (+ [slug]),
                         Testimonials, Pricing, About, FAQ, Blog (+ [slug]),
                         Careers, Contact, Privacy, Terms, 404
  api/                   /contact /leads /blog /portfolio /testimonials /upload
  admin/
    login/               public
    forgot-password/     public
    (dashboard)/         guarded by AdminGuard — dashboard, services,
                         industries, portfolio, case-studies, reviews,
                         faqs, blog, team, careers, media,
                         contact-requests (Leads), settings

components/
  (public components)    Navbar, Footer, Hero, ServiceCard, IndustryTile,
                         ProcessTimeline, AutomationFlow, ContactForm, etc.
  admin/                 AdminDataTable, Modal, ConfirmDialog, fields.tsx,
                         StatusBadge, AdminSidebar, AdminTopbar, AdminGuard
  ui/                    Button, Card, SectionHeading, EmptyState

lib/
  types.ts               every content model — mirrors the Supabase schema
  seed/*.ts               seed data (source of truth for the public site;
                          portfolio/testimonials/blog/team/careers/media
                          start empty — no fake content anywhere)
  data.ts                 public site data layer (reads seed, filters
                          published, sorts by order)
  services/*.ts           Admin CMS service layer — one file per entity,
                          all built on entity-service.ts's factory
  repositories/           the actual data-access swap point:
    types.ts                Repository<T> interface
    local-repository.ts      localStorage-backed (today's default)
    supabase-repository.ts   generic Supabase CRUD (auto-activates)
    get-repository.ts        picks one based on env vars — nothing else
                             in the app needs to change
  supabase/client.ts       Supabase client (inactive until env vars set)
  supabase/schema.sql      legacy reference only — see supabase/migrations/
  admin/                   auth.ts (mock, role-aware), useAdminCollection
                          hook, session-context.tsx, theme-context.tsx
                          (admin-only dark mode)
  validation/contact.ts    shared zod schema (client form + /api/contact)
  api/response.ts          shared API response helpers

supabase/migrations/       run these, in order, against a real project:
  001_extensions_and_types.sql
  002_tables.sql
  003_indexes_and_triggers.sql
  004_admin_roles.sql
  005_row_level_security.sql
  006_storage.sql
  007_seed_site_settings.sql
```

## What's real vs. placeholder

- **Real:** company info, service/industry/FAQ/pricing content, contact details.
- **Intentionally empty (by design):** Portfolio, Testimonials, Blog, Team,
  Careers, and Media Library all start empty with a designed empty state —
  no fake projects, reviews, articles, bios, job posts, or stats anywhere.
  Add real ones through `/admin`.

## Connecting Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run each file in `supabase/migrations/` **in order**
   (001 through 007).
3. Add your API keys to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the dev server. That's it — `lib/repositories/get-repository.ts`
   detects the env vars and every `lib/services/*.ts` call automatically
   switches from the local mock to real Supabase tables. **Both** the
   Admin CMS and the public site (`lib/data.ts`) read through this same
   layer, so publishing something in Admin makes it appear on the public
   pages immediately — no separate wiring step needed.
5. Local mock storage (browser localStorage) is only ever used as a
   fallback when the env vars above are missing — e.g. during first-time
   setup before Supabase is connected. Once they're set, every read and
   write goes to Supabase.

Column names in the migrations are **camelCase** (quoted, e.g. `"shortDescription"`)
to match `lib/types.ts` exactly — `supabase-repository.ts` passes objects
straight through with no snake_case mapping. Keep this alignment if you
add new fields.

## Auth — before going live

`lib/admin/auth.ts` is a **client-side mock** for development convenience.
Replace it with:
- Supabase Auth (`supabase.auth.signInWithPassword`,
  `supabase.auth.resetPasswordForEmail` for the Forgot Password flow).
- A `middleware.ts` that checks the Supabase session server-side and
  redirects unauthenticated requests before any `/admin` page renders.
- Roles: `supabase/migrations/004_admin_roles.sql` already has an
  `admin_roles` table and an `is_admin()` helper used by the RLS
  policies in `005_row_level_security.sql` — read a user's role from
  that table after sign-in instead of the mock `MOCK_USERS` array.

## Admin CMS features

Every module (Services, Industries, Portfolio, Case Studies,
Testimonials, FAQs, Blog, Team, Careers, Media Library, Leads,
Settings) gets Create, Edit, Delete, Publish/Unpublish, Search,
Pagination, Loading states, Empty states, and a Confirmation dialog on
delete — all from the shared `AdminDataTable` + `Modal` +
`ConfirmDialog` components, so no module reimplements the pattern.

**Role-based access:** Editors can create/edit everything except they
can't delete records or access Settings (both admin-only, enforced
centrally in `AdminDataTable` and the Settings page).

**Enterprise dashboard chrome:** sidebar + topbar (search UI,
notifications with real unread-lead counts, user profile menu),
dark mode (scoped to `/admin` only — the public site is unaffected),
and a Forgot Password flow.

## Leads (CRM)

The public Contact form submits to the same `contact_requests` table
that the Admin CMS's **Leads** module manages — status
(new/in-progress/resolved/archived), internal notes, and filters by
status and service, alongside the standard search/pagination.

## Blog & Portfolio architecture

Blog: categories, tags, author, featured image, SEO fields, auto-computed
reading time, related posts, search, and a `/blog/[slug]` detail page
with Article structured data.

Portfolio: categories, client-side filters, featured/status flags, a
`/portfolio/[slug]` detail page with results and case-study body, and
Case Studies as a separate entity linked to a project for longer write-ups.

## API routes

`/api/contact` (POST, validated, inserts when Supabase is connected),
`/api/leads` (GET/PATCH, for future ops tooling — protect with real auth
before exposing), `/api/blog`, `/api/portfolio`, `/api/testimonials`
(GET, thin wrappers around the same published-only data as the public
pages), `/api/upload` (POST, Supabase Storage — see migration 006 for
the bucket + policies).

## Deploying on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel → Framework Preset: Next.js (auto-detected).
3. Add the environment variables from `.env.local` (Supabase URL/anon
   key, admin email/password) under Project Settings → Environment
   Variables.
4. Deploy. No build config changes needed — `next build` / `next start`
   work out of the box.
5. Once Supabase Auth replaces the mock login (see "Auth" above), also
   set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   the same place so both environments (local + deployed) stay in sync.

## Not yet built

- Real authentication (Supabase Auth + server-side middleware — see Auth)
- A rich text editor for blog/project bodies (currently Markdown in a
  plain textarea)
- Server-side pagination (current pagination is client-side over the
  full result set — fine at today's scale, revisit if content grows large)

## Before you deploy

This project was built and statically reviewed in an environment without
`npm install` access, so run these once locally before shipping:

```bash
npm install
npm run lint
npm run build
```

Every file was checked for brace/import consistency and every
server↔client data boundary was checked by hand, but that's not a
substitute for the real TypeScript compiler and ESLint — treat `npm run
build` as the actual final verification step.
