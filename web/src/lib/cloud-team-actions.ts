import { revalidatePath } from "next/cache";

import type { IntroReviewStatus, TeamIntro, TeamPost, TeamSearchStatus } from "@/lib/fixtures/types";
import {
  hasIntroErrors,
  hasTeamErrors,
  teamPostFromForm,
  validateIntroForm,
  validateTeamForm,
  type IntroForm,
  type TeamPostForm,
} from "@/lib/team-form";
import type { CreateTeamPostResult, ReviewIntroResult, SendIntroResult } from "@/lib/team-actions";
import { getCloudTeamPost } from "@/lib/team-cloud";
import { createClient } from "@/lib/supabase/server";
import { sessionFailureMessage } from "@/lib/auth-availability";

export async function setCloudTeamStatus(
  teamId: string,
  status: TeamSearchStatus,
): Promise<{ ok: boolean; message?: string }> {
  if (status !== "open" && status !== "closed") {
    return { ok: false, message: "Status pencarian tidak dikenal." };
  }
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { ok: false, message: sessionFailureMessage(authError, "Masuk lagi untuk mengatur pencarian tim.") };
  if (status === "open") {
    const { data: team } = await supabase.from("team_posts")
      .select("current_members,target_members").eq("id", teamId).eq("owner_id", auth.user.id).maybeSingle();
    if (!team || team.current_members >= team.target_members) {
      return { ok: false, message: "Tim sudah penuh. Tambah target anggota sebelum membuka pencarian lagi." };
    }
  }
  const { data, error } = await supabase.from("team_posts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", teamId).eq("owner_id", auth.user.id)
    .select("id").maybeSingle();
  if (error || !data) return { ok: false, message: "Status belum berubah. Periksa kembali pencarian tim Anda." };
  revalidatePath("/tim");
  revalidatePath(`/tim/${teamId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createCloudTeamPost(
  form: TeamPostForm,
  status: TeamSearchStatus,
): Promise<CreateTeamPostResult> {
  const errors = validateTeamForm(form);
  if (hasTeamErrors(errors)) return { ok: false, errors };
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  const ownerId = auth.user?.id;
  if (authError || !ownerId) return { ok: false, errors: { title: sessionFailureMessage(authError, "Masuk dulu untuk membuat pencarian tim.") } };
  const { data: profile } = await supabase.from("profiles")
    .select("is_published").eq("id", ownerId).single();
  if (!profile?.is_published) {
    return { ok: false, errors: { title: "Terbitkan profilmu di Atur profil sebelum memasang pencarian tim." } };
  }
  const team: TeamPost = { ...teamPostFromForm(form, status), ownerUsername: "" };
  const baseId = team.id.length >= 3 ? team.id.slice(0, 105) : `tim-${team.id}`;
  const { data: existing, error: readError } = await supabase.from("team_posts")
    .select("id").like("id", `${baseId}%`);
  if (readError) throw new Error("Daftar tim belum dapat dibaca.");
  const taken = new Set((existing ?? []).map((row) => row.id));
  let id = baseId;
  for (let counter = 2; taken.has(id); counter += 1) id = `${baseId}-${counter}`;
  const { error: postError } = await supabase.from("team_posts").insert({
    id,
    owner_id: ownerId,
    title: team.title,
    competition: team.competition,
    summary: team.summary,
    current_members: team.currentMembers,
    target_members: team.targetMembers,
    weekly_hours: team.weeklyHours,
    deadline: team.deadline,
    meeting_note: team.meetingNote,
    status: team.status,
  });
  if (postError) return { ok: false, errors: { title: "Pencarian tim belum dapat disimpan. Coba lagi." } };
  const { error: roleError } = await supabase.from("team_roles").insert(
    team.roles.map((role, position) => ({ team_id: id, position, title: role.title, skills: role.skills })),
  );
  if (roleError) {
    await supabase.from("team_posts").delete().eq("id", id).eq("owner_id", ownerId);
    return { ok: false, errors: { roles: { 0: "Peran tim belum dapat disimpan. Periksa nama peran lalu coba lagi." } } };
  }
  revalidatePath("/tim");
  revalidatePath(`/tim/${id}`);
  revalidatePath("/dashboard");
  return { ok: true, id, savedAt: new Date().toISOString() };
}

export async function updateCloudTeamPost(
  teamId: string,
  form: TeamPostForm,
): Promise<CreateTeamPostResult> {
  const errors = validateTeamForm(form, true);
  if (hasTeamErrors(errors)) return { ok: false, errors };
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { ok: false, errors: { title: sessionFailureMessage(authError, "Masuk lagi untuk mengubah pencarian tim.") } };
  const current = await getCloudTeamPost(teamId);
  if (!current || current.ownerId !== auth.user.id) {
    return { ok: false, errors: { title: "Pencarian tim ini bukan milik akunmu." } };
  }
  const oldRoles = current.team.roles.map((role) => ({ title: role.title, skills: role.skills }));
  const newRoles = teamPostFromForm(form, current.team.status).roles;
  if (JSON.stringify(oldRoles) !== JSON.stringify(newRoles)) {
    return { ok: false, errors: { roles: { 0: "Peran yang sudah terbit tidak dapat diubah. Tutup pencarian dan buat posting baru bila kebutuhan peran berubah." } } };
  }
  const updatedAt = new Date().toISOString();
  const { data, error } = await supabase.from("team_posts")
    .update({
      title: form.title.trim(),
      competition: form.competition.trim(),
      summary: form.summary.trim(),
      current_members: Number(form.currentMembers),
      target_members: Number(form.targetMembers),
      status: Number(form.currentMembers) >= Number(form.targetMembers) ? "closed" : current.team.status,
      weekly_hours: Number(form.weeklyHours),
      deadline: form.deadline.trim(),
      meeting_note: form.meetingNote.trim(),
      updated_at: updatedAt,
    })
    .eq("id", teamId).eq("owner_id", auth.user.id)
    .select("id").maybeSingle();
  if (error || !data) return { ok: false, errors: { title: "Perubahan belum tersimpan. Periksa isian lalu coba lagi." } };
  revalidatePath("/tim");
  revalidatePath(`/tim/${teamId}`);
  revalidatePath("/dashboard");
  return { ok: true, id: teamId, savedAt: updatedAt };
}

export async function sendCloudTeamIntro(teamId: string, form: IntroForm): Promise<SendIntroResult> {
  const item = await getCloudTeamPost(teamId);
  if (!item || item.team.status !== "open") {
    return { ok: false, errors: { role: "Pencarian tim tidak tersedia atau sudah ditutup." } };
  }
  const errors = validateIntroForm(form, item.team.roles.map((role) => role.title));
  if (hasIntroErrors(errors)) return { ok: false, errors };
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  const senderId = auth.user?.id;
  if (authError || !senderId) return { ok: false, errors: { role: sessionFailureMessage(authError, "Masuk dulu untuk mengirim perkenalan.") } };
  const { data: existingIntro, error: existingError } = await supabase.from("team_intros")
    .select("id").eq("team_id", teamId).eq("sender_id", senderId).maybeSingle();
  if (existingError) return { ok: false, errors: { role: "Status pengajuan sebelumnya belum dapat diperiksa. Coba lagi." } };
  if (existingIntro) return { ok: false, errors: { role: "Kamu sudah mengajukan diri ke tim ini. Lihat statusnya di dasbor." } };
  const { data: sender } = await supabase.from("profiles")
    .select("display_name").eq("id", senderId).single();
  if (!sender) return { ok: false, errors: { role: "Profil akun belum tersedia." } };
  const intro: TeamIntro = {
    senderName: form.senderName.trim().slice(0, 80) || sender.display_name.trim() || "Pengguna Akashic",
    role: form.role.trim(),
    weeklyHours: form.weeklyHours.trim(),
    bring: form.bring.trim(),
    learn: form.learn.trim(),
    proofUrl: form.proofUrl.trim(),
    contact: form.contact.trim(),
  };
  const { error } = await supabase.from("team_intros").insert({
    team_id: teamId,
    sender_id: senderId,
    sender_name: intro.senderName,
    role: intro.role,
    weekly_hours: intro.weeklyHours,
    bring: intro.bring,
    learn: intro.learn,
    proof_url: intro.proofUrl,
    contact: intro.contact ?? "",
  });
  if (error) return { ok: false, errors: { role: error.code === "23505"
    ? "Kamu sudah mengajukan diri ke tim ini. Lihat statusnya di dasbor."
    : "Perkenalan belum terkirim. Periksa isian dan coba lagi." } };
  revalidatePath(`/tim/${teamId}`);
  revalidatePath("/dashboard");
  return { ok: true, sentAt: new Date().toISOString() };
}

export async function reviewCloudTeamIntro(
  teamId: string,
  sentAt: string,
  review: IntroReviewStatus,
): Promise<ReviewIntroResult> {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { ok: false, message: sessionFailureMessage(authError, "Masuk lagi untuk meninjau perkenalan.") };

  // Guard: pelamar yang sudah diterima tidak bisa di-downgrade via API langsung.
  const { data: current } = await supabase.from("team_intros")
    .select("review").eq("team_id", teamId).eq("created_at", sentAt).maybeSingle();
  if (current?.review === "diterima" && review !== "diterima") {
    return { ok: false, message: "Status pelamar yang sudah diterima tidak dapat diubah." };
  }

  if (review === "diterima") {
    const { data: team } = await supabase.from("team_posts")
      .select("current_members,target_members,status").eq("id", teamId).eq("owner_id", auth.user.id).maybeSingle();
    if (!team || team.status !== "open") return { ok: false, message: "Pencarian tim sudah ditutup." };
    const { count, error: countError } = await supabase.from("team_intros")
      .select("id", { count: "exact", head: true }).eq("team_id", teamId)
      .eq("review", "diterima").is("joined_at", null);
    if (countError || count === null) return { ok: false, message: "Sisa undangan belum dapat diperiksa." };
    if (team.current_members + count >= team.target_members) {
      return { ok: false, message: "Semua slot sudah diisi atau menunggu konfirmasi pelamar yang diterima. Tunggu konfirmasi atau tambah target anggota tim sebelum menerima pelamar baru." };
    }
  }
  const { data, error } = await supabase.from("team_intros")
    .update({ review }).eq("team_id", teamId).eq("created_at", sentAt)
    .is("joined_at", null).select("id").maybeSingle();
  if (error || !data) return { ok: false, message: "Perkenalan tidak ditemukan atau bukan milik tim Anda." };
  revalidatePath("/dashboard");
  return { ok: true, review };
}

export async function confirmCloudTeamJoin(teamId: string): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return { ok: false, message: sessionFailureMessage(authError, "Masuk lagi untuk mengonfirmasi bergabung.") };

  const { data, error } = await supabase.from("team_intros")
    .update({ joined_at: new Date().toISOString() })
    .eq("team_id", teamId).eq("sender_id", auth.user.id).eq("review", "diterima")
    .is("joined_at", null).select("joined_at").maybeSingle();
  if (error || !data) {
    return { ok: false, message: "Belum bisa bergabung. Pastikan undangan diterima dan pencarian masih memiliki slot." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/tim");
  revalidatePath(`/tim/${teamId}`);
  return { ok: true };
}
