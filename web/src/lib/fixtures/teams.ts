/**
 * DATA CONTOH (FIXTURE) PAPAN PENCARIAN ANGGOTA TIM — TAHAP PIVOT.
 *
 * Seperti `fixtures.ts`, seluruh isi di berkas ini fiktif dan hanya dipakai
 * untuk menguji tata letak serta alur "pasang pencarian → terima perkenalan".
 * Tenggat ditulis sebagai tanggal yang masih di masa depan supaya kartu tidak
 * terlihat kedaluwarsa; tidak ada hadiah atau metrik lomba yang dinyatakan.
 *
 * Dua posting contoh sengaja dimiliki akun yang bukan pemilik editor:
 *
 * | Pemilik | Kondisi                              | Perilaku yang diuji                |
 * |---------|--------------------------------------|------------------------------------|
 * | darryl  | Pencarian terbuka, 2 peran           | Kartu dan detail tampil di papan   |
 * | rangga  | Pencarian terbuka, 1 peran           | Pencarian sederhana satu peran     |
 *
 * Pemilik editor (nadia) belum punya pencarian di fixture supaya keadaan
 * kosong pada dashboard teruji, dan pencarian pertamanya dapat dibuat lewat
 * formulir `/dashboard/tim/baru`.
 */
import type { TeamPost } from "./types";

export const teamPosts: TeamPost[] = [
  {
    id: "gemastik-2027-analitik-komplain",
    title: "Tim GEMASTIK 2027 — Analitik Keluhan Asrama",
    competition: "GEMASTIK 2027 (Analitis Data)",
    summary:
      "Ide untuk lomba analitik data: merapikan catatan keluhan asrama yang selama ini tersebar di tiga buku tulis menjadi satu dasbor mingguan untuk panitia. Laporan sering tidak konsisten karena setiap panitia menulis dengan format berbeda, dan keluhan antar bulan belum pernah bisa dibandingkan. Peran dibagi jelas sejak awal: satu orang data, satu antarmuka, dan satu narasi.",
    ownerUsername: "darryl",
    roles: [
      {
        title: "Pengolahan data",
        skills: ["SQL", "Pembersihan data", "Spreadsheet lanjutan"],
      },
      {
        title: "Desain antarmuka",
        skills: ["Figma", "Prototipe", "Wireframe"],
      },
    ],
    currentMembers: 1,
    targetMembers: 3,
    weeklyHours: 8,
    deadline: "10 Desember 2026",
    meetingNote:
      "Kelompok belajar dua kali sepekan di lab, minggu potensi online. Progres ditulis di dokumen bersama sebelum tiap pertemuan supaya yang absen tetap ikut.",
    status: "open",
  },
  {
    id: "pkm-k-jadwal-shift-lab",
    title: "Tim PKM-K — Aplikasi jadwal shift lab",
    competition: "PKM-K 2027",
    summary:
      "Ide pemberdayaan: jadwal shift asisten lab saat ini ditulis di papan tulis dan sering berubah tanpa diketahui asisten yang lain. Aplikasi kecil berbasis web dapat menampilkan jadwal aktif dan pengingat singkat. Saat ini baru ada kerangka alurnya, sehingga pengerjaan desain dan pengembangan masih terbuka.",
    ownerUsername: "rangga",
    roles: [
      {
        title: "Pengembang web",
        skills: ["HTML", "CSS", "JavaScript dasar"],
      },
    ],
    currentMembers: 2,
    targetMembers: 3,
    weeklyHours: 6,
    deadline: "18 Januari 2027",
    meetingNote:
      "Kerja paling sering asinkron lewat pesan; pertemuan langsung cukup sekali sepekan untuk mencoba aplikasi bersama di lab.",
    status: "open",
  },
];
