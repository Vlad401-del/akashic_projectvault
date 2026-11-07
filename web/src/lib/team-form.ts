/**
 * Model formulir papan pencarian anggota tim dan validasi keduanya.
 *
 * Mengikuti pola `editor-form.ts`: seluruh fungsi di berkas ini murni (tanpa
 * React) supaya validasi yang sama dapat dipakai di peramban dan ulang di
 * server (`team-actions.ts`), sehingga permintaan yang dibuat tanpa lewat UI
 * pun tidak bisa menyimpan data rusak.
 *
 * Dua formulir:
 * - `TeamPostForm` : pencarian anggota baru di `/dashboard/tim/baru`.
 * - `IntroForm`    : perkenalan terstruktur dari pengunjung di `/tim/[id]`.
 */
import type { TeamPost, TeamRole, TeamSearchStatus } from "@/lib/fixtures/types";
import { slugify, toCsv } from "@/lib/editor-form";
import { isSafeExternalUrl } from "@/lib/url";

/** Satu baris peran di dalam formulir pencarian. */
export type TeamRoleForm = {
  title: string;
  /** Diketik dipisah koma, mis. "SQL, Figma". */
  skills: string;
};

/** Isian pencarian anggota baru sebagai teks datar. */
export type TeamPostForm = {
  title: string;
  competition: string;
  summary: string;
  /** Diketik sebagai teks dan diurai menjadi angka; kosong berarti tidak diisi. */
  currentMembers: string;
  targetMembers: string;
  weeklyHours: string;
  deadline: string;
  meetingNote: string;
  roles: TeamRoleForm[];
};

export type TeamErrors = {
  title?: string;
  competition?: string;
  summary?: string;
  roles?: Record<number, string>;
};

/** Isian perkenalan terstruktur dari pengunjung. */
export type IntroForm = {
  senderName: string;
  role: string;
  weeklyHours: string;
  bring: string;
  learn: string;
  proofUrl: string;
  contact: string;
};

export type IntroErrors = {
  role?: string;
  weeklyHours?: string;
  bring?: string;
  proofUrl?: string;
  contact?: string;
};

function optionalNumber(value: string): number | null {
  const parsed = Number.parseInt(value.trim(), 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Formulir pencarian kosong; baris peran pertama sudah disiapkan. */
export function emptyTeamForm(): TeamPostForm {
  return {
    title: "",
    competition: "",
    summary: "",
    currentMembers: "",
    targetMembers: "",
    weeklyHours: "",
    deadline: "",
    meetingNote: "",
    roles: [{ title: "", skills: "" }],
  };
}

/** Memeriksa isian pencarian anggota baru. */
export function validateTeamForm(form: TeamPostForm): TeamErrors {
  const errors: TeamErrors = {};

  if (form.title.trim().length === 0) {
    errors.title = "Judul tim wajib diisi.";
  }

  if (form.competition.trim().length === 0) {
    errors.competition = "Kompetisi atau konteks wajib diisi.";
  }

  if (form.summary.trim().length === 0) {
    errors.summary = "Ide singkat wajib diisi.";
  }

  const roleErrors: Record<number, string> = {};

  form.roles.forEach((role, index) => {
    if (role.title.trim().length === 0 && role.skills.trim().length === 0) {
      // Baris yang sepenuhnya kosong dianggap tidak dipakai dan diabaikan.
      return;
    }

    if (role.title.trim().length === 0) {
      roleErrors[index] = "Judul peran wajib diisi.";
    }
  });

  if (Object.keys(roleErrors).length > 0) {
    errors.roles = roleErrors;
  }

  return errors;
}

export function hasTeamErrors(errors: TeamErrors): boolean {
  return Boolean(errors.title || errors.competition || errors.summary || errors.roles);
}

function parseMembers(value: string, fallback: number): number {
  return optionalNumber(value) ?? fallback;
}

/**
 * Menyusun `TeamPost` dari isian formulir.
 *
 * Nilai angka yang tidak diisi memakai pengaman lapis ketiga: jumlah sekarang
 * minimal 1, ukuran target minimal sama dengan jumlah sekarang, dan komitmen
 * waktu ditulis sebagai angka apa adanya (0 berarti tidak dinyatakan).
 */
export function teamPostFromForm(form: TeamPostForm, status: TeamSearchStatus): TeamPost {
  const currentMembers = parseMembers(form.currentMembers, 1);
  const targetMembers = Math.max(currentMembers, parseMembers(form.targetMembers, currentMembers));
  const weeklyHours = optionalNumber(form.weeklyHours) ?? 0;
  const roles: TeamRole[] = form.roles
    .map((role) => ({ title: role.title.trim(), skills: toCsv(role.skills) }))
    .filter((role) => role.title.length > 0);

  return {
    id: slugify(form.title) || "tim-baru",
    title: form.title.trim() || "Tim tanpa judul",
    competition: form.competition.trim() || "Tanpa konteks lomba",
    summary: form.summary.trim(),
    ownerUsername: "",
    roles,
    currentMembers,
    targetMembers,
    weeklyHours,
    deadline: form.deadline.trim() || "Belum ditetapkan",
    meetingNote: form.meetingNote.trim() || "Ritme kerja disepakati bersama.",
    status,
  };
}

/**
 * Memeriksa isian perkenalan terhadap daftar peran yang tersedia pada tim.
 *
 * Tautan bukti opsional, tetapi bila diisi harus aman (http/https) dengan
 * aturan yang sama seperti tautan bukti karya pada editor proyek.
 */
export function validateIntroForm(form: IntroForm, roleTitles: string[]): IntroErrors {
  const errors: IntroErrors = {};

  if (form.role.trim().length === 0) {
    errors.role = "Pilih peran yang diminati.";
  } else if (!roleTitles.includes(form.role.trim())) {
    errors.role = "Peran ini bukan bagian dari pencarian yang dituju.";
  }

  const hours = Number.parseInt(form.weeklyHours.trim(), 10);

  if (!Number.isFinite(hours) || hours < 1 || hours > 40) {
    errors.weeklyHours = "Isi jam per minggu di antara 1 sampai 40.";
  }

  if (form.bring.trim().length < 12) {
    errors.bring = "Tulis sekurangnya satu kalimat tentang apa yang Anda bawa.";
  }

  const proofUrl = form.proofUrl.trim();

  if (proofUrl.length > 0 && !isSafeExternalUrl(proofUrl)) {
    errors.proofUrl = "Gunakan alamat lengkap yang berawalan https:// atau http://.";
  }

  if (form.contact.trim().length < 3) {
    errors.contact = "Isi kontak yang bisa dihubungi, misalnya email atau nomor WhatsApp.";
  }

  return errors;
}

export function hasIntroErrors(errors: IntroErrors): boolean {
  return Boolean(errors.role || errors.weeklyHours || errors.bring || errors.proofUrl || errors.contact);
}

/** Formulir perkenalan kosong; peran diisi sesuai permintaan papan. */
export function emptyIntroForm(role: string): IntroForm {
  return {
    senderName: "",
    role,
    weeklyHours: "",
    bring: "",
    learn: "",
    proofUrl: "",
    contact: "",
  };
}
