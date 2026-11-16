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
npm run test:e2e     # build + Playwright desktop/ponsel, produksi dan mode uji lokal
```

Tes Playwright memakai Chrome yang sudah terpasang di Windows. Tes produksi memeriksa
halaman publik, navigasi, privasi, validasi awal, dan responsivitas. Tes mode uji lokal
memeriksa empat langkah editor, simpan/terbit/tarik proyek, pencarian tim, perkenalan,
diskusi, dan peninjauan pelamar. Data tes disimpan terpisah di `.data-playwright/`
(diabaikan Git), sehingga tidak mengubah data Supabase atau `.data/` milik pengembang.
Alur akun Supabase yang memerlukan email konfirmasi masih perlu dites dengan akun uji
tersendiri sebelum deployment.

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
│   ├── u/                   # halaman publik: profil dan detail proyek
│   └── not-found.tsx, loading.tsx
├── components/              # komponen tampilan yang dipakai ulang (termasuk icons.tsx)
│   └── editor/              # field, formulir, pratinjau, checklist, baris proyek
└── lib/
    ├── fixtures/            # DATA CONTOH (fiktif) tahap 1
    ├── content.ts           # visibilitas publik + pemilih data area pemilik
    ├── local-store.ts       # baca/tulis .data/projects.json (penyimpanan lokal sementara)
    ├── project-actions.ts   # server action: simpan, terbitkan, tarik dari publik
    ├── editor-form.ts       # model formulir editor, penguraian teks, validasi, checklist
    ├── labels.ts            # label jenis tugas
    ├── url.ts               # penyaring tautan http/https
    └── text.ts              # kalimat pertama, inisial avatar, nama depan
```

## Supabase dan akun

Salin `.env.example` menjadi `.env.local`, lalu isi URL proyek dan publishable key Supabase.
Kedua variabel tersebut juga perlu diatur pada proyek Vercel untuk lingkungan Production dan Preview.
Jangan masukkan service role key atau sandi database ke variabel `NEXT_PUBLIC_*`.

Saat kedua variabel tersedia, aplikasi memakai Supabase sebagai sumber data utama untuk akun,
profil, studi kasus proyek, pencarian tim, perkenalan, dan diskusi. Profil baru dimulai privat.
Profil dan proyek draft tidak terlihat oleh pengunjung publik. Pemilik perlu menerbitkan profil
dan minimal satu proyek sebelum memasang pencarian anggota. Pelamar wajib menyertakan tautan
bukti karya HTTPS. Pemilik dapat meninjau perkenalan serta membuka atau menutup pencarian.

Skema database tersimpan di `supabase/migrations/`. Migrasi tersebut sudah diterapkan pada proyek
Akashic yang terhubung; untuk proyek Supabase lain, jalankan berurutan setelah skema portofolio
yang ada. Atur URL dasar situs dan URL pengalihan `/auth/callback` pada pengaturan Auth Supabase
untuk domain lokal dan Vercel sebelum menguji konfirmasi email atau pemulihan sandi.

Tanpa konfigurasi Supabase, mode contoh lokal tetap tersedia untuk pengembangan saja.
Data contoh berasal dari `src/lib/fixtures/`, sedangkan perubahan editor lokal disimpan di
`.data/` dan tidak masuk Git. Mode ini tidak boleh dipakai sebagai penyimpanan produksi.

Berkas `scripts/seed/proyek-uji-penyimpanan-lokal.json` adalah contoh isi penyimpanan yang dipakai
`scripts/check-routes.ps1` untuk menguji bahwa proyek terbit muncul di halaman publik dan proyek draft
tetap 404.

Bentuk tipe di `src/lib/fixtures/types.ts` sudah diselaraskan dengan prototipe Figma Make: narasi
studi kasus disimpan sebagai bagian-bagian kecil (`problem[]`, `questions[]`, `processSteps[]`,
`contributionChecklist[]`, `designDecision`, `teammates[]`, `outcomeCards[]`) supaya skema tabel
tahap 2 bisa mengikuti bentuk yang sama. Tangkapan layar prototipe dan keputusan warna ada di
[`../docs/design/README.md`](../docs/design/README.md).
