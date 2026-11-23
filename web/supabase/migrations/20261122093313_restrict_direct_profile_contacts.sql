revoke select on public.profiles from anon, authenticated;
grant select (id,username,display_name,headline,bio,program,city,skills,is_published,created_at,updated_at,layout_style,accent_color,show_skills,show_contacts) on public.profiles to anon,authenticated;
