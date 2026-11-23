-- Applied 22 November 2026 as migration 20261122093313 after Production release.
-- Production deployment: dpl_D8msR9s99jJmqysKtKKEstYwmsTc.
-- Old deployments using SELECT * on profiles will no longer work afterward.
begin;
revoke select on public.profiles from anon, authenticated;
grant select (id,username,display_name,headline,bio,program,city,skills,is_published,created_at,updated_at,layout_style,accent_color,show_skills,show_contacts) on public.profiles to anon,authenticated;
commit;
