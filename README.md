# Akashic

> Wadah **Proof of Work** untuk mahasiswa: ubah tugas kuliah menjadi studi kasus proyek yang bisa dibaca calon rekruter, sekaligus tempat mencari rekan tim lomba berdasarkan bukti kerja nyata.

## Tentang Akashic

Di kampus, mahasiswa sulit menemukan rekan tim yang kredibel untuk lomba seperti GEMASTIK, PKM, dan hackathon. Ajakan sering hanya berputar di lingkaran pertemanan karena canggung menghubungi orang baru tanpa tahu rekam jejaknya, sementara beban kerja kelompok kerap ditanggung segelintir orang.

Akashic menjawabnya dengan satu prinsip: **cari rekan tim dari bukti kerja nyata, bukan sekadar klaim CV atau pesan singkat.** Setiap mahasiswa punya satu tautan portofolio yang menunjukkan apa yang benar-benar ia kerjakan — masalah yang dihadapi, proses, kontribusi pribadi yang dipisah dari hasil kelompok, dan keluarannya. Dari portofolio itu, mahasiswa dapat memasang pencarian rekan tim dan meninjau pelamar secara terstruktur.

## Fitur

### Portofolio Proof of Work

- **Profil publik** pada satu tautan (`/u/<username>`): avatar, nama, headline, program studi, kota, bio, keterampilan, dan kontak opsional.
- **Detail proyek sebagai studi kasus** dengan alur baku **Masalah → Proses → Kontribusi saya → Hasil → Bukti karya → Galeri**, sehingga bagian pribadi tidak tercampur dengan hasil kerja kelompok.
- **Sampul proyek** dapat memakai gambar asli (tautan atau berkas di dalam situs) dengan ilustrasi cadangan bila gambar dikosongkan.
- **Editor proyek** dengan formulir berkelompok, panel pratinjau ringkas, pratinjau penuh, validasi judul/ringkasan/tautan, dan checklist sebelum menerbitkan.
- **Status draft dan terbit**: proyek dapat disimpan sebagai draft, diterbitkan ke halaman publik, lalu ditarik kembali kapan saja.
- **Aturan visibilitas yang tegas**: profil privat, proyek draft, dan alamat yang tidak ada benar-benar dibalas *tidak ditemukan*.

### Pencarian Rekan Tim (Team Finder)

- **Papan cari tim publik** (`/tim`) berisi kartu pencarian tim lomba yang sedang terbuka, lengkap dengan peran yang dicari, komitmen waktu per minggu, tenggat, dan tautan ke portofolio pembuatnya.
- **Filter dan pencarian**: kata kunci, jenis lomba, keahlian yang dicari, serta batas jam komitmen.
- **Detail tim dan pengajuan diri terstruktur** (*structured intro*): pelamar memilih peran, menyatakan komitmen jam, menjelaskan yang ia bawa, dan melampirkan tautan bukti karya serta kontak.
- **Pasang pencarian tim baru** dari area pemilik (`/dashboard/tim/baru`).

### Area Pemilik & Akun

- **Dasbor pemilik** (`/dashboard`): daftar seluruh proyek beserta statusnya, pencarian tim yang sedang aktif, dan kotak masuk perkenalan pelamar.
- **Tinjau perkenalan**: tandai "Sedang Diskusi", "Diterima", atau "Ditolak", dan salin kontak pelamar.
- **Daftar dan masuk akun** untuk melindungi ruang karya.

## Menjalankan proyek

Prasyarat: Node.js LTS dan npm.

```powershell
cd web
npm install
npm run dev
```

Buka `http://localhost:3000`. Contoh halaman: papan cari tim `http://localhost:3000/tim`, dasbor pemilik `http://localhost:3000/dashboard`, contoh portofolio `http://localhost:3000/u/nadia`.

Perintah lain yang tersedia:

```powershell
npm run lint        # ESLint
npm run typecheck   # next typegen + tsc --noEmit
npm run build       # production build
```

## Teknologi

Next.js (App Router) · React · TypeScript · Tailwind CSS.
