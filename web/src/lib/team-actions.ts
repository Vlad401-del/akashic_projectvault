"use server";

import { revalidatePath } from "next/cache";

import { DEMO_OWNER_USERNAME } from "@/lib/content";
import type { IntroReviewStatus, TeamIntro, TeamPost, TeamSearchStatus } from "@/lib/fixtures/types";
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
import {
  appendStoredTeamIntro,
  isIntroReviewStatus,
  saveStoredTeam,
  setStoredTeamIntroReview,
} from "@/lib/team-store";
import { getTeamPost, listTeamPosts } from "@/lib/teams";

export type SendIntroResult =
  | { ok: true; sentAt: string }
  | { ok: false; errors: IntroErrors };

export type CreateTeamPostResult =
  | { ok: true; id: string; savedAt: string }
  | { ok: false; errors: TeamErrors };

export type ReviewIntroResult =
  | { ok: true; review: IntroReviewStatus }
  | { ok: false; message: string };

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
    contact: form.contact.trim(),
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

/**
 * Menandai satu perkenalan masuk sebagai sedang diskusi, diterima, atau ditolak.
 *
 * Hanya perkenalan yang ditujukan ke tim milik akun pemilik contoh yang boleh
 * diubah; sampai autentikasi tersedia, itulah batas "pemilik" yang berlaku.
 * Status divalidasi ulang di server supaya permintaan langsung tidak bisa
 * menulis nilai sembarang.
 */
export async function reviewTeamIntroAction(
  teamId: string,
  sentAt: string,
  review: IntroReviewStatus,
): Promise<ReviewIntroResult> {
  if (!isIntroReviewStatus(review)) {
    return { ok: false, message: "Status review tidak dikenal." };
  }

  const teamItem = getTeamPost(teamId);

  if (!teamItem || teamItem.team.ownerUsername !== DEMO_OWNER_USERNAME) {
    return { ok: false, message: "Perkenalan ini bukan untuk tim Anda." };
  }

  const updated = setStoredTeamIntroReview(teamId, sentAt, review);

  if (!updated) {
    return { ok: false, message: "Perkenalan tidak ditemukan; mungkin sudah dihapus." };
  }

  revalidatePath("/dashboard");

  return { ok: true, review };
}
