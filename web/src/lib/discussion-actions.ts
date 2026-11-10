"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { hasDiscussionErrors, validateDiscussionForm, type DiscussionErrors, type DiscussionForm } from "@/lib/discussion-form";
import { getTeamDiscussion } from "@/lib/discussions";
import type { DiscussionMessage } from "@/lib/fixtures/types";
import { appendStoredDiscussion } from "@/lib/team-store";
import { getTeamPost } from "@/lib/teams";

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
