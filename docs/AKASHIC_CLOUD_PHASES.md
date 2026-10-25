# Tahapan Akashic menuju Vercel

25 Oktober 2026. Rencana ini mengikuti keputusan terbaru pemilik produk: Next.js di Vercel dan Supabase Cloud untuk PostgreSQL, Auth, serta Storage. Dokumen Supabase lokal dan Docker sebelumnya merupakan arsip, bukan langkah instalasi saat ini.

## Tahap 1 — fondasi aman (dikerjakan di checkout lokal)

- Editor demo tanpa login hanya tampil saat `npm run dev`. Pada build produksi, `/dashboard` dan seluruh layar edit diblokir; tindakan simpan juga menolak permintaan langsung.
- Halaman publik tetap memakai fixture, sehingga dapat dicoba sebagai demo baca saja.
- `web/.env.example` menamai variabel Supabase Cloud tanpa menyimpan kunci nyata.
- `web/supabase/migrations/20261025151312_akashic_core.sql` menyiapkan `profiles`, `projects`, `project_sources`, `project_images`, dan aturan visibilitas. Migration ini diterapkan pada proyek Supabase Cloud `vrncyponqsuhqzldwrvw` pada 25 Oktober 2026. Keempat tabel masih kosong, RLS aktif, dan penasihat keamanan tidak menemukan isu. Uji akses dengan dua akun belum dilakukan.

## Tahap 2 — akun dan akses

1. Selesai: proyek Supabase Cloud sudah dibuat dan migration awal telah diterapkan satu kali.
2. Selesai lokal: paket klien Supabase terpasang dan `.env.local` memakai publishable key (diabaikan Git). Variabel yang sama belum diisi di Vercel.
3. Selesai di kode lokal, belum diuji dengan akun nyata: daftar, masuk, keluar, pemulihan sandi, dan dashboard yang membaca sesi pengguna di server. Migration kedua membuat profil privat saat akun baru didaftarkan.
4. Belum selesai: uji dua akun berbeda dan pengunjung tanpa login. Proyek draft serta profil privat harus tidak terbaca oleh akun lain, termasuk lewat permintaan langsung ke database.

## Tahap 3 — data proyek

1. Selesai di kode lokal, belum diuji dengan akun nyata: aksi Simpan/Terbitkan/Tarik memakai tabel Supabase saat konfigurasi Cloud tersedia. Berkas `.data/projects.json` tetap untuk editor demo tanpa konfigurasi Cloud.
2. Selesai di kode lokal: `story` mempertahankan bagian narasi, dan tautan HTTPS disimpan di `project_sources`.
3. Selesai di kode lokal: halaman publik membaca profil/proyek nyata dan tetap memisahkan fixture berlabel contoh.
4. Belum selesai: uji draft, terbit, tarik terbit, perubahan proyek terbit, serta pergantian username dan slug dengan akun nyata.

## Tahap 4 — gambar dan rilis

1. Siapkan bucket Supabase Storage privat dan aturan akses berkas yang mengikuti status profil/proyek. Aturan tabel `project_images` saja tidak melindungi file.
2. Batasi jenis, ukuran, dan jumlah gambar; uji akses gambar milik draft dari pengguna anonim.
3. Di Vercel, pilih Root Directory `web/`, isi variabel lingkungan, periksa build, rute publik, dan alur akun. Aktifkan editor online hanya setelah autentikasi dan penyimpanan database bekerja.

## Checkpoint tiap tahap

Setiap tahap dilaporkan dengan berkas yang berubah, fungsi yang berhasil dicoba, serta hal yang belum diuji. Tidak ada commit, push, atau deployment otomatis sebagai bagian dari tahap pertama ini.
