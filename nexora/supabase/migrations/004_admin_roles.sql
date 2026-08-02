-- 004_admin_roles.sql
-- Role-based access for the Admin CMS. Real users live in Supabase
-- Auth's auth.users table; this table just maps a user id to a role.

create type "adminRole" as enum ('admin', 'editor');

create table "admin_roles" (
  "userId" uuid primary key references auth.users(id) on delete cascade,
  role "adminRole" not null default 'editor',
  "createdAt" timestamptz not null default now()
);

-- Helper used by RLS policies to check the current user's role.
create or replace function current_admin_role()
returns "adminRole" as $$
  select role from "admin_roles" where "userId" = auth.uid();
$$ language sql stable;

create or replace function is_admin()
returns boolean as $$
  select current_admin_role() = 'admin';
$$ language sql stable;
