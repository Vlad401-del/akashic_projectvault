-- Team Finder pivot: additive schema. Existing accounts and portfolio data stay intact.
create table public.team_posts (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{2,119}$'),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(btrim(title)) between 3 and 160),
  competition text not null default '',
  summary text not null check (length(btrim(summary)) between 20 and 5000),
  current_members integer not null default 1 check (current_members >= 1),
  target_members integer not null check (target_members > current_members),
  weekly_hours integer not null check (weekly_hours between 1 and 80),
  deadline text not null default '',
  meeting_note text not null default '',
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index team_posts_owner_idx on public.team_posts (owner_id, created_at desc);
create index team_posts_open_idx on public.team_posts (created_at desc) where status = 'open';

create table public.team_roles (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references public.team_posts(id) on delete cascade,
  position integer not null check (position >= 0),
  title text not null check (length(btrim(title)) between 2 and 100),
  skills text[] not null default '{}',
  unique (team_id, position),
  unique (team_id, title)
);
create index team_roles_team_idx on public.team_roles (team_id);

create table public.team_intros (
  id uuid primary key default gen_random_uuid(),
  team_id text not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null check (length(btrim(sender_name)) between 1 and 100),
  role text not null,
  weekly_hours text not null check (length(btrim(weekly_hours)) between 1 and 100),
  bring text not null check (length(btrim(bring)) between 10 and 3000),
  learn text not null default '',
  proof_url text not null default '' check (proof_url = '' or proof_url ~* '^https://[^[:space:]]+$'),
  contact text not null check (length(btrim(contact)) between 3 and 300),
  review text not null default 'baru' check (review in ('baru', 'diskusi', 'diterima', 'ditolak')),
  created_at timestamptz not null default now(),
  foreign key (team_id, role) references public.team_roles (team_id, title)
);
create index team_intros_sender_idx on public.team_intros (sender_id, created_at desc);
create index team_intros_team_idx on public.team_intros (team_id, created_at desc);

alter table public.team_posts enable row level security;
alter table public.team_roles enable row level security;
alter table public.team_intros enable row level security;

revoke all on public.team_posts, public.team_roles, public.team_intros from public, anon, authenticated;
grant select on public.team_posts, public.team_roles to anon;
grant select, insert, update, delete on public.team_posts, public.team_roles to authenticated;
grant select, insert on public.team_intros to authenticated;
grant update (review) on public.team_intros to authenticated;

create policy "Everyone can read team posts" on public.team_posts
  for select to anon, authenticated using (true);
create policy "Owner can create team post" on public.team_posts
  for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "Owner can update team post" on public.team_posts
  for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Owner can delete team post" on public.team_posts
  for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "Everyone can read team roles" on public.team_roles
  for select to anon, authenticated using (true);
create policy "Owner can create team role" on public.team_roles
  for insert to authenticated with check (
    exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid()))
  );
create policy "Owner can update team role" on public.team_roles
  for update to authenticated
  using (exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid())));
create policy "Owner can delete team role" on public.team_roles
  for delete to authenticated
  using (exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid())));

create policy "Sender and team owner can read intro" on public.team_intros
  for select to authenticated
  using (
    sender_id = (select auth.uid()) or
    exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid()))
  );
create policy "Applicant can send intro to open team" on public.team_intros
  for insert to authenticated
  with check (
    sender_id = (select auth.uid()) and
    exists (select 1 from public.team_posts p
      where p.id = team_id and p.status = 'open' and p.owner_id <> (select auth.uid()))
  );
create policy "Team owner can review intro" on public.team_intros
  for update to authenticated
  using (exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.team_posts p where p.id = team_id and p.owner_id = (select auth.uid())));
