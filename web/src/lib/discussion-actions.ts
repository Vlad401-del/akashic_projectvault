"use server";

import "server-only";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { hasDiscussionErrors, validateDiscussionForm, type DiscussionErrors, type DiscussionForm } from "@/lib/discussion-form";
import { getTeamDiscussion } from "@/lib/discussions";
import type { DiscussionMessage } from "@/lib/fixtures/types";
import { appendStoredDiscussion } from "@/lib/team-store";
import { getTeamPost } from "@/lib/teams";
import { getCloudTeamDiscussion, getCloudTeamPost } from "@/lib/team-cloud";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type PostDiscussionResult =
  | { ok: true; message: DiscussionMessage }
  | { ok: false; errors: DiscussionErrors; message?: string };

export async function postTeamDiscussionAction(
  teamId: string,
  form: DiscussionForm,
): Promise<PostDiscussionResult> {
  if (typeof teamId !== "string" || !form || typeof form.authorName !== "string" || typeof form.body !== "string" || (form.replyToId !== null && typeof form.replyToId !== "string")) {
    return { ok: false, errors: {}, message: "Format pesan tidak valid." };
  }
  if (isSupabaseConfigured()) {
    const item = await getCloudTeamPost(teamId);
    if (!item || item.team.status !== "open") {
      return { ok: false, errors: { body: "Diskusi tim ini tidak tersedia." } };
    }
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { ok: false, errors: {}, message: "Masuk dulu untuk menulis pesan." };
    const { data: profile } = await supabase.from("profiles")
      .select("display_name").eq("id", auth.user.id).single();
    const authorName = profile?.display_name?.trim() || "Pengguna Akashic";
    const errors = validateDiscussionForm({ ...form, authorName }, { requireName: true });
    if (form.replyToId && !(await getCloudTeamDiscussion(teamId)).some((message) => message.id === form.replyToId)) {
      errors.replyToId = "Pesan yang dibalas tidak ada di tim ini.";
    }
    if (hasDiscussionErrors(errors)) return { ok: false, errors };
    const { data, error } = await supabase.from("team_discussions").insert({
      team_id: teamId,
      author_id: auth.user.id,
      author_name: authorName,
      body: form.body.trim(),
      reply_to_id: form.replyToId,
    }).select("*").single();
    if (error || !data) return { ok: false, errors: {}, message: "Pesan belum dapat disimpan. Coba lagi." };
    revalidatePath("/tim");
    revalidatePath(`/tim/${teamId}`);
    revalidatePath("/dashboard");
    return { ok: true, message: {
      id: data.id, teamId: data.team_id, authorName: data.author_name,
      body: data.body, replyToId: data.reply_to_id, createdAt: data.created_at,
    } };
  }

  const item = getTeamPost(teamId);
  if (!item) {
    return { ok: false, errors: { body: "Pencarian tim ini tidak ditemukan." } };
  }
  if (item.team.status !== "open") {
    return { ok: false, errors: { body: "Pencarian tim ini sudah ditutup; diskusi hanya bisa dibaca." } };
  }

  const errors = validateDiscussionForm(form, { requireName: true });
  if (form.replyToId !== null && !getTeamDiscussion(teamId).some((message) => message.id === form.replyToId)) {
    errors.replyToId = "Pesan yang ingin dibalas sudah tidak ada di utas ini.";
  }
  if (hasDiscussionErrors(errors)) return { ok: false, errors };

  const message: DiscussionMessage = {
    id: randomUUID(),
    teamId,
    authorName: form.authorName.trim(),
    body: form.body.trim(),
    replyToId: form.replyToId,
    createdAt: new Date().toISOString(),
  };
  appendStoredDiscussion(message);
  revalidatePath("/tim");
  revalidatePath(`/tim/${teamId}`);
  revalidatePath("/dashboard");
  return { ok: true, message };
}
