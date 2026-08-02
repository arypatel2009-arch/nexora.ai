-- 006_storage.sql
-- Creates the "media" bucket used by app/api/upload and the Admin CMS's
-- Media Library module.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "public read media files"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "authenticated can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "authenticated can delete own media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
