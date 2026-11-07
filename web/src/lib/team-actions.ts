"use server";

import { revalidatePath } from "next/cache";

import { DEMO_OWNER_USERNAME } from "@/lib/content";
import type { TeamIntro, TeamPost, TeamSearchStatus } from "@/lib/fixtures/types";
import {
  hasIntroErrors,
  hasTeamErrors,
  teamPostFromForm,
  validateIntroForm,
  validateTeamForm,
  type IntroErrors,
  type IntroForm,
  type TeamErrors,
  type TeamPostForm,
} from "@/lib/team-form";
import { appendStoredTeamIntro, saveStoredTeam } from "@/lib/team-store";
import { getTeamPost, listTeamPosts } from "@/lib/teams";

export type SendIntroResult =
  | { ok: true; sentAt: string }
  | { ok: false; errors: IntroErrors };

export type CreateTeamPostResult =
  | { ok: true; id: string; savedAt: string }
  | { ok: false; errors: TeamErrors };

/**
 * Mengirim perkenalan terstruktur dari pengunjung untuk satu pencarian tim.
 *
 * Ditulis ke `web/.data/team-requests.json`. Validasi dijalankan di server
 * agar data rusak atau tautan berbahaya tidak bisa masuk.
 */
export async function sendTeamIntroAction(
  teamId: string,
  form: IntroForm,
): Promise<SendIntroResult> {
  const teamItem = getTeamPost(teamId);

  if (!teamItem) {
    return {
      ok: false,
      errors: { role: "Pencarian tim ini tidak ditemukan." },
    };
  }

  if (teamItem.team.status !== "open") {
    return {
      ok: false,
      errors: { role: "Pencarian tim ini sudah ditutup." },
    };
  }

  const roleTitles = teamItem.team.roles.map((role) => role.title);
  const errors = validateIntroForm(form, roleTitles);

  if (hasIntroErrors(errors)) {
    return { ok: false, errors };
  }

  const sentAt = new Date().toISOString();
  const intro: TeamIntro = {
    senderName: form.senderName.trim() || "Anonim",
    role: form.role.trim(),
    weeklyHours: form.weeklyHours.trim(),
    bring: form.bring.trim(),
    learn: form.learn.trim(),
    proofUrl: form.proofUrl.trim(),
  };

  appendStoredTeamIntro({
    teamId,
    intro,
    sentAt,
  });

  revalidatePath("/tim");
  revalidatePath(`/tim/${teamId}`);
  revalidatePath("/dashboard");

  return { ok: true, sentAt };
}

/**
 * Membuat atau memperbarui posting pencarian tim baru oleh akun pemilik.
 */
export async function createTeamPostAction(
  form: TeamPostForm,
  status: TeamSearchStatus = "open",
): Promise<CreateTeamPostResult> {
  const errors = validateTeamForm(form);

  if (hasTeamErrors(errors)) {
    return { ok: false, errors };
  }

  const team: TeamPost = {
    ...teamPostFromForm(form, status),
    ownerUsername: DEMO_OWNER_USERNAME,
  };

  // Pastikan ID tidak bentrok
  const existingPosts = listTeamPosts();
  let id = team.id;
  let counter = 2;
  while (existingPosts.some((item) => item.team.id === id)) {
    id = `${team.id}-${counter}`;
    counter++;
  }
  team.id = id;

  const savedAt = new Date().toISOString();
  saveStoredTeam({
    ownerUsername: DEMO_OWNER_USERNAME,
    team,
    savedAt,
  });

  revalidatePath("/tim");
  revalidatePath(`/tim/${team.id}`);
  revalidatePath("/dashboard");

  return { ok: true, id: team.id, savedAt };
}
