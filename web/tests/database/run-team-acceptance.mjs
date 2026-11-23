import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Isolated PostgreSQL/WASM runtime; never reads .env or connects to Supabase.
const runtime = resolve("../.vercel/db-regression/node_modules/@electric-sql/pglite/dist/index.js");
const { PGlite } = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const sql = (name) => readFile(resolve(name), "utf8");
try {
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated;
    create table public.profiles(id uuid primary key,is_published boolean default true);
    grant select on public.profiles to anon,authenticated;
    insert into public.profiles values
      ('11111111-1111-4111-8111-111111111111',true),
      ('22222222-2222-4222-8222-222222222222',true),
      ('33333333-3333-4333-8333-333333333333',true);
  `);
  for (const migration of ["20261115125554_team_finder_core", "20261116015857_team_join_confirmation", "20261116020728_team_join_column_permission", "20261116130951_lock_accepted_intro_review"]) {
    await db.exec(await sql(`supabase/migrations/${migration}.sql`));
  }
  await db.exec(`
    insert into public.team_posts(id,owner_id,title,summary,current_members,target_members,weekly_hours,status)
    values ('dipaksa-mas-reza-lomba','11111111-1111-4111-8111-111111111111','Regression legacy team','Temporary regression data for manual-count reconciliation.',3,3,5,'closed');
    insert into public.team_roles(team_id,position,title,skills) values ('dipaksa-mas-reza-lomba',0,'Tester',array['Testing']);
    insert into public.team_intros(team_id,sender_id,sender_name,role,weekly_hours,bring,contact,review)
    select 'dipaksa-mas-reza-lomba',id,'Legacy applicant','Tester','5','Temporary regression introduction.','test@example.com','diterima'
    from public.profiles where id <> '11111111-1111-4111-8111-111111111111';
  `);
  await db.exec("begin");
  await db.exec(await sql("supabase/migrations/20261123033749_accept_team_intro_atomically.sql"));
  const legacy = await db.query("select current_members,status,(select count(*) from public.team_intros where joined_at is not null) as joined from public.team_posts where id='dipaksa-mas-reza-lomba'");
  if (legacy.rows[0].current_members !== 3 || Number(legacy.rows[0].joined) !== 2 || legacy.rows[0].status !== "closed") throw new Error("Legacy reconciliation double-counted members");
  console.log("PASS: manual legacy 3/3 remains 3/3; both accepted applicants recorded once");
  const results = await db.exec(await sql("tests/database/team-acceptance.sql"));
  for (const result of results) for (const row of result.rows) console.log(row.acceptance_regression);
  await db.exec("rollback");
  console.log("PASS: all database tests isolated in local PostgreSQL; no Production writes");
} finally {
  await db.close();
}
