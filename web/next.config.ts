import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * `cacheComponents` (Cache Components / Partial Prerender) bawaan template
   * sengaja dimatikan untuk tahap MVP.
   *
   * Alasannya: dengan flag itu menyala, rute dinamis seperti /u/[username]
   * dilayani sebagai "shell" lebih dahulu, sehingga `notFound()` tidak dapat
   * mengubah status HTTP. Permintaan pertama untuk username yang belum pernah
   * dibuka membalas 200 (soft-404), baru permintaan berikutnya membalas 404.
   *
   * Aturan visibilitas Akashic (username tidak ada, profil privat, dan proyek
   * draft harus benar-benar tidak ditemukan) lebih penting daripada optimasi
   * prerender parsial pada tahap ini. Flag ini bisa dinyalakan kembali ketika
   * penanganan soft-404 sudah disepakati bersama.
   */
  cacheComponents: false,
  /*
   * Batas pekerja saat `next build` (tahap "Generating static pages").
   *
   * Bawaan Next.js memakai `jumlah CPU - 1` (16 core → 15 pekerja). Pada
   * mesin dengan memori bebas kecil, 15 proses sekaligus membuat build mati
   * dengan "Fatal process out of memory: Zone". Dibatasi ke angka kecil agar
   * build tetap selesai di laptop biasa; jumlah halaman Akashic sedikit,
   * jadi waktu tambahannya tidak berarti.
   */
  experimental: {
    cpus: 2,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
