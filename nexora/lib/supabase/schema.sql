-- Nexora — Supabase schema (LEGACY REFERENCE)
-- Superseded by supabase/migrations/001-007, which use camelCase
-- (quoted) column names that match lib/types.ts exactly — required
-- because lib/repositories/supabase-repository.ts passes objects
-- straight through with no snake_case mapping. Use
-- supabase/migrations/ for a real setup; this file is kept only as an
-- idiomatic-SQL-naming reference and is not run by any part of the app.

create extension if not exists "pgcrypto";

create type publish_status as enum ('draft', 'published');
create type contact_request_status as enum ('new', 'in-progress', 'resolved', 'archived');
create type project_category as enum ('Automation', 'Chatbot', 'Website', 'Advertising', 'Consulting');

create table services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text not null,
  description text not null,
  outcomes text[] not null default '{}',
  icon text not null,
  availability text not null check (availability in ('live', 'coming-soon')),
  status publish_status not null default 'draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table industries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  pain_point text not null,
  solution text not null,
  icon text not null,
  status publish_status not null default 'draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text not null,
  industry text not null,
  category project_category not null,
  summary text not null,
  body text not null default '',
  results jsonb not null default '[]',        -- [{ label, value }]
  cover_image text,
  gallery text[] not null default '{}',
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  challenge text not null,
  approach text not null,
  outcome text not null,
  status publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null,
  author_company text not null,
  avatar text,
  rating int not null check (rating between 1 and 5),
  status publish_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price text not null,
  billing_note text not null,
  description text not null,
  features text[] not null default '{}',
  highlighted boolean not null default false,
  status publish_status not null default 'draft',
  "order" int not null default 0
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  status publish_status not null default 'draft',
  "order" int not null default 0
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null,
  tags text[] not null default '{}',
  author_name text not null,
  author_role text not null,
  author_avatar text,
  featured_image text,
  seo_meta_title text,
  seo_meta_description text,
  status publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  avatar text,
  status publish_status not null default 'draft',
  "order" int not null default 0
);

create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  country text not null,
  service text not null,
  budget text,
  message text not null,
  status contact_request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table site_settings (
  id int primary key default 1,
  company_name text not null,
  tagline text not null,
  founder text not null,
  email text not null,
  phone text not null,
  domain text not null,
  primary_cta text not null,
  secondary_cta text not null,
  constraint single_row check (id = 1)
);

-- Admin users are managed via Supabase Auth directly (auth.users) —
-- no separate table needed. Gate access with a Row Level Security
-- policy checking auth.uid() against an allow-list, or a custom claim.

-- Row Level Security — public can read published rows only;
-- writes require an authenticated (admin) session.
alter table services enable row level security;
alter table industries enable row level security;
alter table projects enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table pricing_plans enable row level security;
alter table faqs enable row level security;
alter table blog_posts enable row level security;
alter table team_members enable row level security;
alter table contact_requests enable row level security;

create policy "public read published services" on services for select using (status = 'published');
create policy "public read published industries" on industries for select using (status = 'published');
create policy "public read published projects" on projects for select using (status = 'published');
create policy "public read published testimonials" on testimonials for select using (status = 'published');
create policy "public read published pricing" on pricing_plans for select using (status = 'published');
create policy "public read published faqs" on faqs for select using (status = 'published');
create policy "public read published blog posts" on blog_posts for select using (status = 'published');
create policy "public read published team" on team_members for select using (status = 'published');

create policy "authenticated full access services" on services for all using (auth.role() = 'authenticated');
create policy "authenticated full access industries" on industries for all using (auth.role() = 'authenticated');
create policy "authenticated full access projects" on projects for all using (auth.role() = 'authenticated');
create policy "authenticated full access case studies" on case_studies for all using (auth.role() = 'authenticated');
create policy "authenticated full access testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "authenticated full access pricing" on pricing_plans for all using (auth.role() = 'authenticated');
create policy "authenticated full access faqs" on faqs for all using (auth.role() = 'authenticated');
create policy "authenticated full access blog posts" on blog_posts for all using (auth.role() = 'authenticated');
create policy "authenticated full access team" on team_members for all using (auth.role() = 'authenticated');

create policy "anyone can submit a contact request" on contact_requests for insert with check (true);
create policy "authenticated can read contact requests" on contact_requests for select using (auth.role() = 'authenticated');
create policy "authenticated can update contact requests" on contact_requests for update using (auth.role() = 'authenticated');
