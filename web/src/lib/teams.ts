/**
 * Pemilih data untuk papan pencarian anggota tim.
 *
 * Meniru pola `content.ts`: fixture adalah lapisan dasar, pencarian yang
 * dibuat lewat dashboard tersimpan di berkas lokal (`team-store.ts`) dan
 * digabungkan di sini. Pencarian baru ditambahkan di depan supaya mudah
 * ditemukan; `id` yang sama menimpa pencarian fixture.
 *
 * Aturan yang berlaku di tahap ini:
 * - Papan publik hanya menampilkan pencarian berstatus "open".
 * - Halaman detail tetap bisa dibuka untuk pencarian "closed" supaya
 *   keadaan "sudah penuh" punya halaman sendiri, tetapi formulir
 *   perkenalannya dinonaktifkan di sana.
 * - Perkenalan hanya terbaca pemiliknya lewat dashboard (belum ada
 *   autentikasi, jadi "pemilik" berarti akun contoh).
 */
import { profiles } from "@/lib/fixtures/fixtures";
import { teamPosts as fixtureTeams } from "@/lib/fixtures/teams";
import type { IntroReviewStatus, TeamIntro, TeamPost } from "@/lib/fixtures/types";
import { readStoredTeamIntros, readStoredTeams } from "@/lib/team-store";

import { DEMO_OWNER_USERNAME } from "@/lib/content";

/** Menggabungkan pencarian fixture dengan pencarian tersimpan di berkas lokal. */
function mergeTeams(fixture: TeamPost[]): TeamPost[] {
  const stored = readStoredTeams().map((item) => item.team);
  const fixtureIds = new Set(fixture.map((team) => team.id));

  const fixtureWithOverrides = fixture.map(
    (team) => stored.find((item) => item.id === team.id) ?? team,
  );

  const added = stored.filter((team) => !fixtureIds.has(team.id)).reverse();

  return [...added, ...fixtureWithOverrides];
}

function resolveOwner(username: string) {
  return profiles.find((profile) => profile.username === username) ?? null;
}

/** Satu pencarian beserta profil pemiliknya. */
export type TeamPostWithOwner = {
  team: TeamPost;
  owner: {
    username: string;
    displayName: string;
    headline: string;
  };
};

function withOwner(team: TeamPost): TeamPostWithOwner | null {
  const owner = resolveOwner(team.ownerUsername);

  if (!owner) {
    return null;
  }

  return {
    team,
    owner: {
      username: owner.username,
      displayName: owner.displayName,
      headline: owner.headline,
    },
  };
}

/**
 * Seluruh pencarian yang dikenal (terbuka maupun sudah penuh).
 * Dipakai papan, halaman detail, dan dashboard.
 */
export function listTeamPosts(): TeamPostWithOwner[] {
  return mergeTeams(fixtureTeams)
    .map((team) => withOwner(team))
    .filter((item): item is TeamPostWithOwner => item !== null);
}

/** Pencarian berstatus terbuka; inilah yang tampil di papan. */
export function listOpenTeamPosts(): TeamPostWithOwner[] {
  return listTeamPosts().filter((item) => item.team.status === "open");
}

/** Satu pencarian berdasarkan `id`; penggunaan utamanya `/tim/[id]`. */
export function getTeamPost(id: string): TeamPostWithOwner | null {
  return listTeamPosts().find((item) => item.team.id === id) ?? null;
}

/** Daftar `id` pencarian yang dikenal saat build, supaya `/tim/[id]` 404 tegas. */
export function listKnownTeamIds(): string[] {
  const stored = readStoredTeams().map((item) => item.team.id);
  const fixtureIds = fixtureTeams.map((team) => team.id);

  return Array.from(new Set([...stored, ...fixtureIds]));
}

/**
 * Pencarian milik pemilik akun contoh (dashboard).
 *
 * Sama seperti proyek, area pemilik sengaja membaca segala status supaya
 * pencarian yang sudah penuh tetap terlihat di sini. Fungsi ini JANGAN dipakai
 * pada rute publik.
 */
export function listOwnedTeamPosts(): TeamPostWithOwner[] {
  return listTeamPosts().filter((item) => item.team.ownerUsername === DEMO_OWNER_USERNAME);
}

/** Sub-pencarian yang ditujukan salah satu pencarian milik akun contoh. */
export type IncomingIntro = {
  teamId: string;
  teamTitle: string;
  intro: TeamIntro;
  sentAt: string;
  /** Keputusan pemilik tim; perkenalan lama tanpa kolom ini dianggap "baru". */
  review: IntroReviewStatus;
};

/**
 * Semua perkenalan terkirim untuk pencarian milik pemilik akun contoh.
 *
 * Ini menggantikan "inbox" yang akan menyala setelah Supabase tersedia;
 * sampai saat itu perkenalan hanya terbaca di dashboard komputer ini.
 */
export function listIncomingIntros(): IncomingIntro[] {
  const owned = new Set(listOwnedTeamPosts().map((item) => item.team.id));
  const titles = new Map(listTeamPosts().map((item) => [item.team.id, item.team.title]));

  return readStoredTeamIntros()
    .filter((item) => owned.has(item.teamId))
    .map((item) => ({
      teamId: item.teamId,
      teamTitle: titles.get(item.teamId) ?? item.teamId,
      intro: item.intro,
      sentAt: item.sentAt,
      review: item.review ?? "baru",
    }));
}
