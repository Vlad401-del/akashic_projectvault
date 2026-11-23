create index if not exists team_discussions_author_idx on public.team_discussions(author_id);
create index if not exists team_discussions_reply_team_idx on public.team_discussions(reply_to_id,team_id);
create index if not exists team_intros_team_role_idx on public.team_intros(team_id,role);
create index if not exists projects_cover_src_idx on public.projects ((story->'cover'->>'src')) where status='published';
drop policy "Applicant can send intro to open team" on public.team_intros;
create policy "Applicant can send intro to open team" on public.team_intros for insert to authenticated with check (
sender_id=(select auth.uid()) and review='baru' and joined_at is null and exists(select 1 from public.team_posts p where p.id=team_id and p.status='open' and p.owner_id<>(select auth.uid())));
alter table public.projects add constraint projects_cover_owner_check check (
coalesce(story->'cover'->>'src','') not like '/api/project-cover/%'
or story->'cover'->>'src' like '/api/project-cover/' || owner_id::text || '/%');
drop policy "Read visible project covers" on storage.objects;
create policy "Read visible project covers" on storage.objects for select to anon,authenticated using (
bucket_id='project-covers' and ((storage.foldername(name))[1]=(select auth.uid())::text or exists (
select 1 from public.projects p join public.profiles u on u.id=p.owner_id where p.status='published' and u.is_published
and p.owner_id::text=(storage.foldername(name))[1] and p.story->'cover'->>'src'='/api/project-cover/' || name)));
