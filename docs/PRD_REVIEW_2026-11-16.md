# Tinjauan PRD Akashic, 16 November 2026

Sumber: `C:\Users\rafia\Downloads\Dokumen Manpro.pdf` (60 halaman, diperbarui 16 November 2026). Dokumen ini adalah analisis penerapan, bukan pengganti keputusan produk dalam PRD.

## Arah produk

Akashic berpusat pada Team Finder untuk mahasiswa yang membentuk atau mencari tim kompetisi. Profil dan studi kasus Proof of Work memberi konteks kemampuan, kontribusi pribadi, dan bukti karya. Alur kritisnya adalah membuat pencarian, menemukan pencarian, mengajukan diri dengan bukti, lalu meninjau pengajuan. AI matching, manajemen proyek internal, dan sertifikasi kompetensi berada di luar cakupan saat ini.

## Penyesuaian aplikasi lokal pada tinjauan ini

| Acuan PRD | Penyesuaian |
| --- | --- |
| FR-002, CUJ-1: keahlian dan tenggat wajib; tenggat lampau ditolak | Formulir posting meminta minimal satu keahlian per peran dan tanggal hari ini atau setelahnya. Tenggat ditampilkan dengan format tanggal Indonesia. |
| FR-003: papan dan filter harus dapat dinilai | Jika belum ada posting nyata, `/tim` menampilkan tiga kartu fiktif berlabel contoh, dengan filter dan detail baca saja. Contoh tidak masuk database dan tidak menerima pengajuan. |
| FR-005, FR-012: kontak hanya dibagikan atas persetujuan | Formulir pengajuan meminta persetujuan eksplisit; server menolak pengajuan tanpa persetujuan. |
| FR-006, CUJ-3/4: status terlihat oleh pihak terkait | Dasbor pengguna menampilkan “Pengajuan Saya” dan status Diajukan, Sedang Diskusi, Diterima, atau Ditolak. |
| FR-008/009: profil minimum P0, studi kasus P1 | Akun dengan profil publik dapat memasang pencarian tim tanpa lebih dulu menerbitkan proyek. Bukti karya tetap diwajibkan bagi pelamar. |
| FR-005: pengajuan ganda | Satu akun dibatasi satu pengajuan per tim melalui pemeriksaan server dan constraint unik di database. |
| FR-007: perubahan posting | Pemilik dapat mengedit rincian posting. Peran pada posting terbit tetap terkunci karena pengajuan dapat merujuk kepadanya. |

## Kesenjangan yang masih perlu dikerjakan

1. **FR-007 (P0):** edit rincian dan pengaturan status sudah tersedia; perubahan peran pada posting terbit belum tersedia karena pengajuan yang masuk merujuk ke peran tersebut. Alur edit perlu diuji dengan akun pemilik nyata.
2. **FR-005/006 (P0):** alur dua akun di Supabase belum selesai diuji setelah akun uji kedua lupa sandi. Layanan email bawaan terkena batas kirim; pemulihan sandi dan pendaftaran pengguna umum memerlukan layanan SMTP khusus.
3. **FR-005 (P0):** database kini menolak pengajuan ganda pada tim yang sama. Uji perilaku antarmuka dengan dua akun masih diperlukan.
4. **FR-006 (P0):** status baru sudah terlihat oleh pelamar di dasbor lokal, tetapi perlu diuji dengan dua akun nyata, termasuk hak akses negatif.
5. **NFR-02/08 dan kriteria rilis:** pembatasan spam, prosedur moderasi, instrumentasi metrik, dan audit hak akses menyeluruh belum siap untuk klaim rilis publik.
6. **FR-015/016 (P1):** konfirmasi kesediaan bergabung dan pelaporan konten belum dibuat. PRD menyebut status “Bergabung” sebagai usulan, sehingga arti dan transisinya perlu diputuskan tim.

## Catatan untuk penyunting PRD

- Bagian 8.5 dan 11.3 masih menulis provider sebagai belum diputuskan. Implementasi saat ini memakai Next.js, Supabase, dan rencana hosting Vercel; PRD perlu mencatat pilihan aktual beserta status konfigurasinya.
- Rute `/tim/{slug}/apply`, `/dashboard/searches`, dan `/dashboard/applications` pada 8.6 bersifat usulan. Implementasi saat ini memakai formulir di `/tim/{slug}` dan kedua daftar di `/dashboard`.
- Target angka pada NFR serta asumsi dari enam wawancara adalah hipotesis awal, bukan hasil pengukuran penggunaan produk.

Perubahan dalam tinjauan ini masih lokal; belum dikirim ke GitHub atau Vercel.
