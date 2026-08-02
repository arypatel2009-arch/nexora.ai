-- 003_indexes_and_triggers.sql

-- Indexes — status is filtered on every public read; slug is looked up
-- on every detail page.
create index idx_services_status on services (status);
create index idx_industries_status on industries (status);
create index idx_projects_status on projects (status);
create index idx_projects_slug on projects (slug);
create index idx_projects_category on projects (category);
create index idx_case_studies_project on "case_studies" ("projectId");
create index idx_testimonials_status on testimonials (status);
create index idx_pricing_plans_status on "pricing_plans" (status);
create index idx_faqs_status on faqs (status);
create index idx_blog_posts_status on "blog_posts" (status);
create index idx_blog_posts_slug on "blog_posts" (slug);
create index idx_blog_posts_category on "blog_posts" (category);
create index idx_team_members_status on "team_members" (status);
create index idx_careers_status on careers (status);
create index idx_contact_requests_status on "contact_requests" (status);
create index idx_contact_requests_created on "contact_requests" ("createdAt" desc);

-- Generic updated-at trigger, applied to every table that has the column.
create or replace function set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_services_updated_at before update on services
  for each row execute function set_updated_at();
create trigger trg_industries_updated_at before update on industries
  for each row execute function set_updated_at();
create trigger trg_projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger trg_case_studies_updated_at before update on "case_studies"
  for each row execute function set_updated_at();
create trigger trg_blog_posts_updated_at before update on "blog_posts"
  for each row execute function set_updated_at();

-- Auto-set publishedAt the first time a project/post moves to 'published'.
create or replace function set_published_at()
returns trigger as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' and new."publishedAt" is null then
    new."publishedAt" = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_published_at before update on projects
  for each row execute function set_published_at();
create trigger trg_blog_posts_published_at before update on "blog_posts"
  for each row execute function set_published_at();
