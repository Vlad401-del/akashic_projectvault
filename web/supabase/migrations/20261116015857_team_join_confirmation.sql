-- A seat is filled only after an accepted applicant confirms joining.
alter table public.team_posts drop constraint team_posts_check;
alter table public.team_posts add constraint team_posts_members_check
  check (target_members >= current_members);
alter table public.team_posts add constraint team_posts_open_has_slots_check
  check (status = 'closed' or current_members < target_members);

alter table public.team_intros add column joined_at timestamptz;

create schema if not exists private;
create function private.confirm_team_join() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.joined_at is distinct from old.joined_at then
    if old.joined_at is not null or new.joined_at is null
       or old.sender_id <> (select auth.uid())
       or old.review <> 'diterima'
       or (to_jsonb(new) - 'joined_at') <> (to_jsonb(old) - 'joined_at') then
      raise exception 'invalid_team_join';
    end if;

    update public.team_posts
    set current_members = current_members + 1,
        status = case when current_members + 1 >= target_members then 'closed' else status end,
        updated_at = now()
    where id = new.team_id and status = 'open' and current_members < target_members;
    if not found then
      raise exception 'team_full_or_closed';
    end if;
    new.joined_at := now();
  elsif old.joined_at is not null and new.review <> old.review then
    raise exception 'confirmed_member_review_locked';
  end if;
  return new;
end;
$$;
revoke all on function private.confirm_team_join() from public, anon, authenticated;
create trigger confirm_team_join_before_update
  before update on public.team_intros
  for each row execute function private.confirm_team_join();

create policy "Accepted applicant can confirm joining" on public.team_intros
  for update to authenticated
  using (sender_id = (select auth.uid()) and review = 'diterima' and joined_at is null)
  with check (sender_id = (select auth.uid()) and review = 'diterima' and joined_at is not null);
