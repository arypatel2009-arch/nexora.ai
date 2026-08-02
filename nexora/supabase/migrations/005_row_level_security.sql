-- 005_row_level_security.sql

alter table services enable row level security;
alter table industries enable row level security;
alter table projects enable row level security;
alter table "case_studies" enable row level security;
alter table testimonials enable row level security;
alter table "pricing_plans" enable row level security;
alter table faqs enable row level security;
alter table "blog_posts" enable row level security;
alter table "team_members" enable row level security;
alter table careers enable row level security;
alter table "media_assets" enable row level security;
alter table "contact_requests" enable row level security;
alter table "site_settings" enable row level security;
alter table "admin_roles" enable row level security;

-- Public read: published rows only
create policy "public read published services" on services for select using (status = 'published');
create policy "public read published industries" on industries for select using (status = 'published');
create policy "public read published projects" on projects for select using (status = 'published');
create policy "public read published testimonials" on testimonials for select using (status = 'published');
create policy "public read published pricing" on "pricing_plans" for select using (status = 'published');
create policy "public read published faqs" on faqs for select using (status = 'published');
create policy "public read published blog posts" on "blog_posts" for select using (status = 'published');
create policy "public read published team" on "team_members" for select using (status = 'published');
create policy "public read published careers" on careers for select using (status = 'published');
create policy "public read site settings" on "site_settings" for select using (true);

-- Authenticated (any admin role) — full CRUD on content
create policy "authenticated full access services" on services for all using (auth.role() = 'authenticated');
create policy "authenticated full access industries" on industries for all using (auth.role() = 'authenticated');
create policy "authenticated full access projects" on projects for all using (auth.role() = 'authenticated');
create policy "authenticated full access case studies" on "case_studies" for all using (auth.role() = 'authenticated');
create policy "authenticated full access testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "authenticated full access pricing" on "pricing_plans" for all using (auth.role() = 'authenticated');
create policy "authenticated full access faqs" on faqs for all using (auth.role() = 'authenticated');
create policy "authenticated full access blog posts" on "blog_posts" for all using (auth.role() = 'authenticated');
create policy "authenticated full access team" on "team_members" for all using (auth.role() = 'authenticated');
create policy "authenticated full access careers" on careers for all using (auth.role() = 'authenticated');
create policy "authenticated full access media" on "media_assets" for all using (auth.role() = 'authenticated');

-- Leads: anyone can submit, only authenticated staff can read/update
create policy "anyone can submit a lead" on "contact_requests" for insert with check (true);
create policy "authenticated can read leads" on "contact_requests" for select using (auth.role() = 'authenticated');
create policy "authenticated can update leads" on "contact_requests" for update using (auth.role() = 'authenticated');

-- Settings + roles: admin role only (editors can view content but not
-- change company-wide settings or grant roles)
create policy "admin can update settings" on "site_settings" for update using (is_admin());
create policy "admin can manage roles" on "admin_roles" for all using (is_admin());
create policy "user can read own role" on "admin_roles" for select using ("userId" = auth.uid());

-- Editors are still "authenticated" so the blanket policies above cover
-- create/edit for them; to make Delete admin-only instead, replace the
-- relevant "for all" policy above with separate "for select, insert,
-- update" (editor) and "for delete" (is_admin()) policies per table.
