-- Lindungi status "diterima" dari downgrade via jalur apapun termasuk API langsung.
--
-- Strategi: trigger BEFORE UPDATE di tabel team_intros.
-- Trigger lebih aman dari RLS policy dengan subquery self-referential karena
-- trigger membaca OLD.review yang sudah pasti nilai saat ini, bukan query
-- ke tabel yang sedang di-update.
--
-- Policy lama "Team owner can review intro" (tanpa 's') dari migrasi 125554
-- dibersihkan di sini agar tidak ada dua policy update yang saling tumpang tindih.
-- Policy baru yang lebih sederhana menggantikannya: hanya izinkan pemilik tim
-- mengubah kolom review; perlindungan transisi ditangani trigger.

-- 1. Hapus policy lama (nama tanpa 's' dari migrasi awal).
drop policy if exists "Team owner can review intro" on public.team_intros;

-- 2. Hapus juga policy yang dibuat di draft migrasi ini sebelumnya (nama dengan 's')
--    supaya idempoten kalau migration pernah dijalankan sebagian.
drop policy if exists "Team owner can review intros" on public.team_intros;

-- 3. Buat ulang policy update yang bersih: hanya izinkan pemilik tim.
--    Perlindungan transisi review ada di trigger di bawah, bukan di sini.
create policy "Team owner can review intro" on public.team_intros
  for update to authenticated
  using (
    exists (
      select 1 from public.team_posts p
      where p.id = team_id and p.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.team_posts p
      where p.id = team_id and p.owner_id = (select auth.uid())
    )
  );

-- 4. Trigger BEFORE UPDATE: blokir downgrade dari "diterima".
--    Trigger ini bekerja bersama trigger confirm_team_join yang sudah ada
--    (dari migrasi 20261116015857) -- kedua trigger terdaftar BEFORE UPDATE,
--    PostgreSQL menjalankan keduanya; urutan berdasarkan nama, tapi keduanya
--    raise exception kalau kondisi tidak terpenuhi sehingga urutan tidak penting.
create or replace function private.lock_accepted_intro_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Blokir downgrade: kalau status lama "diterima", target harus tetap "diterima".
  -- Pengecualian: pelamar mengisi joined_at (konfirmasi bergabung) -- ditangani
  -- oleh trigger confirm_team_join, bukan di sini.
  if old.review = 'diterima'
     and new.review <> 'diterima'
     and new.joined_at is not distinct from old.joined_at then
    raise exception 'review_downgrade_forbidden'
      using detail = 'Status pelamar yang sudah diterima tidak dapat diubah ke ' || new.review;
  end if;
  return new;
end;
$$;

revoke all on function private.lock_accepted_intro_review() from public, anon, authenticated;

-- Hapus trigger lama kalau ada (idempoten).
drop trigger if exists lock_accepted_intro_review_before_update on public.team_intros;

create trigger lock_accepted_intro_review_before_update
  before update on public.team_intros
  for each row execute function private.lock_accepted_intro_review();

comment on function private.lock_accepted_intro_review() is
  'Blokir downgrade review dari diterima ke status apapun kecuali saat pelamar mengisi joined_at.';
