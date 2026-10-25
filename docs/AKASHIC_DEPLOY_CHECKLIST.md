# Checklist rilis Akashic di Vercel

25 Oktober 2026. Gunakan proyek GitHub `Vlad401-del/akashic_projectvault`, proyek Supabase
`vrncyponqsuhqzldwrvw`, dan proyek Vercel yang sudah terhubung ke repositori itu.

## Sudah disiapkan di checkout lokal

- Next.js memakai `@supabase/ssr` dan publishable key. Secret/service-role key tidak ada di kode.
- Supabase Cloud memiliki `profiles`, `projects`, `project_sources`, `project_images`, RLS, dan
  pemicu profil privat untuk akun baru. Dua migration tersimpan di `web/supabase/migrations/`.
- Halaman masuk, daftar, lupa kata sandi, callback, dashboard pribadi, editor proyek, pengaturan
  profil, dan halaman publik telah dihubungkan dalam kode lokal.
- Build produksi, lint, dan pemeriksaan tipe lulus. Rute privat/draft membalas HTTP 404 pada uji
  tanpa login; dashboard mengalihkan ke halaman masuk.

## Sebelum deploy dari GitHub

1. Tinjau perubahan lokal, lalu kirim ke branch/PR yang disepakati tim. Jangan unggah
   `web/.env.local`; Git sudah mengabaikannya. Vercel membangun **kode yang ada di GitHub**,
   bukan perubahan yang hanya tersimpan di laptop.
2. Di proyek Vercel, pastikan **Root Directory** adalah `web` dan framework Next.js. Isi variabel
   Production dan Preview berikut (nilai kunci diambil dari Supabase Dashboard > Project Settings > API Keys):

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://vrncyponqsuhqzldwrvw.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key yang aktif>
   ```

3. Setelah alamat Vercel final diketahui, buka Supabase Dashboard > Authentication > URL
   Configuration. Isi **Site URL** dengan alamat utama aplikasi dan tambahkan Redirect URL
   `https://<domain-aplikasi>/auth/callback`. Untuk uji laptop, tambahkan
   `http://localhost:3000/auth/callback`. Gunakan pola Preview Vercel hanya jika memang perlu;
   jangan membuka wildcard yang lebih luas dari domain tim.
4. Supabase SMTP bawaan hanya dapat mengirim email ke alamat anggota tim proyek. Agar pendaftaran
   dan pemulihan kata sandi untuk pengunjung umum berfungsi, pasang SMTP khusus di Supabase Auth.
   Sampai itu siap, uji hanya dengan alamat anggota tim dan jangan mengumumkan pendaftaran umum.

## Uji setelah deploy

1. Buka `/`, `/login`, dan `/signup`; pastikan halaman tampil tanpa error.
2. Daftar dengan email anggota tim, konfirmasi email, lalu masuk. Pastikan profil baru privat.
3. Buat proyek draft dan pastikan URL publiknya 404. Tambahkan tautan bukti HTTPS, terbitkan
   proyek, lalu terbitkan profil. URL `/u/<username>/p/<slug>` harus tampil tanpa login.
4. Masuk dengan akun kedua. Pastikan proyek draft dan pengaturan profil akun pertama tidak bisa
   dibaca atau diubah. Uji juga setelah keluar.
5. Coba alur lupa kata sandi. Periksa penasihat keamanan Supabase setelah uji.

## Belum termasuk dalam rilis ini

Unggah gambar asli ke Storage dan pengaturan kontak publik. Ilustrasi sampul masih contoh;
tautan bukti HTTPS adalah bukti karya yang dapat dipakai pada versi ini.

Referensi: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls),
[Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp).
