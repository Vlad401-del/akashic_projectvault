/**
 * Tipe data untuk tahap 1 Akashic.
 *
 * Bentuk tipe ini sengaja dibuat mirip dengan struktur tabel yang direncanakan
 * pada tahap Supabase (profiles, projects, project_sources, project_images),
 * sehingga penggantian fixture menjadi data nyata tidak mengubah komponen UI.
 *
 * Sejak penyelarasan dengan desain Figma Make, narasi studi kasus tidak lagi
 * satu blok teks panjang, melainkan bagian-bagian kecil (pertanyaan, langkah
 * proses, daftar kontribusi, kartu hasil). Tujuannya sama seperti sebelumnya:
 * memisahkan pekerjaan pribadi dari hasil kelompok secara eksplisit.
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
  /** Keterangan singkat di bawah gambar; opsional. */
  caption?: string;
};

/** Proyek dikerjakan sendiri atau kelompok. */
export type WorkType = "individu" | "kelompok";

/** Status visibilitas di dalam aplikasi, bukan status hosting. */
export type ProjectStatus = "draft" | "published";

/** Satu langkah pada bagian Proses. */
export type ProcessStep = {
  title: string;
  body: string;
};

/** Kartu pendukung pada bagian Hasil ("Yang saya pikirkan", "Keterbatasan"). */
export type OutcomeCard = {
  title: string;
  body: string;
};

/** Anggota tim lain beserta bagian yang dikerjakannya. */
export type Teammate = {
  name: string;
  task: string;
};

/** Jenis kanal kontak; menentukan ikon dan gaya tombol. */
export type ContactKind = "email" | "linkedin" | "cv" | "situs";

/** Kanal kontak yang sudah disetujui pemilik untuk tampil publik. */
export type ContactLink = SourceLink & { kind: ContactKind };

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
  /** Peran pemilik proyek dalam satu frasa, misalnya "Analisis data dan desain dasbor". */
  role: string | null;
  /** Jumlah anggota tim; `null` untuk tugas individu. */
  teamSize: number | null;
  /** Keterampilan yang tampil sebagai label pada kartu dan header. */
  skills: string[];
  /** Alat yang dipakai, misalnya "Tableau Public". */
  tools: string[];
  /** Paragraf pembuka bagian Masalah. */
  problem: string[];
  /** Pertanyaan yang dijawab proyek; tampil sebagai daftar bernomor. */
  questions: string[];
  processIntro: string;
  processSteps: ProcessStep[];
  /** Catatan tambahan pada bagian Proses (aturan, asumsi, keputusan teknis). */
  processNote: string | null;
  contributionIntro: string;
  /** Daftar pekerjaan yang benar-benar dikerjakan sendiri. */
  contributionChecklist: string[];
  /** Keputusan desain/teknis yang diambil sendiri beserta alasannya. */
  designDecision: string | null;
  /** Bagian yang dikerjakan anggota tim lain; kosong untuk tugas individu. */
  teammates: Teammate[];
  outcomeIntro: string;
  /** Catatan hasil, misalnya hal yang belum selesai atau perlu diperiksa lagi. */
  outcomeNote: string | null;
  /** Dua kartu pendukung: yang dipikirkan pemilik proyek dan keterbatasannya. */
  outcomeCards: OutcomeCard[];
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
  /** Program studi dan kampus, misalnya "Sistem Informasi, Universitas Nusantara". */
  program: string;
  /** Kota domisili yang boleh tampil publik. */
  city: string;
  skills: string[];
  /** Kanal kontak opsional yang sudah disetujui pemilik untuk tampil publik. */
  contacts: ContactLink[];
  /** Profil privat menyembunyikan seluruh proyeknya dari pengunjung anonim. */
  isPublished: boolean;
  projects: Project[];
};
