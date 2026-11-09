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
  /**
   * Ilustrasi cadangan yang dipakai bila `src` kosong. Tetap disimpan supaya
   * tampilan tidak hilang ketika gambar asli dikosongkan kembali.
   */
  variant: CoverVariant;
  /**
   * Gambar asli: jalur lokal di dalam `public` (misalnya
   * `/images/projects/dashboard.jpg`) atau URL http/https. Bila kosong,
   * ilustrasi `variant` yang dipakai.
   */
  src?: string;
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

/**
 * Status pencarian anggota sebuah tim.
 *
 * "open" berarti tim sedang menerima perkenalan; "closed" berarti slot
 * sudah terisi sehingga formulir perkenalan tidak lagi tersedia.
 */
export type TeamSearchStatus = "open" | "closed";

/** Satu peran yang dibutuhkan tim, beserta kemampuan yang diharapkan. */
export type TeamRole = {
  /** Peran satu frasa, misalnya "Pengembang frontend". */
  title: string;
  /** Kemampuan yang diharapkan; bisa kosong bila perannya terbuka. */
  skills: string[];
};

/**
 * Papan pencarian anggota tim (pivot "cari tim dari bukti kerja").
 *
 * Ini objek baru yang berbeda dari `Project`: proyek menceritakan karya yang
 * sudah selesai, sedangkan `TeamPost` menyatakan ide/tenggat yang sedang
 * mencari anggota. Bentuk isian pada role sengaja sederhana agar alur
 * "pasang pencarian → terima perkenalan terstruktur" bisa diuji pada tahap ini,
 * sebelum matching otomatis dan ruang kerja tim dibangun.
 */
export type TeamPost = {
  /** Pengenal stabil yang dipakai di URL `/tim/<id>`; unik di seluruh posting. */
  id: string;
  /** Nama tim atau ide yang sedang dibentuk. */
  title: string;
  /** Konteks kompetisi, misalnya "GEMASTIK 2027". */
  competition: string;
  /** Ide singkat proyek: masalah yang dihadapi dan sasaran tim. */
  summary: string;
  /** Username profil Akashic pemilik pencarian (anggota yang sudah ada). */
  ownerUsername: string;
  /** Daftar peran yang masih dicari. */
  roles: TeamRole[];
  /** Jumlah anggota yang sudah ada saat ini, termasuk pemilik. */
  currentMembers: number;
  /** Ukuran tim yang dituju, termasuk pemilik. */
  targetMembers: number;
  /** Komitmen waktu yang diharapkan dari tiap anggota, dalam jam per minggu. */
  weeklyHours: number;
  /** Tenggat pendaftaran kompetisi, ditulis bebas, misalnya "10 Desember 2026". */
  deadline: string;
  /** Ritme kerja/pertemuan yang dipakai tim, ditulis bebas. */
  meetingNote: string;
  status: TeamSearchStatus;
};

/**
 * Perkenalan terstruktur dari seseorang kepada tim.
 *
 * Menggantikan "DM kosong": pengirim menjawab peran, waktu, apa yang dibawa,
 * dan apa yang ingin dipelajari, sehingga pemilik tim tidak perlu membuka
 * percakapan dari nol. Tanpa autentikasi, nama pengirim hanya pernyataan
 * pengirim sendiri; hal itu dinyatakan di UI.
 */
export type TeamIntro = {
  /** Nama panggilan pengirim; opsional karena belum ada autentikasi. */
  senderName: string;
  /** Peran yang diminati; harus salah satu judul role pada posting tim. */
  role: string;
  /** Jam kerja per minggu yang mampu dijamin pengirim, dalam teks. */
  weeklyHours: string;
  /** "Apa yang saya bawa" — keahlian plus tautan bukti bila ada. */
  bring: string;
  /** "Ingin belajar" — audiens yang jujur, opsional. */
  learn: string;
  /** Tautan bukti opsional; hanya http/https yang dirender. */
  proofUrl: string;
  /** Kontak yang bisa dihubungi (email, WhatsApp, LINE, dll.); wajib pada perkenalan baru, perkenalan lama mungkin belum memilikinya. */
  contact?: string;
};

/**
 * Status tinjauan pemilik tim atas satu perkenalan masuk.
 *
 * Disimpan terpisah dari isi perkenalan karena perkenalan bersifat append-only
 * milik pengirim, sedangkan status ini keputusan pemilik tim.
 */
export type IntroReviewStatus = "baru" | "diskusi" | "diterima" | "ditolak";

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
