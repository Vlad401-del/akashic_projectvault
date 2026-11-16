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
import { isHttpsExternalUrl } from "@/lib/url";

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
  currentMembers?: string;
  targetMembers?: string;
  weeklyHours?: string;
  deadline?: string;
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
  shareContact: boolean;
};

export type IntroErrors = {
  role?: string;
  weeklyHours?: string;
  bring?: string;
  proofUrl?: string;
  contact?: string;
  shareContact?: string;
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
export function validateTeamForm(form: TeamPostForm, allowFull = false): TeamErrors {
  const errors: TeamErrors = {};

  if (form.title.trim().length < 3 || form.title.trim().length > 160) {
    errors.title = "Judul tim harus 3–160 karakter.";
  }

  const hasCategory = /^(GEMASTIK|PKM|Hackathon|Tugas Akhir|Lainnya)/i.test(form.competition.trim());
  if (form.competition.trim().length === 0 || !hasCategory) {
    errors.competition = "Pilih kategori lomba terlebih dahulu.";
  }

  if (form.summary.trim().length < 20 || form.summary.trim().length > 5000) {
    errors.summary = "Jelaskan ide dalam 20–5000 karakter.";
  }

  const current = Number(form.currentMembers);
  const target = Number(form.targetMembers);
  const hours = Number(form.weeklyHours);
  if (!Number.isInteger(current) || current < 1) {
    errors.currentMembers = "Isi jumlah anggota saat ini, minimal 1.";
  }
  if (!Number.isInteger(target) || (allowFull ? target < current : target <= current)) {
    errors.targetMembers = allowFull
      ? "Target anggota tidak boleh lebih sedikit dari anggota saat ini."
      : "Target anggota harus lebih banyak dari anggota saat ini.";
  }
  if (!Number.isInteger(hours) || hours < 1 || hours > 40) {
    errors.weeklyHours = "Isi komitmen 1–40 jam per minggu.";
  }

  const deadline = form.deadline.trim();
  const parsedDeadline = new Date(`${deadline}T00:00:00Z`);
  const todayInJakarta = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
      !Number.isFinite(parsedDeadline.getTime()) ||
      parsedDeadline.toISOString().slice(0, 10) !== deadline ||
      deadline < todayInJakarta) {
    errors.deadline = "Pilih tenggat hari ini atau setelahnya.";
  }

  const roleErrors: Record<number, string> = {};
  const usedRoles = new Set<string>();

  form.roles.forEach((role, index) => {
    const title = role.title.trim();
    if (title.length < 2 || title.length > 100) {
      roleErrors[index] = "Nama peran harus 2–100 karakter.";
    } else if (usedRoles.has(title.toLowerCase())) {
      roleErrors[index] = "Nama peran tidak boleh sama dalam satu tim.";
    } else if (toCsv(role.skills).length === 0) {
      roleErrors[index] = "Isi setidaknya satu keahlian untuk peran ini.";
    }
    usedRoles.add(title.toLowerCase());
  });

  if (Object.keys(roleErrors).length > 0) {
    errors.roles = roleErrors;
  }

  return errors;
}

export function hasTeamErrors(errors: TeamErrors): boolean {
  return Boolean(
    errors.title || errors.competition || errors.summary ||
    errors.currentMembers || errors.targetMembers || errors.weeklyHours || errors.deadline || errors.roles,
  );
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
 * Setiap pengajuan perlu tautan bukti HTTPS agar pemilik tim dapat memeriksa
 * pengalaman yang disebutkan pelamar.
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

  if (!proofUrl) {
    errors.proofUrl = "Isi tautan bukti karya, misalnya profil Akashic, GitHub, atau Figma.";
  } else if (!isHttpsExternalUrl(proofUrl)) {
    errors.proofUrl = "Tautan harus dimulai dengan https://. Contoh: https://github.com/namamu";
  }

  if (form.contact.trim().length < 3) {
    errors.contact = "Isi kontak yang bisa dihubungi, misalnya email atau nomor WhatsApp.";
  }
  if (form.shareContact !== true) {
    errors.shareContact = "Setujui pembagian kontak kepada pemilik tim sebelum mengirim.";
  }

  return errors;
}

export function hasIntroErrors(errors: IntroErrors): boolean {
  return Boolean(errors.role || errors.weeklyHours || errors.bring || errors.proofUrl || errors.contact || errors.shareContact);
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
    shareContact: false,
  };
}
