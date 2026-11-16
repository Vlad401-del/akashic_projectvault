-- Applicants may update only their confirmation timestamp; RLS and the
-- confirmation trigger still require an accepted application and an open slot.
grant update (joined_at) on public.team_intros to authenticated;
