-- Acceptance is membership: review, joined_at, member count and closure commit together.
-- Reconcile only the old team whose owner confirmed the count was corrected manually.
lock table public.team_posts, public.team_intros in share row exclusive mode;

do $$
begin
  if exists (select 1 from public.team_intros where team_id = 'dipaksa-mas-reza-lomba'
      and review = 'diterima' and joined_at is null) then
    if not exists (select 1 from public.team_posts where id = 'dipaksa-mas-reza-lomba'
        and current_members = 3 and target_members = 3 and status = 'closed')
       or (select count(*) from public.team_intros where team_id = 'dipaksa-mas-reza-lomba'
           and review = 'diterima' and joined_at is null) <> 2 then
      raise exception 'legacy_team_changed_reconciliation_required';
    end if;
  end if;
end;
$$;

drop trigger confirm_team_join_before_update on public.team_intros;
drop function private.confirm_team_join();

-- The owner's 3/3 already includes these two accepted applicants: never increment twice.
update public.team_intros set joined_at = now()
where team_id = 'dipaksa-mas-reza-lomba' and review = 'diterima' and joined_at is null;

do $$
begin
  if exists (select 1 from public.team_intros where review = 'diterima' and joined_at is null) then
    raise exception 'unreconciled_accepted_applicants';
  end if;
end;
$$;

create function private.accept_team_intro() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.team_posts p
      where p.id = old.team_id and p.owner_id = (select auth.uid())) then
    raise exception 'team_owner_required';
  end if;
  if new.joined_at is distinct from old.joined_at then
    raise exception 'membership_managed_by_acceptance';
  end if;
  if old.review = 'diterima' and new.review <> 'diterima' then
    raise exception 'review_downgrade_forbidden';
  end if;
  if new.review = 'diterima' and old.review <> 'diterima' then
    -- UPDATE takes the team row lock. Competing acceptances recheck this predicate
    -- after the lock is acquired, so only one can fill the last remaining seat.
    update public.team_posts
    set current_members = current_members + 1,
        status = case when current_members + 1 >= target_members then 'closed' else status end,
        updated_at = now()
    where id = old.team_id and owner_id = (select auth.uid())
      and status = 'open' and current_members < target_members;
    if not found then
      raise exception 'team_full_or_closed';
    end if;
    new.joined_at := now();
  end if;
  return new;
end;
$$;
revoke all on function private.accept_team_intro() from public, anon, authenticated;
create trigger accept_team_intro_before_update
before update on public.team_intros
for each row execute function private.accept_team_intro();

-- Direct old-client confirmation must never add another member.
drop policy "Accepted applicant can confirm joining" on public.team_intros;
revoke update (joined_at) on public.team_intros from authenticated;
comment on function private.accept_team_intro() is
  'Owner acceptance atomically fills one seat, records membership and closes full recruitment. Repeated acceptance is a no-op.';
