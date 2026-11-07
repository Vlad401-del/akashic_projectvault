# Konteks Lengkap Akashic Saat Ini (Untuk AI & Pengembang)

> **Catatan untuk AI/Developer**: Dokumen ini adalah ringkasan arsitektur, filosofi produk, status implementasi terkini, dan panduan teknis Akashic setelah melakukan pivot ke **Team Finder berbasis Proof of Work**. Baca dokumen ini terlebih dahulu sebelum memodifikasi atau memperluas kode.

---

## 1. Latar Belakang & Filosofi Produk

### Apa itu Akashic awalnya?
Akashic awalnya dirancang sebagai **platform rekam karya mahasiswa** yang mengubah tugas kuliah menjadi **studi kasus proyek profesional**. Masalah yang diselesaikan:
- Tugas kuliah mahasiswa sering berserakan di Google Drive, GitHub lama, atau flashdisk.
- Ketika melamar magang, CV mahasiswa sering penuh klaim keahlian tanpa konteks, dan pada tugas kelompok sulit dibedakan siapa yang benar-benar bekerja vs sekadar menumpang nama.
- Akashic memandu mahasiswa menstrukturkan tugas menjadi: **Masalah → Proses → Kontribusi Pribadi (vs Kelompok) → Hasil Nyata → Tautan Bukti Karya**.

### Mengapa Pivot? (Kritik Dosen & Peluang Baru)
Saat diuji dan dipresentasikan, Akashic mendapat masukan kritis:
> *"Jika hanya portofolio dan studi kasus, apa bedanya dengan LinkedIn, Readme GitHub, atau Notion? Di mana diferensiasi nilai uniknya?"*

Dari kritik ini, ditemukan **masalah nyata yang jauh lebih mendesak di lingkungan kampus**:
1. **Friksi Pembentukan Tim Lomba / Proyek**: Ketika ada kompetisi bergengsi (GEMASTIK, PKM, Hackathon, Business Plan, Robotik), mahasiswa kesulitan mencari rekan tim yang berkomitmen dan memiliki keahlian yang sesuai.
2. **Kecanggungan Menjangkau Orang Baru**: Mahasiswa cenderung hanya mengajak teman satu sirkel atau teman dekat. Akibatnya tim sering homogen (misalnya 3 orang sama-sama desainer, tidak ada backend) atau performa tim tidak optimal. Mau menghubungi orang di luar sirkel terasa canggung karena tidak tahu rekam jejaknya.
3. **Sindrom "Free-Rider" (Penumpang Gelap)**: Banyak mahasiswa trauma ikut lomba kelompok karena rekan tim ternyata menghilang di tengah jalan atau tidak mampu mengerjakan tugasnya.

### Solusi Pivot: *Proof-of-Work Team Finder*
> **Value Proposition**: *"Cari rekan tim dari bukti kerja nyata, bukan sekadar klaim CV atau DM kosong."*

Akashic menghubungkan dua sisi:
- **Pembuat Tim (Team Lead)**: Memasang pencarian tim dengan konteks kompetisi jelas, pembagian peran spesifik (misal: "Frontend React" dan "UI Designer Figma"), estimasi komitmen waktu (jam/minggu), tenggat, dan ritme koordinasi. Yang terpenting: **profil pembuat tim terhubung ke portofolio studi kasus Akashic mereka**, sehingga calon anggota bisa memverifikasi rekam jejak leader terlebih dahulu!
- **Calon Anggota Tim (Pelamar)**: Mengajukan diri bukan dengan DM kosong seperti *"Halo kak, masih buka slot?"*, melainkan lewat **Perkenalan Terstruktur (Structured Intro)**:
  - Memilih peran spesifik yang diminati.
  - Menyatakan komitmen waktu per minggu yang sanggup dijamin (1-40 jam).
  - Menyampaikan apa yang mereka bawa (keahlian/pengalaman konkret).
  - Menyertakan tautan bukti karya nyata (studi kasus Akashic, GitHub, Figma, prototipe).
  - Menyampaikan apa yang ingin mereka pelajari.

---

## 2. Fitur yang Sudah Selesai Dikerjakan

### A. Fitur Portofolio & Studi Kasus (Pilar 1)
1. **Halaman Publik Profil (`/u/[username]`)**:
   - Menampilkan biodata mahasiswa, headline, program studi, kontak, keahlian, dan daftar kartu studi kasus proyek yang sudah terbit.
   - Akun contoh: `nadia` (3 terbit + 1 draft), `darryl` (2 terbit), `rangga` (0 proyek / empty state), `sekar` (profil privat -> 404).
2. **Detail Studi Kasus (`/u/[username]/p/[slug]`)**:
   - Pembagian narasi terstruktur: Masalah, Proses langkah demi langkah, Checklist kontribusi diri sendiri vs orang lain, Hasil keluaran (tanpa metrik bisnis rekaan), Galeri, dan Bukti karya (hanya skema `http`/`https` yang aman).
3. **Editor Proyek Pemilik (`/dashboard/projects/new` dan `.../[slug]/edit`)**:
   - Formulir terstruktur dengan validasi dobel (client & server).
   - Panel pratinjau ringkas (*sticky preview panel*) dan modal dialog pratinjau penuh.
   - Checklist syarat kelayakan terbit.

### B. Fitur Papan Cari Tim / Team Finder (Pilar 2 — Terbaru)
1. **Papan Publik Pencarian Tim (`/tim`)**:
   - Menampilkan kartu pencarian tim lomba yang sedang membuka rekrutmen.
   - Kartu menampilkan: konteks kompetisi, jumlah slot yang dibutuhkan (`openSlots`), ringkasan ide, daftar peran & keahlian yang dicari, komitmen jam/minggu, tenggat, serta kartu profil pembuat tim lengkap dengan tautan ke portofolionya.
2. **Halaman Detail Tim (`/tim/[id]`)**:
   - Informasi lengkap ide proyek, masalah yang dihadapi, rincian peran, ritme pertemuan, dan profil pencari tim.
   - **Formulir Perkenalan Terstruktur (Structured Intro)**: Pengunjung mengajukan diri dengan memilih peran, jam komitmen, penjelasan apa yang dibawa, dan tautan bukti karya.
   - Menyimpan pengajuan ke penyimpanan lokal (`web/.data/team-requests.json`) dan menampilkan konfirmasi instan.
3. **Pasang Pencarian Tim Baru (`/dashboard/tim/baru`)**:
   - Pemilik akun dapat mempublikasikan pencarian tim baru dengan menentukan peran dinamis, jam komitmen, dan tenggat.
4. **Dasbor Pemilik (`/dashboard`)**:
   - Menampilkan ringkasan status proyek (terbit vs draft).
   - Menampilkan **Pencarian Tim Saya** yang sedang aktif.
   - Menampilkan **Perkenalan Masuk (Inbox)**: Pemilik dapat melihat siapa saja yang mengajukan diri ke timnya, peran yang dipilih, komitmen waktu, serta memeriksa langsung tautan bukti karya pelamar.
5. **Navigasi Global**:
   - Tautan `Cari Tim` tersedia di bilah navigasi atas (TopBar) di seluruh halaman untuk kemudahan eksplorasi.

---

## 3. Arsitektur Teknis & Struktur Data

### Teknologi Utama
- **Framework**: Next.js 16 (App Router)
- **Library Tampilan**: React 19, Tailwind CSS v4
- **Bahasa**: TypeScript (Strict mode)
- **Kompatibilitas Runtime**: Node.js 20+

### Mekanisme Penyimpanan Sementara (Tahap Pre-Supabase)
Karena Supabase CLI dan Docker belum diintegrasikan, data disimpan ke berkas JSON lokal di direktori `web/.data/` (diabaikan oleh Git):
- `web/.data/projects.json` : Proyek yang dibuat/diedit lewat editor.
- `web/.data/teams.json` : Pencarian tim yang dibuat lewat dashboard.
- `web/.data/team-requests.json` : Pengajuan perkenalan dari pelamar tim.

Fungsi pemilih (`content.ts` dan `teams.ts`) menggabungkan data fixture dasar dengan data berkas lokal. Ketika nanti Supabase dihubungkan, hanya lapisan pembaca/penulis di `src/lib/` yang diganti dengan kueri database (PostgreSQL + RLS), sedangkan seluruh komponen antarmuka tetap utuh.

### Peta Berkas Utama

```
d:\Kuliah\Akashic\
├── docs/
│   ├── AKASHIC_SEKARANG.md       # DOKUMEN INI (Penjelasan lengkap produk terkini)
│   ├── AKASHIC_STARTER.md        # Spesifikasi awal proyek
│   └── design/                   # Keputusan visual & tangkapan layar prototipe
├── README.md                     # Panduan menjalankan repo & catatan rilis
└── web/                          # Aplikasi Next.js
    ├── .data/                    # Penyimpanan JSON lokal (tidak masuk git)
    ├── scripts/
    │   └── check-routes.ps1      # Skrip verifikasi rute & integritas fungsional
    └── src/
        ├── app/
        │   ├── page.tsx          # Beranda: pengantar portofolio + kartu cari tim
        │   ├── tim/
        │   │   ├── page.tsx      # Papan pencarian tim publik (/tim)
        │   │   └── [id]/page.tsx # Detail tim + formulir perkenalan (/tim/[id])
        │   ├── dashboard/
        │   │   ├── page.tsx      # Dasbor: daftar proyek, tim saya, perkenalan masuk
        │   │   ├── tim/baru/     # Formulir buat pencarian tim baru
        │   │   └── projects/     # Editor studi kasus proyek
        │   └── u/[username]/     # Halaman portofolio publik & detail studi kasus
        ├── components/
        │   ├── team/
        │   │   ├── team-card.tsx            # Kartu pencarian tim di papan
        │   │   ├── intro-form-component.tsx # Formulir perkenalan terstruktur
        │   │   └── team-post-form-component.tsx # Formulir pasang tim baru
        │   ├── editor/           # Komponen editor studi kasus
        │   └── site-nav.tsx      # TopBar navigasi terpadu
        └── lib/
            ├── fixtures/
            │   ├── types.ts      # Definisi model data (Project, TeamPost, TeamIntro)
            │   ├── fixtures.ts   # Data contoh profil & proyek
            │   └── teams.ts      # Data contoh pencarian tim lomba
            ├── teams.ts          # Pemilih data tim & inbox perkenalan
            ├── team-store.ts     # Baca-tulis lokal teams.json & team-requests.json
            ├── team-actions.ts   # Server action kirim intro & buat tim
            └── team-form.ts      # Validasi dan parsing formulir tim
```

---

## 4. Model Data Kunci (`src/lib/fixtures/types.ts`)

```typescript
export type TeamSearchStatus = "open" | "closed";

export type TeamRole = {
  title: string;       // Contoh: "Pengembang Web", "Desainer UI/UX"
  skills: string[];    // Contoh: ["Figma", "Wireframing"]
};

export type TeamPost = {
  id: string;              // Slug stabil untuk URL: /tim/[id]
  title: string;           // Judul tim / ide lomba
  competition: string;     // Contoh: "GEMASTIK 2027", "PKM-K"
  summary: string;         // Masalah & target tim
  ownerUsername: string;   // Pembuat tim (terhubung ke profil Akashic)
  roles: TeamRole[];       // Peran yang dibutuhkan
  currentMembers: number;  // Anggota saat ini
  targetMembers: number;   // Total anggota yang dituju
  weeklyHours: number;     // Komitmen jam per minggu
  deadline: string;        // Tenggat pendaftaran lomba
  meetingNote: string;     // Pola koordinasi & ritme pertemuan
  status: TeamSearchStatus;
};

export type TeamIntro = {
  senderName: string;   // Nama pengirim
  role: string;         // Peran yang diminati
  weeklyHours: string;  // Jam per minggu yang disanggupi
  bring: string;        // Apa yang dibawa (keahlian/pengalaman)
  learn: string;        // Apa yang ingin dipelajari
  proofUrl: string;     // Tautan bukti karya / portofolio
};
```

---

## 5. Panduan Menjalankan & Menguji

Masuk ke folder `web`:
```powershell
cd web
npm run dev
```
Buka peramban di `http://localhost:3000`.

### Rute yang Bisa Dicoba
- `http://localhost:3000/` : Halaman beranda dengan pintu masuk portofolio dan papan tim.
- `http://localhost:3000/tim` : Papan pencarian tim lomba.
- `http://localhost:3000/tim/gemastik-2027-analitik-komplain` : Detail tim GEMASTIK dan formulir pengajuan diri.
- `http://localhost:3000/dashboard` : Dasbor pemilik (melihat proyek, tim aktif, dan perkenalan masuk).
- `http://localhost:3000/dashboard/tim/baru` : Formulir membuat posting pencarian tim baru.
- `http://localhost:3000/u/nadia` : Contoh portofolio studi kasus Nadia.

### Menjalankan Pemeriksaan Kualitas
```powershell
npm run lint         # ESLint (harus 0 errors)
npm run typecheck    # TypeScript compiler check
npm run build        # Build produksi
```

---

## 6. Rencana Tahap Selanjutnya (Roadmap untuk AI Berikutnya)

Jika Anda ditugaskan melanjutkan Akashic, berikut adalah prioritas berikutnya:
1. **Status Review Perkenalan di Dasbor**:
   - Fitur bagi pemilik tim untuk menandai perkenalan: "Diterima", "Ditolak", atau "Sedang Diskusi", serta menyalin kontak pelamar.
2. **Supabase Database & Authentication**:
   - Menggantikan `.data/*.json` dengan tabel Supabase: `profiles`, `projects`, `team_posts`, `team_roles`, `team_intros`.
   - Menambahkan login email/kata sandi atau Google OAuth mahasiswa.
   - Menerapkan Row Level Security (RLS) agar hanya pemilik yang bisa melihat inbox timnya.
3. **Filter & Pencarian di Papan Tim**:
   - Filter berdasarkan jenis lomba (GEMASTIK, PKM, Hackathon, Tugas Akhir), keahlian (Figma, Python, React), dan jam komitmen.
