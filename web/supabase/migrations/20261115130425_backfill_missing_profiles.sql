-- Keep existing Supabase Auth accounts usable without publishing their profiles.
insert into public.profiles (id, username, display_name)
select u.id,
       'user-' || substr(replace(u.id::text, '-', ''), 1, 24),
       coalesce(nullif(btrim(u.raw_user_meta_data ->> 'display_name'), ''), 'Pengguna Akashic')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
