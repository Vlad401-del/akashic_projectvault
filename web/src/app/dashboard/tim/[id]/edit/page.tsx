import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { TeamPostFormComponent } from "@/components/team/team-post-form-component";
import { getCurrentUser } from "@/lib/auth-session";
import type { TeamPostForm } from "@/lib/team-form";
import { getCloudTeamPost } from "@/lib/team-cloud";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Edit pencarian tim — Akashic" };
export const dynamic = "force-dynamic";

export default async function EditTeamPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) notFound();
  const { id } = await params;
  const user = await getCurrentUser();
  const owner = await getCloudOwner();
  if (!user || !owner) redirect("/login");
  const item = await getCloudTeamPost(id);
  if (!item || item.ownerId !== user.id) notFound();

  const team = item.team;
  const initialForm: TeamPostForm = {
    title: team.title,
    competition: team.competition,
    summary: team.summary,
    currentMembers: String(team.currentMembers),
    targetMembers: String(team.targetMembers),
    weeklyHours: String(team.weeklyHours),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(team.deadline) ? team.deadline : "",
    meetingNote: team.meetingNote,
    roles: team.roles.map((role) => ({ title: role.title, skills: role.skills.join(", ") })),
  };

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Area pemilik" />
      <main className="mx-auto max-w-[840px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <header className="mb-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Papan Cari Tim</p>
          <h1 className="mt-1.5 text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">Edit pencarian tim</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Perbarui informasi yang dibaca calon anggota. Status terbuka atau tertutup dapat diatur di dasbor.</p>
        </header>
        <TeamPostFormComponent initialForm={initialForm} editingTeamId={id} />
      </main>
    </>
  );
}
