create table public.team_discussions (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references public.team_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null check (length(btrim(author_name)) between 1 and 100),
  body text not null check (length(btrim(body)) between 1 and 3000),
  reply_to_id uuid,
  created_at timestamptz not null default now(),
  unique (id, team_id),
  foreign key (reply_to_id, team_id) references public.team_discussions(id, team_id)
);
create index team_discussions_team_created_idx on public.team_discussions(team_id, created_at);
alter table public.team_discussions enable row level security;
revoke all on public.team_discussions from public, anon, authenticated;
grant select on public.team_discussions to anon;
grant select, insert on public.team_discussions to authenticated;
create policy "Everyone can read team discussion" on public.team_discussions
  for select to anon, authenticated using (true);
create policy "Account can write to open team discussion" on public.team_discussions
  for insert to authenticated with check (
    author_id = (select auth.uid()) and
    exists (select 1 from public.team_posts p where p.id = team_id and p.status = 'open')
  );
