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
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
