create or replace function public.read_visible_profiles()
returns setof public.profiles language plpgsql stable security definer set search_path='' as $$
declare r public.profiles; viewer uuid := auth.uid();
begin
for r in select * from public.profiles p where p.is_published or p.id=viewer loop
if r.id is distinct from viewer then
if not r.show_contacts then r.contacts := '[]'::jsonb; end if;
if not r.show_skills then r.skills := '{}'::text[]; end if;
end if;
return next r;
end loop;
end $$;
revoke all on function public.read_visible_profiles() from public;
grant execute on function public.read_visible_profiles() to anon,authenticated;
