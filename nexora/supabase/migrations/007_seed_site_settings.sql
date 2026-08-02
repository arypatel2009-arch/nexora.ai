-- 007_seed_site_settings.sql
-- site_settings is a single-row table — seed it once so the Admin CMS
-- Settings page has something to load and update on first connect.

insert into "site_settings" (id, "companyName", tagline, founder, email, phone, domain, "primaryCta", "secondaryCta")
values (
  1,
  'NEXORA',
  'Build. Automate. Scale.',
  'Ary Patel',
  'arypatel2009@gmail.com',
  '+91 6351003457',
  'nexora.ai',
  'Book a Free Strategy Call',
  'Talk to Our AI Assistant'
)
on conflict (id) do nothing;
