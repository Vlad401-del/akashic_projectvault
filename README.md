# Akashic

Akashic membantu mahasiswa mengubah tugas kuliah menjadi **studi kasus proyek** yang bisa dibaca calon perekrut, lalu menampilkannya pada satu tautan portofolio.

**Status 25 Oktober 2026:** versi untuk rilis memakai Next.js dan Supabase Cloud tanpa Docker atau WSL. Panduan menjalankan aplikasi ada di [`web/README.md`](web/README.md); langkah menuju Vercel ada di [`docs/AKASHIC_DEPLOY_CHECKLIST.md`](docs/AKASHIC_DEPLOY_CHECKLIST.md). Bagian di bawah merekam fase demo lokal sebelumnya dan tetap berguna sebagai rujukan desain.

> **Status: Tahap 1 selesai, ditambah halaman awal dan tiga layar editor yang sudah menyimpan.**
> Isi awal halaman publik masih berasal dari berkas fixture. Hasil editor disimpan ke **berkas lokal**
> `web/.data/projects.json`, bukan ke database, dan langsung muncul di halaman publik localhost.
> Belum ada autentikasi maupun unggahan gambar: siapa pun yang dapat membuka localhost juga dapat
> mengubah proyek. Aplikasi hanya berjalan di localhost dan **belum diterbitkan ke internet**.

## Struktur repositori

```
.
├── .gitattributes          # normalisasi line ending (LF) untuk kerja kelompok
├── docs/
│   ├── AKASHIC_STARTER.md  # spesifikasi dan prompt pengerjaan
│   └── design/             # tangkapan layar prototipe + implementasi dan keputusan warna
└── web/                    # aplikasi Next.js (semua perintah dijalankan dari sini)
    ├── .data/                # PENYIMPANAN LOKAL: proyek hasil editor (tidak masuk Git)
    ├── scripts/
    │   ├── check-routes.ps1  # pemeriksa status rute
    │   └── seed/             # berkas contoh untuk menguji penyimpanan lokal
    └── src/
        ├── app/            # rute halaman
        │   ├── dashboard/  # area pemilik: daftar proyek + tiga layar editor
        │   └── u/          # halaman publik
        ├── components/     # komponen tampilan yang dipakai ulang
        │   └── editor/     # komponen area editor (formulir, pratinjau, checklist)
        └── lib/
            ├── fixtures/   # DATA CONTOH beserta tipenya
            ├── content.ts  # aturan visibilitas publik + pemilih data area pemilik
            ├── local-store.ts     # baca/tulis penyimpanan lokal sementara
            ├── project-actions.ts # server action: simpan & terbitkan dari editor
            ├── editor-form.ts # model formulir editor dan validasinya
            ├── url.ts      # penyaring tautan http/https
            ├── labels.ts   # label jenis tugas
            └── text.ts
```

Dependensi aplikasi berada di `web/package.json`. Root repo tidak memiliki `package.json`.

## Menjalankan demo lokal tanpa Supabase

Prasyarat: Node.js dan npm. Demo lokal tanpa akun tidak memerlukan Docker, WSL, atau Supabase. Bila terminal masih di folder `Final Project`, masuk dahulu ke `akashic_projectvault\web`. Untuk mode Cloud, isi `web/.env.local` sesuai [`web/README.md`](web/README.md).

```powershell
cd .\akashic_projectvault\web  # jika mulai dari folder Final Project
npm ci            # atau `npm install` bila lockfile baru berubah
npm run dev       # buka http://localhost:3000
```

Jika terminal sudah berada di root repositori `akashic_projectvault`, gunakan `cd web`. Untuk mode produksi lokal, jalankan `npm run build` lalu `npm start` dari folder `web`.

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

Skrip itu memeriksa 33 kasus: status HTTP 15 rute, 12 pemeriksaan isi halaman, dan 6 pemeriksaan penyimpanan lokal. Branch sumber mencatat hasil **33 lulus, 0 gagal**; jalankan ulang di komputer ini sebelum memakai angka tersebut sebagai hasil pemeriksaan terbaru.

Pemeriksaan penyimpanan lokal bekerja dengan menyalin berkas contoh `scripts/seed/proyek-uji-penyimpanan-lokal.json` ke `web/.data/projects.json`, memeriksa bahwa proyek berstatus terbit muncul di halaman publik sedangkan yang berstatus draft membalas 404, lalu **mengembalikan isi berkas asli**. Isi proyek Anda tidak hilang, tetapi jangan menjalankan skrip ini bersamaan dengan pengeditan di peramban.

## Mencoba satu tugas dari awal sampai terbit

Ini alur yang membuktikan pertanyaan "apakah proyek yang saya isi muncul di alamat lokal":

1. Jalankan `npm run dev` dari folder `web`, lalu buka <http://localhost:3000/dashboard/projects/new>.
2. Isi bagian **Identitas proyek**, **Cerita proyek**, dan **Bukti karya**. Isian wajib ditandai
   bintang; checklist di bawah formulir menunjukkan bagian mana yang belum lengkap.
3. Tekan **Simpan draft**. Alamat akan berubah sendiri menjadi
   `/dashboard/projects/<slug-judul>/edit` dan muncul pemberitahuan "Draft tersimpan".
4. Buka <http://localhost:3000/u/nadia> — proyek itu **belum** tampil, karena masih draft.
5. Centang dua pernyataan pemilik, lalu tekan **Terbitkan**.
6. Buka tautan halaman publik di panel **Pratinjau ringkas**, atau langsung
   `http://localhost:3000/u/nadia/p/<slug-judul>`. Isi yang Anda tulis tampil sebagai studi kasus.
7. Untuk menariknya lagi, tekan **Tarik dari publik**. Halaman publiknya langsung membalas 404.

Hasilnya tersimpan di `web/.data/projects.json` (tidak masuk Git). Untuk mengosongkan seluruh hasil
editor, hapus berkas itu lalu muat ulang halaman. Menghapus berkas saat server berjalan dapat
meninggalkan halaman yang masih tersimpan di cache; jalankan ulang server bila itu terjadi.

## Rute yang tersedia

| Rute | Isi |
|---|---|
| `/` | Halaman awal: pengantar, contoh karya, penjelasan alur, dan pintu masuk ke area editor |
| `/u/[username]` | Profil publik: avatar, nama, headline, program studi, kota, bio, keterampilan, kontak opsional, daftar proyek |
| `/u/[username]/p/[slug]` | Detail proyek: header + sampul, panel konteks tugas, lalu Masalah → Proses → Kontribusi saya → Hasil → Galeri, bukti karya, dan proyek lainnya |
| `/dashboard` | Area pemilik: daftar seluruh proyek beserta status Draft/Sudah terbit dan tombol menuju editor |
| `/dashboard/projects/new` | Layar editor 1 — **Proyek baru**: formulir kosong dan checklist sebelum terbit |
| `/dashboard/projects/[slug]/edit` | Layar editor 2 dan 3 — **Draft** atau **Sudah terbit**, tergantung status proyek. Keduanya memakai formulir yang sama; pada proyek terbit tombol simpan bernama "Simpan perubahan publik" |

Alamat lokal contoh: `http://localhost:3000/u/nadia`, `http://localhost:3000/u/nadia/p/dashboard-penjualan-ritel`, dan `http://localhost:3000/dashboard`. Titik masuk editor: `http://localhost:3000/dashboard/projects/new`.

Tiga layar editor dari desain sudah dibangun: formulir dua kolom (formulir + panel pratinjau ringkas), pratinjau penuh dalam jendela sendiri, validasi judul/ringkasan/tautan, dan checklist terbit. Tombol **Simpan**, **Terbitkan**, dan **Tarik dari publik** sekarang benar-benar menulis ke penyimpanan lokal, jadi proyek yang selesai diisi punya alamat publik sendiri di `/u/nadia/p/<slug>`.

Proyek yang dibuat lewat editor ditulis sebagai satu berkas JSON di `web/.data/projects.json`. Berkas itu adalah lapisan tambahan di atas fixture: proyek dengan slug yang sama menimpa data contoh, proyek dengan slug baru ditambahkan. Isinya sengaja tidak masuk Git supaya data contoh di repo tetap bersih.

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
- **Area pemilik memakai pemilih data terpisah.** Rute `/dashboard/...` sengaja boleh membaca draft, karena pemilik harus bisa membuka draftnya sendiri; halaman publik tetap memakai penyaring yang sama seperti sebelumnya. Sampai autentikasi tersedia, akun pemilik ditetapkan di `src/lib/content.ts` (`DEMO_OWNER_USERNAME`).
- **Editor menyimpan sungguhan, tetapi ke berkas lokal.** Tombol Simpan, Terbitkan, dan Tarik dari publik mengirim satu tindakan server (`src/lib/project-actions.ts`) yang menulis ke `web/.data/projects.json`. Belum ada database maupun autentikasi, jadi siapa pun yang dapat membuka localhost juga dapat mengubah proyek, dan berkas itu tidak bisa dipakai bersama orang lain.
- **Validasi dijalankan dua kali.** Aturan yang sama dipakai di peramban dan di server (`saveProjectAction`), supaya permintaan yang dibuat langsung pun tidak bisa menyimpan judul kosong atau tautan berskema aneh.
- **Slug tidak berubah saat judul diubah.** Slug dibentuk sekali dari judul ketika proyek pertama kali disimpan, supaya alamat publik yang sudah dibagikan tidak mati. Bila judulnya sudah dipakai, ditambahkan angka di belakangnya.
- **Halaman publik hanya menampilkan proyek terbit.** Proyek hasil editor yang masih draft membalas 404 di `/u/nadia/p/<slug>`, sama seperti draft fixture.
- **Tautan bukti karya di editor divalidasi dengan aturan yang sama** seperti halaman publik: hanya `http`/`https` yang diterima, dan simpan ditolak bila alamatnya tidak valid.

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

Halaman awal dan tiga layar editor memakai sistem visual yang sama. Editor disusun dua kolom seperti
desain: formulir dibagi menjadi **Identitas proyek**, **Cerita proyek**, dan **Bukti karya**, dengan
panel **Pratinjau ringkas** yang menempel di kanan pada layar besar. Header editor memuat tautan
kembali, penanda status, tombol **Pratinjau**, tombol simpan (nama berubah menjadi "Simpan perubahan
publik" pada proyek terbit), dan tombol **Terbitkan** yang baru aktif setelah checklist dan dua
pernyataan pemilik terisi.

Diverifikasi: tidak ada scroll horizontal pada lebar 390 px dan 1440 px, grid proyek menjadi satu kolom di ponsel dan dua kolom di desktop, panel konteks pindah ke bawah sampul di ponsel, dan fokus keyboard tampil sebagai garis biru 2 px.

## Keputusan teknis yang perlu diketahui kelompok

| Keputusan | Alasan |
|---|---|
| `cacheComponents` dimatikan di `web/next.config.ts` | Dengan Partial Prerender menyala, permintaan pertama untuk username yang belum pernah dibuka membalas **200** (soft-404) dan baru permintaan berikutnya membalas 404. Aturan visibilitas Akashic butuh 404 yang tegas. Bisa dinyalakan kembali bila penanganan soft-404 sudah disepakati. |
| `generateStaticParams` pada rute publik | Rute yang wajib membalas **404 tegas** (profil privat, username tak dikenal, proyek draft, slug editor tak dikenal) tetap dibuat saat build. Akun privat dan draft ikut didaftarkan supaya 404-nya benar-benar teruji, dan proyek hasil editor didaftarkan lewat `listKnownProjectRoutes()`. |
| Rute yang selalu 200 memakai `force-dynamic` | Pada rute yang responsnya dialirkan, `notFound()` berjalan setelah status 200 terkirim, sehingga permintaan pertama membalas 200 (soft-404). Karena itu halaman awal dan `/dashboard` — yang tidak pernah 404 dan harus langsung menampilkan proyek baru — dibuat dinamis, sedangkan tiga rute publik tetap dibuat saat build dan diperbarui lewat `revalidatePath` setiap kali editor menyimpan. |
| Proyek editor disimpan ke berkas JSON, bukan database | `src/lib/local-store.ts` menulis ke `web/.data/projects.json` (di luar Git) dan `src/lib/content.ts` menggabungkannya dengan fixture. Ini menjaga alur editor berjalan hanya dengan Node.js dan Next.js. |
| Alamat editor diganti tanpa memuat ulang halaman | Setelah proyek baru disimpan, alamat berubah dari `/dashboard/projects/new` ke `/dashboard/projects/<slug>/edit` memakai `window.history.replaceState` (didukung App Router). Tanpa ini, menekan Simpan dua kali akan membuat dua proyek, dan memuat ulang akan mengembalikan formulir kosong. |
| `.gitattributes` dengan `eol=lf` | Mencegah diff palsu akibat perbedaan line ending antar anggota di Windows. |
| Bentuk fixture diselaraskan dengan prototipe Figma Make | Narasi dipisah menjadi daftar pertanyaan, langkah proses, daftar centang kontribusi, dan kartu hasil agar studi kasus mudah dibaca. |
| Pemilih data area pemilik dipisah di `src/lib/content.ts` | Area pemilik perlu membaca draft, sedangkan halaman publik tidak boleh. Keduanya dipisah supaya aturan visibilitas publik tidak ikut longgar. Saat autentikasi tersedia, bagian ini diganti kueri yang dibatasi pemilik yang sedang login. |
| Rute editor memakai `[slug]`, bukan `[id]` | Belum ada database, jadi belum ada id. Slug sudah unik di dalam satu pemilik dan stabil di fixture. Saat skema Supabase dibuat, rute bisa diganti ke id tanpa mengubah komponen formulir. |
| Narasi formulir disimpan sebagai teks berpisah sederhana | Editor memakai textarea biasa sesuai spesifikasi. Paragraf dipisah baris kosong, butir daftar satu butir per baris, dan pasangan judul/isi dipisah tanda pisah panjang. Semuanya diurai di `src/lib/editor-form.ts` sehingga bisa dipakai ulang sebagai validasi server nanti. |

## Yang belum ada

Sudah berjalan sungguhan: halaman awal, daftar proyek area pemilik, tiga layar editor (formulir
berkelompok, panel pratinjau ringkas, pratinjau penuh, validasi, checklist sebelum menerbitkan),
penyimpanan ke berkas lokal, serta munculnya proyek hasil editor di alamat publiknya.

Belum tersedia dan sengaja ditunda: database, autentikasi, penyimpanan bersama, pengaturan
profil pemilik (`/dashboard/profile`), unggah sampul/galeri, penghapusan proyek dari dalam editor,
pencarian, analitik, dan hosting. Fixture tetap menjadi lapisan dasar halaman publik, sementara hasil editor hanya tersimpan di komputer ini.

## Langkah berikutnya

Tinjau dan gabungkan PR integrasi Supabase, lalu ikuti [`checklist rilis`](docs/AKASHIC_DEPLOY_CHECKLIST.md). URL callback Supabase dan variabel Vercel baru bisa diselesaikan setelah domain deploy final diketahui. Unggah gambar asli masih di luar demo; bukti karya memakai tautan HTTPS.
