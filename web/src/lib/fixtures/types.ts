/**
 * Tipe data untuk tahap 1 Akashic.
 *
 * Bentuk tipe ini sengaja dibuat mirip dengan struktur tabel yang direncanakan
 * pada tahap Supabase (profiles, projects, project_sources, project_images),
 * sehingga penggantian fixture menjadi data nyata tidak mengubah komponen UI.
 */

/** Satu tautan bukti karya (dashboard, laporan, repositori, prototipe). */
export type SourceLink = {
  /** Label tombol, misalnya "Lihat dashboard". */
  label: string;
  /** URL absolut; hanya http/https yang dirender (lihat `lib/url.ts`). */
  url: string;
};

/** Jenis ilustrasi placeholder pengganti gambar asli pada tahap fixture. */
export type CoverVariant = "dashboard" | "aplikasi" | "riset" | "laporan" | "alur";

/** Gambar sampul atau item galeri. */
export type ProjectImage = {
  /** Alt text yang dibaca pembaca layar. */
  alt: string;
  variant: CoverVariant;
};

/** Proyek dikerjakan sendiri atau kelompok. */
export type WorkType = "individu" | "kelompok";

/** Status visibilitas di dalam aplikasi, bukan status hosting. */
export type ProjectStatus = "draft" | "published";

export type Project = {
  slug: string;
  title: string;
  /** Ringkasan dua kalimat yang tampil di kartu dan header detail. */
  summary: string;
  /** Kategori singkat, misalnya "Visualisasi Data". */
  category: string;
  workType: WorkType;
  /** Periode opsional, misalnya "Februari – Mei 2026". */
  period: string | null;
  /** Konteks mata kuliah opsional. */
  course: string | null;
  skills: string[];
  problem: string;
  process: string;
  /** Kontribusi pribadi; wajib dipisahkan dari hasil kelompok. */
  contribution: string;
  outcome: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  sources: SourceLink[];
  status: ProjectStatus;
};

export type Profile = {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  skills: string[];
  /** Tautan kontak opsional yang sudah disetujui pemilik untuk tampil publik. */
  contact: SourceLink | null;
  /** Profil privat menyembunyikan seluruh proyeknya dari pengunjung anonim. */
  isPublished: boolean;
  projects: Project[];
};
