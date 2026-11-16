drop policy "Everyone can read team posts" on public.team_posts;
create policy "Published owner or team owner can read team post" on public.team_posts
  for select to anon, authenticated using (
    owner_id = (select auth.uid()) or
    exists (select 1 from public.profiles profile
      where profile.id = owner_id and profile.is_published)
  );

drop policy "Everyone can read team roles" on public.team_roles;
create policy "Visible team roles can be read" on public.team_roles
  for select to anon, authenticated using (
    exists (select 1 from public.team_posts post where post.id = team_id)
  );

drop policy "Everyone can read team discussion" on public.team_discussions;
create policy "Visible team discussion can be read" on public.team_discussions
  for select to anon, authenticated using (
    exists (select 1 from public.team_posts post where post.id = team_id)
  );
