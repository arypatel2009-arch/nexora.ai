-- 002_tables.sql

create table services (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  "shortDescription" text not null,
  description text not null,
  outcomes text[] not null default '{}',
  icon text not null,
  availability text not null check (availability in ('live', 'coming-soon')),
  status "publishStatus" not null default 'draft',
  "order" int not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table industries (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  "painPoint" text not null,
  solution text not null,
  icon text not null,
  status "publishStatus" not null default 'draft',
  "order" int not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table projects (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  title text not null,
  client text not null,
  industry text not null,
  category "projectCategory" not null,
  summary text not null,
  body text not null default '',
  results jsonb not null default '[]',        -- [{ label, value }]
  "coverImage" text,
  gallery text[] not null default '{}',
  status "publishStatus" not null default 'draft',
  "publishedAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table "case_studies" (
  id text primary key default gen_random_uuid()::text,
  "projectId" text references projects(id) on delete cascade,
  challenge text not null,
  approach text not null,
  outcome text not null,
  status "publishStatus" not null default 'draft',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table testimonials (
  id text primary key default gen_random_uuid()::text,
  quote text not null,
  "authorName" text not null,
  "authorRole" text not null,
  "authorCompany" text not null,
  avatar text,
  rating int not null check (rating between 1 and 5),
  status "publishStatus" not null default 'draft',
  "createdAt" timestamptz not null default now()
);

create table "pricing_plans" (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  price text not null,
  "billingNote" text not null,
  description text not null,
  features text[] not null default '{}',
  highlighted boolean not null default false,
  status "publishStatus" not null default 'draft',
  "order" int not null default 0
);

create table faqs (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null,
  category text not null,
  status "publishStatus" not null default 'draft',
  "order" int not null default 0
);

create table "blog_posts" (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null,
  tags text[] not null default '{}',
  author jsonb not null default '{"name":"","role":"","avatar":null}',
  "featuredImage" text,
  seo jsonb not null default '{"metaTitle":"","metaDescription":""}',
  status "publishStatus" not null default 'draft',
  "publishedAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table "team_members" (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text not null,
  bio text not null,
  avatar text,
  status "publishStatus" not null default 'draft',
  "order" int not null default 0
);

create table careers (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  title text not null,
  department text not null,
  location text not null,
  type "careerType" not null,
  description text not null,
  requirements text[] not null default '{}',
  status "publishStatus" not null default 'draft',
  "order" int not null default 0
);

create table "media_assets" (
  id text primary key default gen_random_uuid()::text,
  "fileName" text not null,
  url text not null,
  "altText" text not null default '',
  "mimeType" text not null,
  "sizeBytes" bigint not null,
  "createdAt" timestamptz not null default now()
);

create table "contact_requests" (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  company text,
  email text not null,
  phone text,
  country text not null,
  service text not null,
  budget text,
  message text not null,
  status "contactRequestStatus" not null default 'new',
  notes text not null default '',
  "createdAt" timestamptz not null default now()
);

create table "site_settings" (
  id int primary key default 1,
  "companyName" text not null,
  tagline text not null,
  founder text not null,
  email text not null,
  phone text not null,
  domain text not null,
  "primaryCta" text not null,
  "secondaryCta" text not null,
  constraint single_row check (id = 1)
);

-- Admin users/roles are managed via Supabase Auth (auth.users) plus a
-- thin roles table — see 006_admin_roles.sql.
