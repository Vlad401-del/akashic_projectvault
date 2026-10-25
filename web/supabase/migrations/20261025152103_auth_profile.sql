-- Membuat profil privat saat akun Supabase Auth didaftarkan.
-- Username awal stabil dan unik tanpa menyalin email login ke tabel publik.
create function public.handle_new_akashic_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'user-' || substr(replace(new.id::text, '-', ''), 1, 24),
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
             nullif(split_part(new.email, '@', 1), ''), 'Pengguna Akashic')
  );
  return new;
end;
$$;

revoke all on function public.handle_new_akashic_user() from public, anon, authenticated;

create trigger on_auth_user_created_akashic
  after insert on auth.users
  for each row execute function public.handle_new_akashic_user();
