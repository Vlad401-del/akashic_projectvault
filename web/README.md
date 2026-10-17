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
├── app/                     # rute App Router (halaman publik + not-found + loading)
├── components/              # komponen tampilan yang dipakai ulang
└── lib/
    ├── fixtures/            # DATA CONTOH (fiktif) tahap 1
    ├── content.ts           # aturan visibilitas profil/proyek publik
    ├── url.ts               # penyaring tautan http/https
    └── text.ts
```

Sumber data masih berupa fixture di `src/lib/fixtures/`. Penggantinya adalah Supabase pada tahap berikutnya; berkas `src/lib/content.ts` adalah satu-satunya tempat yang perlu diubah menjadi kueri database.
