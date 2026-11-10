/**
 * Penyimpanan lokal sementara untuk papan pencarian anggota tim.
 *
 * Ini berlaku sama dengan `local-store.ts` untuk proyek: Supabase dan Docker
 * belum tersedia, tetapi pencarian tim dan perkenalan yang dikirim lewat
 * formulir harus benar-benar tersimpan supaya alurnya nyata. Datanya ditulis ke
 * berkas JSON di `web/.data/`:
 *
 * - `teams.json`          : pencarian anggota yang dibuat dari dashboard.
 * - `team-requests.json`  : perkenalan yang dikirim dari halaman detail tim.
 * - `team-discussions.json`: pesan diskusi publik pada halaman detail tim.
 *
 * Sifatnya juga sama:
 * - Hanya ada di komputer ini, tidak masuk Git, dan bukan pengganti database.
 *   Tidak ada autentikasi, sehingga nama pengirim perkenalan hanya pernyataan
 *   pengirim sendiri (dinyatakan juga di UI).
 * - Isi perkenalan bersifat tambah (append-only), karena perkenalan bukan
 *   dokumen milik si pengirim yang bisa diedit ulang. Satu-satunya kolom yang
 *   bisa berubah adalah `review`, yaitu keputusan pemilik tim atas perkenalan.
 * - Saat Supabase dipakai, berkas ini dihapus dan fungsi di sini diganti
 *   kueri database dengan kebijakan RLS; komponen tampilan tidak berubah.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { DiscussionMessage, IntroReviewStatus, TeamIntro, TeamPost } from "@/lib/fixtures/types";

/** Satu pencarian anggota tersimpan beserta pemiliknya. */
export type StoredTeam = {
  ownerUsername: string;
  team: TeamPost;
  /** Waktu simpan terakhir dalam format ISO. */
  savedAt: string;
};

/** Satu perkenalan terkirim untuk satu pencarian anggota. */
export type StoredTeamIntro = {
  /** Pengenal (`id`) dari posting tim yang dituju. */
  teamId: string;
  intro: TeamIntro;
  /** Waktu kirim dalam format ISO. */
  sentAt: string;
  /**
   * Keputusan pemilik tim atas perkenalan ini. Perkenalan lama yang belum
   * memiliki kolom ini dianggap "baru".
   */
  review?: IntroReviewStatus;
};

const REVIEW_STATUSES: IntroReviewStatus[] = ["baru", "diskusi", "diterima", "ditolak"];

/** Memastikan nilai status review sah sebelum ditulis atau diterima dari klien. */
export function isIntroReviewStatus(value: unknown): value is IntroReviewStatus {
  return typeof value === "string" && (REVIEW_STATUSES as string[]).includes(value);
}

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const TEAMS_FILE = path.join(DATA_DIRECTORY, "teams.json");
const INTROS_FILE = path.join(DATA_DIRECTORY, "team-requests.json");
const DISCUSSIONS_FILE = path.join(DATA_DIRECTORY, "team-discussions.json");

/** Lokasi berkas pencarian tim; dipakai pada pesan kesalahan dan keterangan UI. */
export function teamsStoreFilePath(): string {
  return TEAMS_FILE;
}

/** Lokasi berkas perkenalan; dipakai pada pesan kesalahan dan keterangan UI. */
export function introsStoreFilePath(): string {
  return INTROS_FILE;
}

function isStoredTeam(value: unknown): value is StoredTeam {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<StoredTeam>;

  return (
    typeof item.ownerUsername === "string" &&
    typeof item.savedAt === "string" &&
    typeof item.team === "object" &&
    item.team !== null &&
    typeof item.team.id === "string" &&
    typeof item.team.title === "string"
  );
}

/** Membaca seluruh pencarian tim tersimpan; berkas yang belum ada dianggap kosong. */
export function readStoredTeams(): StoredTeam[] {
  return readArrayFile(TEAMS_FILE, "pencarian anggota tim", isStoredTeam);
}

/** Menyimpan atau memperbarui satu pencarian tim (kunci: `id`). */
export function saveStoredTeam(entry: StoredTeam): void {
  const current = readStoredTeams();
  const index = current.findIndex((item) => item.team.id === entry.team.id);

  const next =
    index >= 0 ? current.map((item, position) => (position === index ? entry : item)) : [...current, entry];

  writeStoredTeams(next);
}

function writeStoredTeams(entries: StoredTeam[]): void {
  writeArrayFile(TEAMS_FILE, entries);
}

/**
 * Membaca seluruh perkenalan terkirim.
 *
 * Baris yang tidak sah dilewatkan, bukan membatalkan seluruh daftar: satu
 * perkenalan yang rusak tidak boleh menyembunyikan perkenalan yang sah.
 */
export function readStoredTeamIntros(): StoredTeamIntro[] {
  return readArrayFile(INTROS_FILE, "perkenalan untuk tim", isStoredTeamIntro);
}

/** Menambah satu perkenalan; tidak menimpa isi lain. */
export function appendStoredTeamIntro(entry: StoredTeamIntro): void {
  const next = [...readStoredTeamIntros(), entry];

  writeArrayFile(INTROS_FILE, next);
}

/**
 * Mengubah status review satu perkenalan (kunci: `teamId` + `sentAt`).
 *
 * Hanya kolom `review` yang berubah; isi perkenalan tetap utuh karena
 * perkenalan adalah pernyataan pengirim, bukan dokumen pemilik tim.
 * Mengembalikan `false` bila perkenalannya tidak ditemukan.
 */
export function setStoredTeamIntroReview(
  teamId: string,
  sentAt: string,
  review: IntroReviewStatus,
): boolean {
  const current = readStoredTeamIntros();
  const index = current.findIndex((item) => item.teamId === teamId && item.sentAt === sentAt);

  if (index < 0) {
    return false;
  }

  const next = current.map((item, position) =>
    position === index ? { ...item, review } : item,
  );

  writeArrayFile(INTROS_FILE, next);
  return true;
}

/**
 * Membaca seluruh pesan diskusi tersimpan.
 *
 * Baris tidak sah dilewatkan seperti pada perkenalan: satu pesan rusak tidak
 * boleh menyembunyikan utas yang sah.
 */
export function readStoredDiscussions(): DiscussionMessage[] {
  return readArrayFile(DISCUSSIONS_FILE, "diskusi tim", isStoredDiscussionMessage);
}

/** Menambah satu pesan diskusi; utas bersifat append-only seperti perkenalan. */
export function appendStoredDiscussion(message: DiscussionMessage): void {
  writeArrayFile(DISCUSSIONS_FILE, [...readStoredDiscussions(), message]);
}

function isStoredDiscussionMessage(value: unknown): value is DiscussionMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<DiscussionMessage>;

  return (
    typeof item.id === "string" &&
    typeof item.teamId === "string" &&
    typeof item.authorName === "string" &&
    typeof item.body === "string" &&
    (item.replyToId === null || typeof item.replyToId === "string") &&
    typeof item.createdAt === "string"
  );
}

function isStoredTeamIntro(value: unknown): value is StoredTeamIntro {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<StoredTeamIntro>;

  return (
    typeof item.teamId === "string" &&
    typeof item.sentAt === "string" &&
    typeof item.intro === "object" &&
    item.intro !== null &&
    typeof item.intro.role === "string" &&
    typeof item.intro.bring === "string" &&
    (item.review === undefined || isIntroReviewStatus(item.review))
  );
}

//
// Penolong baca/tulis yang dipakai kedua jenis berkas di atas.
//
// Baca: berkas belum ada dianggap kosong; berkas yang rusak menghasilkan
// kesalahan yang jelas, bukan data kosong diam-diam, supaya data yang sudah
// dibuat tidak seolah hilang. Tulis: lewat berkas sementara agar proses yang
// terputus tidak meninggalkan berkas setengah jadi.
//

function readArrayFile<T>(
  file: string,
  label: string,
  isValid: (value: unknown) => value is T,
): T[] {
  if (!existsSync(file)) {
    return [];
  }

  const raw = readFileSync(file, "utf8").trim();

  if (raw.length === 0) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `Berkas penyimpanan lokal untuk ${label} tidak dapat dibaca karena JSON-nya tidak valid: ${file}. Perbaiki atau hapus berkas itu, lalu simpan ulang dari aplikasi.`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `Berkas penyimpanan lokal untuk ${label} harus berisi daftar: ${file}. Hapus berkas itu untuk memulai dari kosong.`,
    );
  }

  return parsed.filter(isValid);
}

function writeArrayFile(file: string, entries: unknown[]): void {
  mkdirSync(DATA_DIRECTORY, { recursive: true });

  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  renameSync(temporary, file);
}
