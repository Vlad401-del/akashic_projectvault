# Aktivasi Login Google Akashic

Status 22 November 2026: provider Google Supabase aktif, kredensial tersimpan, pemeriksaan nonce tetap aktif, dan login tanpa email tidak diizinkan. Site URL Production dan tiga callback di bawah sudah terdaftar. `GOOGLE_AUTH_ENABLED=true` sudah diatur lokal. Pengguna mengonfirmasi login Google berhasil sampai dasbor pada browser lokal, serta upload gambar berhasil. Logout dan pemisahan akses dua akun Google belum diverifikasi dalam pengujian ini. Kode Google Login belum di-deploy.

## 1. Buat OAuth Client di Google Cloud

1. Buka https://console.cloud.google.com/ lalu pilih atau buat project Akashic.
2. Buka Google Auth Platform. Isi Branding dengan nama Akashic dan email dukungan yang dapat diakses. Untuk Audience pilih External bila pengguna berasal dari berbagai kampus.
3. Saat masih Testing, tambahkan email penguji pada Test users. Untuk penggunaan umum, selesaikan persyaratan Branding/Audience dan publikasikan sesuai petunjuk Google. Jangan mengaku memiliki domain yang belum dimiliki; ikuti persyaratan domain terverifikasi yang ditampilkan Google.
4. Data Access hanya memakai `openid`, `email`, dan `profile`. Jangan tambah akses Gmail/Drive.
5. Pada Clients buat OAuth client jenis **Web application**. Isi nama `Akashic Web`.
6. Authorized JavaScript origins:
   - `https://akashic-projectvault.vercel.app`
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
7. Authorized redirect URI di Google harus persis:
   `https://vrncyponqsuhqzldwrvw.supabase.co/auth/v1/callback`
8. Simpan Client ID dan Client Secret langsung untuk langkah Supabase. Jangan kirim secret ke chat atau commit ke Git.

## 2. Aktifkan provider di Supabase

1. Buka https://supabase.com/dashboard/project/vrncyponqsuhqzldwrvw/auth/providers lalu pilih Google.
2. Aktifkan Google, masukkan Client ID dan Client Secret dari Google Cloud, lalu simpan. Pertahankan pemeriksaan nonce dan verifikasi email; jangan menyalakan opsi melewatinya.
3. Pada URL Configuration, pastikan Site URL adalah `https://akashic-projectvault.vercel.app`.
4. Tambahkan Redirect URLs secara tepat, tanpa wildcard:
   - `https://akashic-projectvault.vercel.app/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
   - `http://localhost:3000/auth/callback`
5. Pertahankan URL pemulihan sandi yang sudah ada.

Google mengembalikan pengguna ke Supabase; Supabase kemudian mengembalikan pengguna ke callback aplikasi. Kedua URL callback tersebut berbeda dan keduanya diperlukan.

## 3. Aktifkan aplikasi dan uji lokal

1. Tambahkan `GOOGLE_AUTH_ENABLED=true` ke `web/.env.local`, lalu restart `npm run dev`.
2. Buka `http://127.0.0.1:3000/login`. Tombol Google juga tersedia di halaman daftar.
3. Uji akun Google penguji: pilih akun, setujui izin profil dasar, dan pastikan masuk ke dasbor serta identitas profilnya benar.
4. Keluar, muat ulang halaman, dan pastikan dasbor kembali membutuhkan login.
5. Uji pembatalan login dan akun Google kedua: tidak boleh tertukar karya, profil, atau akses tim.
6. Untuk email yang sudah punya akun, pastikan masuk ke akun yang benar. Aplikasi tidak menggabungkan akun berdasarkan input email sendiri; identitas dikelola Supabase.

Alur memakai OAuth melalui Supabase SSR/PKCE; buka dan selesaikan pada browser/origin yang sama. Tombol dinonaktifkan selama permintaan diproses. Kegagalan menampilkan pesan tanpa membocorkan detail token/provider.

## 4. Production setelah pengujian berhasil

Atur `GOOGLE_AUTH_ENABLED=true` pada environment Production Vercel dan deploy ulang kode ini. Flag dibaca server, tidak menggunakan prefix NEXT_PUBLIC. Secret Google tetap hanya di Supabase. Jangan aktifkan flag sebelum provider siap. Belum ada perubahan Vercel dari pekerjaan ini.

Google Login tidak mengirim email konfirmasi melalui SMTP Supabase, sehingga alur ini tidak memakai kuota pengiriman email tersebut. Lupa sandi dan pendaftaran email/password tetap memerlukan layanan email; batas layanan lain tetap berlaku.

Referensi:
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://developers.google.com/identity/protocols/oauth2/policies
