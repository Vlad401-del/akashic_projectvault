-- Run inside BEGIN/ROLLBACK, after the candidate migration when testing a release.
-- Uses existing profile references; inserts only temporary team rows in this transaction.
do $$
declare
  owner_uuid uuid;
  sender_a uuid;
  sender_b uuid;
  changed integer;
begin
  select id into owner_uuid from public.profiles order by id limit 1;
  select id into sender_a from public.profiles where id <> owner_uuid order by id limit 1;
  select id into sender_b from public.profiles where id not in (owner_uuid,sender_a) order by id limit 1;
  if sender_b is null then raise exception 'three_profiles_required_for_test'; end if;

  insert into public.team_posts (id,owner_id,title,summary,current_members,target_members,weekly_hours)
  values ('regression-accept-final-seat',owner_uuid,'Regression final seat','Temporary transaction-only regression team.',1,2,5),
         ('regression-accept-multiple',owner_uuid,'Regression multiple seats','Temporary transaction-only regression team.',1,3,5);
  insert into public.team_roles (team_id,position,title,skills)
  values ('regression-accept-final-seat',0,'Tester',array['Testing']),
         ('regression-accept-multiple',0,'Tester',array['Testing']);
  insert into public.team_intros (team_id,sender_id,sender_name,role,weekly_hours,bring,contact)
  select team_id,sender,'Regression applicant','Tester','5','Temporary regression introduction.','test@example.com'
  from unnest(array['regression-accept-final-seat','regression-accept-multiple']) team_id
  cross join unnest(array[sender_a,sender_b]) sender;

  perform set_config('request.jwt.claim.sub',owner_uuid::text,true);
  set local role authenticated;
  update public.team_intros set review='diterima'
    where team_id='regression-accept-final-seat' and sender_id=sender_a;
  if not exists (select 1 from public.team_posts where id='regression-accept-final-seat'
      and current_members=2 and target_members=2 and status='closed') then
    raise exception 'last_seat_not_closed';
  end if;
  if not exists (select 1 from public.team_intros where team_id='regression-accept-final-seat'
      and sender_id=sender_a and joined_at is not null) then
    raise exception 'membership_not_recorded';
  end if;
  update public.team_intros set review='diterima'
    where team_id='regression-accept-final-seat' and sender_id=sender_a;
  if (select current_members from public.team_posts where id='regression-accept-final-seat') <> 2 then
    raise exception 'duplicate_acceptance_counted_twice';
  end if;
  begin
    update public.team_intros set review='diterima'
      where team_id='regression-accept-final-seat' and sender_id=sender_b;
    raise exception 'extra_acceptance_was_allowed';
  exception when raise_exception then
    if sqlerrm <> 'team_full_or_closed' then raise; end if;
  end;
  if not exists (select 1 from public.team_intros where team_id='regression-accept-final-seat'
      and sender_id=sender_b and review='baru' and joined_at is null) then
    raise exception 'failed_acceptance_not_rolled_back';
  end if;
  begin
    update public.team_intros set review='ditolak'
      where team_id='regression-accept-final-seat' and sender_id=sender_a;
    raise exception 'accepted_applicant_downgraded';
  exception when raise_exception then
    if sqlerrm <> 'review_downgrade_forbidden' then raise; end if;
  end;

  update public.team_intros set review='diterima'
    where team_id='regression-accept-multiple' and sender_id=sender_a;
  if not exists (select 1 from public.team_posts where id='regression-accept-multiple'
      and current_members=2 and status='open') then raise exception 'closed_too_early'; end if;
  update public.team_intros set review='diterima'
    where team_id='regression-accept-multiple' and sender_id=sender_b;
  if not exists (select 1 from public.team_posts where id='regression-accept-multiple'
      and current_members=3 and status='closed') then raise exception 'multi_seat_count_incorrect'; end if;

  -- A different user cannot review applications or manipulate membership timestamps.
  perform set_config('request.jwt.claim.sub',sender_b::text,true);
  update public.team_intros set review='ditolak'
    where team_id='regression-accept-final-seat' and sender_id=sender_b;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'non_owner_can_review'; end if;
  begin
    update public.team_intros set joined_at=now()
      where team_id='regression-accept-final-seat' and sender_id=sender_b;
    raise exception 'applicant_can_change_membership';
  exception when insufficient_privilege then null;
  end;
  reset role;
end;
$$;
select 'PASS: last-seat closure, joined timestamp, idempotency, overflow rejection, rollback, review lock, multi-seat counts, non-owner denial, membership permission' as acceptance_regression;
