/**
 * Model formulir editor proyek (tahap UI).
 *
 * Editor memakai textarea biasa, bukan editor dokumen kompleks, sesuai
 * spesifikasi. Karena di halaman publik narasi tersimpan sebagai daftar,
 * formulir ini memakai pemisah sederhana yang ditulis di keterangan tiap isian:
 *
 * - Paragraf          : dipisah satu baris kosong.
 * - Butir daftar      : satu butir per baris.
 * - Pasangan judul/isi: satu pasang per baris, "Judul — penjelasan".
 *
 * Seluruh fungsi di berkas ini murni (tanpa React) supaya bisa diperiksa
 * terpisah dan nanti dipakai ulang sebagai validasi di server ketika database
 * dan autentikasi sudah tersedia.
 */
import type {
  CoverVariant,
  Project,
  ProjectStatus,
  Teammate,
  WorkType,
} from "@/lib/fixtures/types";
import { isSafeExternalUrl } from "@/lib/url";

/** Satu baris tautan bukti karya di dalam formulir. */
export type EditorSource = {
  label: string;
  url: string;
};

/** Seluruh isian formulir editor sebagai teks datar. */
export type EditorForm = {
  title: string;
  summary: string;
  category: string;
  course: string;
  workType: WorkType;
  teamSize: string;
  period: string;
  role: string;
  skills: string;
  tools: string;
  problem: string;
  questions: string;
  processIntro: string;
  processSteps: string;
  processNote: string;
  contributionIntro: string;
  contributionChecklist: string;
  designDecision: string;
  teammates: string;
  outcomeIntro: string;
  outcomeNote: string;
  outcomeCards: string;
  coverVariant: CoverVariant;
  coverAlt: string;
  coverCaption: string;
  sources: EditorSource[];
  /** Pernyataan pemilik bahwa ia berhak membagikan karya ini. */
  consentRights: boolean;
  /** Pernyataan pemilik bahwa tidak ada data sensitif di dalamnya. */
  consentNoSensitive: boolean;
};

export type EditorErrors = {
  title?: string;
  summary?: string;
  sources?: Record<number, string>;
};

export type ChecklistItem = {
  id: string;
  label: string;
  ok: boolean;
};

/** Pemisah yang disarankan untuk pasangan judul/isi. */
export const PAIR_SEPARATOR = "—";

/** Memisah teks menjadi paragraf pada setiap baris kosong. */
export function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

/** Memisah teks menjadi butir daftar, satu butir per baris. */
export function toBullets(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Memisah teks seperti "Label, Label" menjadi daftar tanpa duplikat. */
export function toCsv(value: string): string[] {
  const items = value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return Array.from(new Set(items));
}

/**
 * Memisah baris "Judul — penjelasan" menjadi pasangan.
 *
 * Tanda pisah yang diterima: em dash, en dash, tanda hubung di antara spasi,
 * atau titik dua. Baris tanpa pemisah tetap dipakai dengan isi kosong, supaya
 * pengguna tidak kehilangan tulisannya karena salah mengetik pemisah.
 */
export function toLabelledItems(value: string): { title: string; body: string }[] {
  return toBullets(value).map((line) => {
    const withDash = line.match(/^(.*?)\s+[—–-]\s+(.*)$/);

    if (withDash) {
      return { title: withDash[1].trim(), body: withDash[2].trim() };
    }

    const withColon = line.match(/^([^:]{1,64}):\s+(.*)$/);

    if (withColon) {
      return { title: withColon[1].trim(), body: withColon[2].trim() };
    }

    return { title: line, body: "" };
  });
}

/** Mengubah judul menjadi kandidat slug; dipakai sebagai pratinjau saja. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "");
}

function optional(value: string): string | null {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parseTeamSize(value: string): number | null {
  const parsed = Number.parseInt(value.trim(), 10);

  return Number.isFinite(parsed) && parsed > 1 ? parsed : null;
}

/** Formulir kosong untuk layar "Proyek baru". */
export function emptyForm(): EditorForm {
  return {
    title: "",
    summary: "",
    category: "",
    course: "",
    workType: "individu",
    teamSize: "",
    period: "",
    role: "",
    skills: "",
    tools: "",
    problem: "",
    questions: "",
    processIntro: "",
    processSteps: "",
    processNote: "",
    contributionIntro: "",
    contributionChecklist: "",
    designDecision: "",
    teammates: "",
    outcomeIntro: "",
    outcomeNote: "",
    outcomeCards: "",
    coverVariant: "dashboard",
    coverAlt: "",
    coverCaption: "",
    sources: [{ label: "", url: "" }],
    consentRights: false,
    consentNoSensitive: false,
  };
}

/** Mengisi formulir dari proyek yang sudah ada (draft atau sudah terbit). */
export function projectToForm(project: Project): EditorForm {
  return {
    title: project.title,
    summary: project.summary,
    category: project.category,
    course: project.course ?? "",
    workType: project.workType,
    teamSize: project.teamSize ? String(project.teamSize) : "",
    period: project.period ?? "",
    role: project.role ?? "",
    skills: project.skills.join(", "),
    tools: project.tools.join(", "),
    problem: project.problem.join("\n\n"),
    questions: project.questions.join("\n"),
    processIntro: project.processIntro,
    processSteps: project.processSteps
      .map((step) => `${step.title} ${PAIR_SEPARATOR} ${step.body}`)
      .join("\n"),
    processNote: project.processNote ?? "",
    contributionIntro: project.contributionIntro,
    contributionChecklist: project.contributionChecklist.join("\n"),
    designDecision: project.designDecision ?? "",
    teammates: project.teammates.map((member) => `${member.name} ${PAIR_SEPARATOR} ${member.task}`).join("\n"),
    outcomeIntro: project.outcomeIntro,
    outcomeNote: project.outcomeNote ?? "",
    outcomeCards: project.outcomeCards
      .map((card) => `${card.title} ${PAIR_SEPARATOR} ${card.body}`)
      .join("\n"),
    coverVariant: project.cover.variant,
    coverAlt: project.cover.alt,
    coverCaption: project.cover.caption ?? "",
    sources: project.sources.length > 0 ? project.sources.map((source) => ({ ...source })) : [{ label: "", url: "" }],
    consentRights: false,
    consentNoSensitive: false,
  };
}

/**
 * Menyusun proyek sementara dari isi formulir.
 *
 * Dipakai untuk panel pratinjau ringkas dan jendela pratinjau penuh, bukan
 * untuk disimpan ke database. Galeri dikosongkan karena unggahan gambar baru
 * masuk tahap berikutnya.
 */
export function formToProject(form: EditorForm, status: ProjectStatus): Project {
  const teammates: Teammate[] = toLabelledItems(form.teammates).map((item) => ({
    name: item.title,
    task: item.body,
  }));

  return {
    slug: slugify(form.title) || "proyek-baru",
    title: form.title.trim() || "Proyek tanpa judul",
    summary: form.summary.trim(),
    category: form.category.trim() || "Tanpa kategori",
    workType: form.workType,
    period: optional(form.period),
    course: optional(form.course),
    role: optional(form.role),
    teamSize: form.workType === "kelompok" ? parseTeamSize(form.teamSize) : null,
    skills: toCsv(form.skills),
    tools: toCsv(form.tools),
    problem: toParagraphs(form.problem),
    questions: toBullets(form.questions),
    processIntro: form.processIntro.trim(),
    processSteps: toLabelledItems(form.processSteps).map((item) => ({ title: item.title, body: item.body })),
    processNote: optional(form.processNote),
    contributionIntro: form.contributionIntro.trim(),
    contributionChecklist: toBullets(form.contributionChecklist),
    designDecision: optional(form.designDecision),
    teammates,
    outcomeIntro: form.outcomeIntro.trim(),
    outcomeNote: optional(form.outcomeNote),
    outcomeCards: toLabelledItems(form.outcomeCards).map((item) => ({ title: item.title, body: item.body })),
    cover: {
      alt: form.coverAlt.trim() || "Ilustrasi contoh sampul proyek.",
      variant: form.coverVariant,
      ...(form.coverCaption.trim() ? { caption: form.coverCaption.trim() } : {}),
    },
    gallery: [],
    sources: form.sources
      .map((source) => ({ label: source.label.trim(), url: source.url.trim() }))
      .filter((source) => source.label.length > 0 && source.url.length > 0),
    status,
  };
}

/** Memeriksa isian wajib dan keamanan alamat tautan bukti karya. */
export function validateForm(form: EditorForm): EditorErrors {
  const errors: EditorErrors = {};

  if (form.title.trim().length === 0) {
    errors.title = "Judul proyek wajib diisi.";
  }

  if (form.summary.trim().length === 0) {
    errors.summary = "Ringkasan wajib diisi, cukup dua kalimat.";
  }

  const sourceErrors: Record<number, string> = {};

  form.sources.forEach((source, index) => {
    const label = source.label.trim();
    const url = source.url.trim();

    if (label.length === 0 && url.length === 0) {
      return;
    }

    if (label.length === 0) {
      sourceErrors[index] = "Label tautan wajib diisi.";
    } else if (url.length === 0) {
      sourceErrors[index] = "Alamat tautan wajib diisi.";
    } else if (!isSafeExternalUrl(url)) {
      sourceErrors[index] = "Gunakan alamat lengkap yang berawalan https:// atau http://.";
    }
  });

  if (Object.keys(sourceErrors).length > 0) {
    errors.sources = sourceErrors;
  }

  return errors;
}

export function hasErrors(errors: EditorErrors): boolean {
  return Boolean(errors.title || errors.summary || errors.sources);
}

/**
 * Checklist sebelum menerbitkan.
 *
 * Ini pernyataan pengguna, bukan verifikasi platform. Isinya mengikuti
 * spesifikasi: judul dan narasi wajib lengkap, kontribusi pribadi jelas, dan
 * minimal satu bukti berupa gambar atau tautan.
 */
export function publishChecklist(form: EditorForm): ChecklistItem[] {
  const hasSafeSource = form.sources.some((source) => isSafeExternalUrl(source.url));
  const hasCoverNote = form.coverAlt.trim().length > 0;

  return [
    { id: "judul", label: "Judul proyek terisi", ok: form.title.trim().length > 0 },
    { id: "ringkasan", label: "Ringkasan proyek terisi", ok: form.summary.trim().length > 0 },
    { id: "masalah", label: "Bagian Masalah terisi", ok: toParagraphs(form.problem).length > 0 },
    {
      id: "proses",
      label: "Bagian Proses terisi",
      ok: form.processIntro.trim().length > 0 || toLabelledItems(form.processSteps).length > 0,
    },
    {
      id: "kontribusi",
      label: "Kontribusi pribadi dijelaskan",
      ok: toBullets(form.contributionChecklist).length > 0 || form.contributionIntro.trim().length > 0,
    },
    { id: "hasil", label: "Bagian Hasil terisi", ok: form.outcomeIntro.trim().length > 0 },
    {
      id: "bukti",
      label: "Ada minimal satu bukti: tautan atau keterangan sampul",
      ok: hasSafeSource || hasCoverNote,
    },
  ];
}

export function canPublish(form: EditorForm): boolean {
  const checklistReady = publishChecklist(form).every((item) => item.ok);

  return checklistReady && form.consentRights && form.consentNoSensitive;
}
