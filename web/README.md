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
│   ├── u/                   # halaman publik: profil dan detail proyek
│   └── not-found.tsx, loading.tsx
├── components/              # komponen tampilan yang dipakai ulang (termasuk icons.tsx)
│   └── editor/              # field, formulir, pratinjau, checklist, baris proyek
└── lib/
    ├── fixtures/            # DATA CONTOH (fiktif) tahap 1
    ├── content.ts           # visibilitas publik + pemilih data area pemilik
    ├── editor-form.ts       # model formulir editor, penguraian teks, validasi, checklist
    ├── labels.ts            # label jenis tugas
    ├── url.ts               # penyaring tautan http/https
    └── text.ts              # kalimat pertama, inisial avatar, nama depan
```

Sumber data masih berupa fixture di `src/lib/fixtures/`. Penggantinya adalah Supabase pada tahap berikutnya; berkas `src/lib/content.ts` adalah satu-satunya tempat yang perlu diubah menjadi kueri database.

Editor area pemilik belum menyimpan apa pun. Seluruh state formulir hidup di peramban
(`src/components/editor/project-editor.tsx`) dan sengaja tidak memakai `localStorage`, sesuai aturan
spesifikasi bahwa data nyata nanti berasal dari database. `src/lib/editor-form.ts` berisi fungsi murni
(penguraian teks, validasi, checklist) supaya aturan yang sama bisa dipakai lagi sebagai validasi
server pada tahap 3.

Bentuk tipe di `src/lib/fixtures/types.ts` sudah diselaraskan dengan prototipe Figma Make: narasi
studi kasus disimpan sebagai bagian-bagian kecil (`problem[]`, `questions[]`, `processSteps[]`,
`contributionChecklist[]`, `designDecision`, `teammates[]`, `outcomeCards[]`) supaya skema tabel
tahap 2 bisa mengikuti bentuk yang sama. Tangkapan layar prototipe dan keputusan warna ada di
[`../docs/design/README.md`](../docs/design/README.md).
