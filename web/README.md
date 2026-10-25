# Akashic — aplikasi web

Aplikasi Next.js untuk Akashic. Dokumentasi proyek (spesifikasi, akun contoh, dan catatan keputusan) ada di README root repositori: [`../README.md`](../README.md).

## Perintah

Semua perintah dijalankan dari folder ini (`web/`).

```powershell
npm ci              # pasang dependensi sesuai package-lock.json
npm run dev         # server pengembangan di http://localhost:3000
npm run build       # production build
npm start           # jalankan hasil build
npm run lint        # ESLint
npm run typecheck   # next typegen + tsc --noEmit
```

Pemeriksaan perilaku rute (status HTTP) dijalankan terhadap hasil build:

```powershell
npm run build
npm start
powershell -File scripts\check-routes.ps1
```

## Susunan berkas

```
src/
├── app/                     # rute App Router
│   ├── dashboard/           # area pemilik: daftar proyek, editor baru, editor [slug]
│   ├── (auth)/              # masuk, daftar, dan pemulihan kata sandi
│   ├── u/                   # halaman publik: profil dan detail proyek
│   └── not-found.tsx
├── components/              # komponen tampilan yang dipakai ulang (termasuk icons.tsx)
│   └── editor/              # field, formulir, pratinjau, checklist, baris proyek
└── lib/
    ├── fixtures/            # DATA CONTOH (fiktif) tahap 1
    ├── content.ts           # data contoh dan editor demo lokal
    ├── supabase/            # klien sesi, tipe database, pemetaan dan query Cloud
    ├── local-store.ts       # penyimpanan demo tanpa konfigurasi Cloud
    ├── project-actions.ts   # simpan, terbitkan, tarik dari publik
    ├── editor-form.ts       # model formulir editor, penguraian teks, validasi, checklist
    ├── labels.ts            # label jenis tugas
    ├── url.ts               # penyaring tautan http/https
    └── text.ts              # kalimat pertama, inisial avatar, nama depan
```

Dengan dua variabel Supabase di `.env.local`, akun, profil, proyek, dan tautan bukti memakai Supabase
Cloud. Tanpa variabel itu, `npm run dev` tetap membuka editor demo lokal yang menyimpan ke
`.data/projects.json`; build produksi tanpa konfigurasi Cloud menutup editor. Data contoh tetap
terpisah dan diberi label fiktif pada halaman publik.

Editor memvalidasi isian di peramban dan di server. Di mode Cloud, sesi pengguna diperiksa lagi pada
setiap penyimpanan dan RLS membatasi proyek pada pemiliknya. Profil baru privat dan proyek baru draft.
Proyek terbit hanya terlihat publik bila profilnya juga diterbitkan. Gambar masih ilustrasi contoh;
unggah berkas ke Supabase Storage belum tersedia.

Berkas `scripts/seed/proyek-uji-penyimpanan-lokal.json` adalah contoh isi penyimpanan yang dipakai
`scripts/check-routes.ps1` untuk menguji bahwa proyek terbit muncul di halaman publik dan proyek draft
tetap 404.

## Persiapan Supabase Cloud dan Vercel

Rencana bertahap ada di [`../docs/AKASHIC_CLOUD_PHASES.md`](../docs/AKASHIC_CLOUD_PHASES.md),
dan langkah rilis besok ada di [`../docs/AKASHIC_DEPLOY_CHECKLIST.md`](../docs/AKASHIC_DEPLOY_CHECKLIST.md).
Migration dalam `supabase/migrations/` sudah diterapkan pada proyek Cloud
`vrncyponqsuhqzldwrvw`. Salin `.env.example` menjadi `.env.local`, lalu isi URL dan **publishable
key** proyek. `.env.local` diabaikan Git; jangan memakai secret atau service-role key di variabel
`NEXT_PUBLIC_*`.

Bentuk tipe di `src/lib/fixtures/types.ts` sudah diselaraskan dengan prototipe Figma Make: narasi
studi kasus disimpan sebagai bagian-bagian kecil (`problem[]`, `questions[]`, `processSteps[]`,
`contributionChecklist[]`, `designDecision`, `teammates[]`, `outcomeCards[]`) agar tampilan studi kasus
tetap mengikuti desain. Tangkapan layar prototipe dan keputusan warna ada di
[`../docs/design/README.md`](../docs/design/README.md).

## Batas versi saat ini

`npm start` memerlukan `npm run build` lebih dahulu. Di laptop, kedua perintah dibatasi ke
`127.0.0.1`. Alur akun dan penyimpanan Cloud sudah ditulis, tetapi pendaftaran melalui email dan
akses dua akun belum diuji langsung. Supabase Auth masih perlu URL callback yang sesuai domain
Vercel; untuk email di luar anggota organisasi, Supabase memerlukan SMTP khusus. Lihat checklist
rilis sebelum membuka pendaftaran umum.
