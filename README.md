# Akashic

Akashic membantu mahasiswa mengubah tugas kuliah menjadi **studi kasus proyek** yang bisa dibaca calon perekrut, lalu menampilkannya pada satu tautan portofolio.

Panduan pengerjaan lengkap ada di [`docs/AKASHIC_STARTER.md`](docs/AKASHIC_STARTER.md). Dokumen itu adalah spesifikasi; README ini mencatat **apa yang benar-benar sudah dikerjakan dan bagaimana menjalankannya**.

> **Status: Tahap 1 — fondasi dan halaman publik dari data contoh.**
> Seluruh isi yang tampil masih berasal dari berkas fixture. Belum ada database, autentikasi, unggah gambar, atau editor. Aplikasi hanya berjalan di localhost dan **belum diterbitkan ke internet**.

## Struktur repositori

```
.
├── .gitattributes          # normalisasi line ending (LF) untuk kerja kelompok
├── docs/
│   ├── AKASHIC_STARTER.md  # spesifikasi dan prompt pengerjaan
│   └── design/             # tangkapan layar prototipe + implementasi dan keputusan warna
└── web/                    # aplikasi Next.js (semua perintah dijalankan dari sini)
    ├── scripts/check-routes.ps1
    └── src/
        ├── app/            # rute halaman
        ├── components/     # komponen tampilan yang dipakai ulang
        └── lib/
            ├── fixtures/   # DATA CONTOH beserta tipenya
            ├── content.ts  # aturan visibilitas publik
            ├── url.ts      # penyaring tautan http/https
            ├── labels.ts   # label jenis tugas
            └── text.ts
```

Dependensi aplikasi berada di `web/package.json`. Root repo tidak memiliki `package.json`.

## Menjalankan di laptop

Prasyarat: Node.js LTS (dokumentasi Next.js mencantumkan minimum 20.9; diuji dengan Node 22) dan npm. Tahap ini **belum** memerlukan Docker atau Supabase.

```powershell
cd web
npm ci            # atau `npm install` bila lockfile baru berubah
npm run dev       # buka http://localhost:3000
```

Hentikan server dengan `Ctrl+C`.

### Pemeriksaan sebelum commit

```powershell
cd web
npm run lint        # ESLint
npm run typecheck   # next typegen + tsc --noEmit
npm run build       # production build
```

Untuk memeriksa perilaku rute nyata (status HTTP per halaman), jalankan produksi lalu skrip pemeriksa:

```powershell
cd web
npm run build
npm start                       # terminal pertama
powershell -File scripts\check-routes.ps1   # terminal kedua
```

Skrip itu memeriksa 10 kasus: halaman awal, tiga profil, profil privat, username tak dikenal, proyek publik, proyek draft, proyek milik profil privat, dan rute contoh dari dokumen. Hasil terakhir: **10 lulus, 0 gagal**.

## Rute yang tersedia

| Rute | Isi |
|---|---|
| `/` | Pengantar singkat + tautan ke contoh portofolio |
| `/u/[username]` | Profil publik: avatar, nama, headline, program studi, kota, bio, keterampilan, kontak opsional, daftar proyek |
| `/u/[username]/p/[slug]` | Detail proyek: header + sampul, panel konteks tugas, lalu Masalah → Proses → Kontribusi saya → Hasil → Galeri, bukti karya, dan proyek lainnya |

Alamat lokal contoh: `http://localhost:3000/u/nadia` dan `http://localhost:3000/u/nadia/p/dashboard-penjualan-ritel`.

## Akun contoh (data fiktif)

| Username | Kondisi | Perilaku yang diuji |
|---|---|---|
| `nadia` | Profil publik, 3 proyek terbit + 1 draft | Konten berubah sesuai URL; draft tidak ikut tampil |
| `darryl` | Profil publik, 2 proyek | Pengguna kedua membuktikan konten ditentukan URL |
| `rangga` | Profil publik, 0 proyek | Keadaan kosong profil |
| `sekar` | Profil privat, 1 proyek terbit | Profil privat menyembunyikan seluruh proyeknya |

Semua nama, proyek, dan tautan fiktif. Tautan memakai domain contoh `example.com` sehingga tidak menunjuk layanan sungguhan. Narasi tidak memuat metrik bisnis rekaan; bagian **Hasil** ditulis sebagai bentuk keluaran, bukan angka.

## Aturan yang sudah berlaku

- **Profil privat tidak dapat dibuka.** `/u/sekar` membalas 404, begitu pula seluruh proyeknya.
- **Draft tidak dapat dibuka lewat URL langsung.** `/u/nadia/p/analisis-sentimen-ulasan-aplikasi` membalas 404 walau slug-nya diketahui.
- **Draft tidak muncul di daftar proyek** profil publik.
- **Hanya tautan `http`/`https` yang dirender.** Skema seperti `javascript:` dan `data:` dibuang sebelum masuk DOM (`src/lib/url.ts`), dan isi tautan selalu dirender sebagai teks, bukan HTML.
- **Pesannya tidak membedakan** profil privat dan username yang tidak ada, supaya keberadaan profil privat tidak bisa ditebak dari pesan.
- **Status visibilitas selalu disertai label teks** ("Tampil pada portofolio lokal"), bukan hanya warna.

## Tampilan

Desain mengikuti **prototipe Figma Make** pemilik produk
(<https://www.figma.com/make/Yx7iEOVBGA9EYEnVgbI7Qa/HiFi-Prototype-for-Akashic>): bilah atas yang
menempel, avatar inisial, pemberitahuan prototipe, header profil dengan program studi dan kota,
kartu proyek bersampul, serta detail proyek berkolom dua dengan panel "Konteks tugas" yang menempel.

Palet tetap *prismatic minimal* seperti spesifikasi, dengan satu perubahan warna: aksen utama
sekarang **biru `#2563EB`** (bukan violet `#6D28D9`) dan spektrum dekoratif bergerak
**cyan → biru → hijau**, mengikuti permintaan pemilik produk agar warna mengikuti gradien tulisan
"dreamer" pada gambar referensi tetapi tetap berkesan prismatic. Netralnya tidak berubah: latar
`#F8F9FC`, permukaan `#FFFFFF`, teks `#182230`, teks sekunder `#526071`, garis `#DCE2EA`.

Catatan kontras: cyan dan hijau hanya muncul pada prisma merek dan garis tipis (kontras 2,3–2,6:1,
gagal untuk teks). Tautan/tombol/fokus memakai biru `#2563EB` (5,17:1) dan kata merek memakai
varian gradien yang lebih gelap (4,4–5,2:1). Rincian lengkap ada di
[`docs/design/README.md`](docs/design/README.md). Mode gelap otomatis bawaan template dilepas
karena paletnya hanya diuji pada tema terang.

Sampul dan galeri masih berupa **ilustrasi SVG netral buatan sendiri** yang diberi label "Contoh tampilan", karena unggah gambar baru dikerjakan pada tahap berikutnya. Ilustrasi ini tidak memuat angka atau metrik apa pun.

Narasi studi kasus juga dipisah menjadi bagian kecil seperti pada prototipe: pertanyaan yang
dijawab, langkah proses bernomor, daftar centang pekerjaan sendiri, keputusan desain yang diambil,
daftar pekerjaan anggota lain, lalu dua kartu hasil. Tujuannya tetap sama: bagian pribadi tidak
tercampur dengan hasil kelompok.

Tangkapan layar prototipe dan hasil implementasi tersimpan di [`docs/design/`](docs/design/README.md).

Diverifikasi: tidak ada scroll horizontal pada lebar 390 px dan 1440 px, grid proyek menjadi satu kolom di ponsel dan dua kolom di desktop, panel konteks pindah ke bawah sampul di ponsel, dan fokus keyboard tampil sebagai garis biru 2 px.

## Keputusan teknis yang perlu diketahui kelompok

| Keputusan | Alasan |
|---|---|
| `cacheComponents` dimatikan di `web/next.config.ts` | Dengan Partial Prerender menyala, permintaan pertama untuk username yang belum pernah dibuka membalas **200** (soft-404) dan baru permintaan berikutnya membalas 404. Aturan visibilitas Akashic butuh 404 yang tegas. Bisa dinyalakan kembali bila penanganan soft-404 sudah disepakati. |
| `generateStaticParams` pada rute publik | Sumber data tahap 1 adalah fixture, jadi semua rute diketahui saat build. Akun privat dan draft tetap didaftarkan agar 404-nya benar-benar teruji. |
| `.gitattributes` dengan `eol=lf` | Mencegah diff palsu akibat perbedaan line ending antar anggota di Windows. |
| Bentuk fixture diselaraskan dengan prototipe Figma Make | Narasi tidak lagi satu blok teks panjang, melainkan daftar pertanyaan, langkah proses, daftar centang kontribusi, dan kartu hasil. Skema Supabase tahap 2 sebaiknya mengikuti bentuk ini agar komponen tampilan tidak perlu diubah lagi. |

## Yang belum ada

Belum tersedia dan sengaja ditunda: Supabase (database, autentikasi, penyimpanan), halaman dashboard dan editor, unggah sampul/galeri, pratinjau pemilik, tombol terbitkan/tarik, pencarian, analitik, dan hosting. Fixture dipakai di jalur produksi halaman publik sampai tahap 2 selesai; saat itu isi `src/lib/content.ts` yang diganti menjadi kueri database dan komponen tampilan tidak perlu diubah.

## Langkah berikutnya

Tahap 2 pada dokumen spesifikasi: Supabase Auth (surel/kata sandi), migration untuk tabel `profiles`, `projects`, `project_sources`, `project_images`, serta kebijakan RLS. Memerlukan Docker Desktop dan Supabase CLI; perintah dijalankan dari folder `web`.
