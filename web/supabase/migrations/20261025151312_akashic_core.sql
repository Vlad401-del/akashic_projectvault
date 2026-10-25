-- Tahap 1 cloud: struktur data dan izin.
-- Diterapkan pada proyek vrncyponqsuhqzldwrvw sebagai migration 20261025151312_akashic_core.
-- Isi cerita bertingkat disimpan dalam `story` (JSON object); validasi rinci
-- tetap wajib dilakukan server sebelum simpan/terbit pada tahap integrasi.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  display_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  program text not null default '',
  city text not null default '',
  skills text[] not null default '{}',
  contacts jsonb not null default '[]'::jsonb check (jsonb_typeof(contacts) = 'array'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,59}$'),
  title text not null check (length(btrim(title)) > 0),
  summary text not null default '' check (char_length(summary) <= 280),
  category text not null default '',
  work_type text not null default 'individu' check (work_type in ('individu', 'kelompok')),
  period text,
  course text,
  role text,
  team_size integer check (team_size is null or team_size > 1),
  skills text[] not null default '{}',
  tools text[] not null default '{}',
  story jsonb not null default '{}'::jsonb check (jsonb_typeof(story) = 'object'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

create index projects_owner_status_idx on public.projects (owner_id, status);

create table public.project_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  position integer not null check (position >= 0),
  label text not null check (length(btrim(label)) > 0),
  url text not null check (url ~* '^https://[^[:space:]]+$'),
  unique (project_id, position)
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  position integer not null check (position >= 0),
  storage_path text not null check (length(btrim(storage_path)) > 0),
  alt_text text not null default '',
  caption text,
  unique (project_id, position)
);

create index project_sources_project_idx on public.project_sources (project_id);
create index project_images_project_idx on public.project_images (project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_sources enable row level security;
alter table public.project_images enable row level security;

revoke all on public.profiles, public.projects, public.project_sources, public.project_images
  from anon, authenticated;
grant select on public.profiles, public.projects, public.project_sources, public.project_images to anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects, public.project_sources, public.project_images
  to authenticated;

create policy "Public or owner can read profile"
  on public.profiles for select to anon, authenticated
  using (is_published or id = (select auth.uid()));
create policy "Owner can create profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "Owner can update profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Public or owner can read project"
  on public.projects for select to anon, authenticated
  using (
    owner_id = (select auth.uid())
    or (
      status = 'published'
      and exists (
        select 1 from public.profiles profile
        where profile.id = owner_id and profile.is_published
      )
    )
  );
create policy "Owner can create project"
  on public.projects for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "Owner can update project"
  on public.projects for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy "Owner can delete project"
  on public.projects for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy "Public or owner can read project source"
  on public.project_sources for select to anon, authenticated
  using (
    exists (
      select 1 from public.projects project
      where project.id = project_id
        and (
          project.owner_id = (select auth.uid())
          or (project.status = 'published' and exists (
            select 1 from public.profiles profile
            where profile.id = project.owner_id and profile.is_published
          ))
        )
    )
  );
create policy "Owner can create project source"
  on public.project_sources for insert to authenticated
  with check (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));
create policy "Owner can update project source"
  on public.project_sources for update to authenticated
  using (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));
create policy "Owner can delete project source"
  on public.project_sources for delete to authenticated
  using (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));

create policy "Public or owner can read project image metadata"
  on public.project_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.projects project
      where project.id = project_id
        and (
          project.owner_id = (select auth.uid())
          or (project.status = 'published' and exists (
            select 1 from public.profiles profile
            where profile.id = project.owner_id and profile.is_published
          ))
        )
    )
  );
create policy "Owner can create project image metadata"
  on public.project_images for insert to authenticated
  with check (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));
create policy "Owner can update project image metadata"
  on public.project_images for update to authenticated
  using (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));
create policy "Owner can delete project image metadata"
  on public.project_images for delete to authenticated
  using (exists (
    select 1 from public.projects project
    where project.id = project_id and project.owner_id = (select auth.uid())
  ));

-- Storage bucket dan storage.objects policies ditambahkan bersama fitur unggah.
-- Metadata di project_images saja tidak memberikan izin membaca berkas gambar.
