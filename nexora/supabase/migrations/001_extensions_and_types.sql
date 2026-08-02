-- 001_extensions_and_types.sql
-- Run these migrations in order via the Supabase SQL editor or CLI
-- (`supabase db push`). Column names are camelCase (quoted) to match
-- lib/types.ts exactly — the generic repository in
-- lib/repositories/supabase-repository.ts passes objects straight
-- through with no snake_case mapping, so this alignment is what makes
-- "set two env vars and it just works" true.

create extension if not exists "pgcrypto";

create type "publishStatus" as enum ('draft', 'published');
create type "contactRequestStatus" as enum ('new', 'in-progress', 'resolved', 'archived');
create type "projectCategory" as enum ('Automation', 'Chatbot', 'Website', 'Advertising', 'Consulting');
create type "careerType" as enum ('full-time', 'part-time', 'contract', 'internship');
