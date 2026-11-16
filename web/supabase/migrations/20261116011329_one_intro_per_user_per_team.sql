alter table public.team_intros
  add constraint team_intros_one_per_sender_team unique (team_id, sender_id);
