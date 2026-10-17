/**
 * DATA CONTOH (FIXTURE) — TAHAP 1.
 *
 * Seluruh nama, proyek, dan tautan di berkas ini adalah fiktif dan dipakai
 * hanya untuk menguji tata letak serta aturan visibilitas sebelum database
 * Supabase tersedia. Tautan memakai domain contoh `example.com` (RFC 2606)
 * sehingga tidak menunjuk layanan sungguhan. Tidak ada metrik bisnis rekaan
 * di dalam narasi; hasil ditulis sebagai bentuk keluaran, bukan angka.
 *
 * Empat akun contoh sengaja dibuat untuk menguji perilaku berbeda melalui URL:
 *
 * | Username | Kondisi                       | Perilaku yang diuji                          |
 * |----------|-------------------------------|----------------------------------------------|
 * | nadia    | Profil publik, 3 proyek + 1 draft | Konten berubah sesuai URL; draft tersembunyi |
 * | darryl   | Profil publik, 2 proyek       | Pengguna kedua membuktikan konten per URL    |
 * | rangga   | Profil publik, 0 proyek       | Empty state profil                           |
 * | sekar    | Profil privat, 1 proyek       | Profil privat menyembunyikan seluruh proyek  |
 */
import type { Profile } from "./types";

export const profiles: Profile[] = [
  {
    username: "nadia",
    displayName: "Nadia Putri",
    headline: "Mahasiswa Sistem Informasi • Analisis Data dan Desain Produk",
    bio: "Saya mahasiswa semester empat yang tertarik pada cara data mentah diubah menjadi keputusan yang bisa dipakai tim. Di perkuliahan saya banyak mengerjakan tugas kelompok, sehingga saya belajar memisahkan bagian yang saya kerjakan sendiri dari hasil kerja tim. Halaman ini merangkum tugas-tugas tersebut sebagai studi kasus singkat.",
    skills: ["SQL", "Tableau", "Pembersihan Data", "Figma", "Riset Pengguna"],
    contact: {
      label: "Surel kontak",
      url: "https://example.com/kontak/nadia-putri",
    },
    isPublished: true,
    projects: [
      {
        slug: "dashboard-penjualan-ritel",
        title: "Dashboard Penjualan Ritel",
        summary:
          "Tugas kelompok mata kuliah Visualisasi Data untuk merapikan laporan penjualan mingguan sebuah toko ritel. Saya mengerjakan pembersihan data dan menyusun halaman ringkasan penjualan per kategori.",
        category: "Visualisasi Data",
        workType: "kelompok",
        period: "Februari – Mei 2026",
        course: "Visualisasi Data",
        skills: ["SQL", "Tableau", "Pembersihan Data"],
        problem:
          "Data penjualan yang dipakai pemilik toko tersimpan dalam tiga berkas Excel terpisah dengan nama kolom yang berbeda-beda. Setiap minggu laporan disusun dengan menyalin angka secara manual, sehingga prosesnya memakan waktu dan mudah keliru ketika ada transaksi pembatalan.",
        process:
          "Kami mulai dengan mencocokkan ketiga berkas dan menyusun daftar kolom yang diperlukan. Saya menulis kueri SQL untuk menggabungkan transaksi dengan tabel produk dan pelanggan, lalu memeriksa baris ganda pada data pembatalan. Setelah data bersih, kami membuat halaman ringkasan penjualan per kategori, per kota, dan per bulan di Tableau, kemudian meminta pemilik toko mencoba membacanya sendiri.",
        contribution:
          "Di bagian ini saya mengerjakan sendiri kueri penggabungan data, logika penanda transaksi batal, dan halaman ringkasan per kategori. Saya juga menyusun catatan pembersihan supaya anggota lain memakai definisi kolom yang sama. Halaman per kota dikerjakan oleh rekan satu tim saya berdasarkan struktur yang sudah disepakati.",
        outcome:
          "Keluaran tugas adalah satu berkas Tableau dengan lima halaman, kueri SQL yang tersimpan di dalam repositori kelompok, serta catatan pembersihan data. Laporan akhir berisi penjelasan definisi setiap kolom dan batas data yang tersedia.",
        cover: {
          alt: "Contoh tampilan halaman ringkasan penjualan per kategori.",
          variant: "dashboard",
        },
        gallery: [
          { alt: "Contoh alur penggabungan data penjualan.", variant: "alur" },
          { alt: "Contoh halaman laporan tugas.", variant: "laporan" },
        ],
        sources: [
          { label: "Lihat dashboard", url: "https://example.com/demo/dashboard-penjualan-ritel" },
          { label: "Baca laporan", url: "https://example.com/demo/laporan-penjualan-ritel" },
        ],
        status: "published",
      },
      {
        slug: "nextuse-platform-berbagi-barang",
        title: "NextUse — Platform Berbagi Barang",
        summary:
          "Proyek kelompok mata kuliah Interaksi Manusia dan Komputer untuk merancang alur pinjam-meminjam barang di lingkungan kampus. Saya bertanggung jawab pada alur pengajuan pinjaman dan pengujian ke pengguna.",
        category: "Desain Produk",
        workType: "kelompok",
        period: "September – Desember 2025",
        course: "Interaksi Manusia dan Komputer",
        skills: ["Figma", "Riset Pengguna", "Prototyping"],
        problem:
          "Peminjaman barang bersama di lingkungan asrama masih dilakukan melalui grup pesan singkat, sehingga sulit mengetahui siapa sedang meminjam apa. Tidak ada catatan pengembalian dan sering terjadi salah paham mengenai kondisi barang.",
        process:
          "Kami mewawancarai lima penghuni asrama mengenai cara mereka meminjam barang, lalu menuliskan temuan dalam bentuk daftar kebutuhan. Dari daftar itu kami membuat sketsa alur, menyusun wireframe, dan mengembangkan prototipe tingkat tinggi di Figma. Dua putaran pengujian dilakukan dengan tugas yang sama agar perubahannya bisa dibandingkan.",
        contribution:
          "Saya membuat wireframe serta prototipe untuk alur pengajuan pinjaman, termasuk halaman daftar barang, formulir pengajuan, dan status pengembalian. Saya juga memandu dua sesi pengujian dan menulis temuan pada laporan kelompok. Bagian katalog pencarian dikerjakan oleh rekan tim saya.",
        outcome:
          "Hasil proyek berupa prototipe Figma yang dapat diklik, dokumen temuan pengujian, dan laporan akhir kelompok. Kami juga menyusun daftar perbaikan yang belum sempat dikerjakan agar jelas batas prototipe ini.",
        cover: {
          alt: "Contoh tampilan daftar barang pada prototipe aplikasi.",
          variant: "aplikasi",
        },
        gallery: [{ alt: "Contoh catatan temuan pengujian pengguna.", variant: "riset" }],
        sources: [
          { label: "Buka prototipe", url: "https://example.com/demo/nextuse-prototipe" },
          { label: "Baca laporan", url: "https://example.com/demo/nextuse-laporan" },
        ],
        status: "published",
      },
      {
        slug: "riset-pengalaman-pengguna-perpustakaan",
        title: "Riset Pengalaman Pengguna Perpustakaan",
        summary:
          "Tugas individu mata kuliah Metode Penelitian Sistem Informasi untuk memetakan kesulitan mahasiswa saat mencari koleksi di perpustakaan kampus. Saya mengerjakan seluruh tahap dari perencanaan sampai penulisan.",
        category: "Penelitian",
        workType: "individu",
        period: "Maret – Juni 2025",
        course: "Metode Penelitian Sistem Informasi",
        skills: ["Wawancara", "Analisis Kualitatif", "Penulisan Laporan"],
        problem:
          "Banyak mahasiswa mengaku lebih memilih mencari koleksi melalui mesin pencari daripada katalog perpustakaan. Saya perlu memahami bagian mana dari proses pencarian yang membuat mereka berhenti mencoba katalog.",
        process:
          "Saya merencanakan wawancara semi-terstruktur, menyusun panduan pertanyaan, dan mewawancarai tujuh mahasiswa dari tiga program studi. Jawaban direkam dalam catatan lapangan, lalu dikelompokkan menjadi beberapa tema berulang. Setiap tema diperiksa kembali terhadap kutipan asli sebelum masuk kesimpulan.",
        contribution:
          "Proyek ini dikerjakan sendiri, jadi seluruh bagian merupakan kontribusi pribadi: penyusunan instrumen, pelaksanaan wawancara, pengodean temuan, dan penulisan laporan. Dosen pembimbing memberi masukan pada rancangan panduan pertanyaan.",
        outcome:
          "Luaran tugas adalah laporan penelitian sekitar dua puluh halaman, matriks tema beserta kutipan pendukung, dan rekomendasi perbaikan alur pencarian. Laporan mencantumkan jumlah partisipan serta batas generalisasi temuan.",
        cover: {
          alt: "Contoh catatan lapangan hasil wawancara.",
          variant: "riset",
        },
        gallery: [
          { alt: "Contoh halaman ringkasan temuan penelitian.", variant: "laporan" },
          { alt: "Contoh bagan tema hasil analisis.", variant: "alur" },
        ],
        sources: [{ label: "Baca laporan", url: "https://example.com/demo/laporan-riset-perpustakaan" }],
        status: "published",
      },
      {
        slug: "analisis-sentimen-ulasan-aplikasi",
        title: "Analisis Sentimen Ulasan Aplikasi",
        summary:
          "Draft tugas mata kuliah Penambangan Data yang belum selesai disusun. Proyek ini sengaja dibiarkan berstatus draft untuk menguji aturan visibilitas publik.",
        category: "Penambangan Data",
        workType: "individu",
        period: "September 2026",
        course: "Penambangan Data",
        skills: ["Python", "Analisis Teks"],
        problem:
          "Ulasan pengguna aplikasi bertambah cepat dan sulit dibaca satu per satu. Saya perlu cara meringkas keluhan yang paling sering muncul.",
        process:
          "Tahap yang sudah selesai adalah pengumpulan data ulasan dan pencucian teks dasar. Pemodelan dan pelaporan masih dalam pengerjaan.",
        contribution:
          "Seluruh bagian dikerjakan sendiri karena ini tugas individu dan masih pada tahap awal.",
        outcome:
          "Belum ada keluaran akhir. Bagian ini akan diperbarui sebelum proyek diaktifkan tampil publik.",
        cover: {
          alt: "Contoh tabel data ulasan untuk latihan.",
          variant: "laporan",
        },
        gallery: [],
        sources: [],
        status: "draft",
      },
    ],
  },
  {
    username: "darryl",
    displayName: "Darryl Ramadhan",
    headline: "Mahasiswa Sistem Informasi • Pengembangan Web dan Basis Data",
    bio: "Saya mengerjakan sebagian besar tugas kuliah sebagai aplikasi web kecil dan senang membereskan bagian data yang berantakan. Fokus saya saat ini adalah perancangan skema basis data dan pembuatan API yang mudah diuji.",
    skills: ["PostgreSQL", "Node.js", "Express", "Docker", "Pengujian API"],
    contact: null,
    isPublished: true,
    projects: [
      {
        slug: "dashboard-penjualan",
        title: "Dashboard Penjualan Toko Online",
        summary:
          "Tugas individu mata kuliah Basis Data untuk mengubah catatan pesanan toko online menjadi dashboard sederhana. Saya mengerjakan skema tabel, kueri ringkasan, dan tampilan dasbornya.",
        category: "Basis Data",
        workType: "individu",
        period: "Maret – Juni 2026",
        course: "Basis Data",
        skills: ["PostgreSQL", "SQL", "Express"],
        problem:
          "Catatan pesanan toko masih berupa satu tabel besar berisi teks bebas, sehingga nama produk sering tertulis berbeda untuk barang yang sama. Pemilik toko tidak bisa melihat jumlah pesanan per produk tanpa menghitung manual.",
        process:
          "Saya mulai dengan memisahkan data menjadi tabel produk, pelanggan, dan pesanan beserta tabel rinciannya. Setelah normalisasi selesai, saya menulis kueri ringkasan untuk menghitung pesanan per produk dan per bulan. Kueri itu saya bungkus menjadi beberapa endpoint dan ditampilkan pada halaman dashboard sederhana.",
        contribution:
          "Seluruh bagian dikerjakan sendiri: perancangan skema, kueri ringkasan, endpoint API, dan halaman dashboard. Saya meminta seorang teman mencoba menambahkan satu pesanan uji untuk memastikan relasi antar tabel bekerja.",
        outcome:
          "Hasilnya adalah skrip pembuatan tabel, kueri ringkasan yang tersimpan di repositori, dan dashboard dengan tiga halaman: daftar pesanan, ringkasan per produk, dan ringkasan bulanan.",
        cover: {
          alt: "Contoh tampilan daftar pesanan pada dashboard.",
          variant: "dashboard",
        },
        gallery: [
          { alt: "Contoh skema tabel basis data pesanan.", variant: "alur" },
          { alt: "Contoh halaman ringkasan bulanan.", variant: "dashboard" },
        ],
        sources: [
          { label: "Lihat dashboard", url: "https://example.com/demo/dashboard-penjualan" },
          { label: "Lihat repositori", url: "https://example.com/demo/repositori-dashboard-penjualan" },
        ],
        status: "published",
      },
      {
        slug: "api-pemesanan-lapangan-futsal",
        title: "API Pemesanan Lapangan Futsal",
        summary:
          "Tugas kelompok mata kuliah Pemrograman Web Lanjut untuk membuat layanan pemesanan jadwal lapangan. Saya menangani bagian endpoint jadwal dan penanganan jadwal yang bertabrakan.",
        category: "Pengembangan Web",
        workType: "kelompok",
        period: "Februari – Mei 2026",
        course: "Pemrograman Web Lanjut",
        skills: ["Node.js", "Express", "Pengujian API", "Docker"],
        problem:
          "Pemesanan lapangan dilakukan lewat percakapan pesan sehingga dua orang bisa merasa sudah memesan jadwal yang sama. Pengelola lapangan juga tidak punya catatan pemesanan yang rapi.",
        process:
          "Kami menyepakati kontrak endpoint lebih dahulu, lalu membagi pekerjaan per modul. Saya menyiapkan endpoint jadwal, aturan penolakan jadwal yang bertabrakan, dan berkas pengujian untuk kedua kasus tersebut. Pekerjaan dijalankan dengan Docker agar lingkungan kami sama.",
        contribution:
          "Kontribusi pribadi saya adalah endpoint pencarian jadwal kosong, aturan penolakan pesanan yang bertabrakan waktu, serta pengujian otomatis untuk keduanya. Modul autentikasi dan halaman pengelola dikerjakan dua rekan tim saya.",
        outcome:
          "Keluaran tugas berupa layanan API dengan dokumentasi singkat, satu set pengujian yang bisa dijalankan, dan berkas Docker Compose kelompok. Laporan akhir menjelaskan kontrak endpoint serta batas yang belum dikerjakan, yaitu pembayaran daring.",
        cover: {
          alt: "Contoh struktur endpoint layanan pemesanan.",
          variant: "alur",
        },
        gallery: [{ alt: "Contoh dokumen kontrak endpoint.", variant: "laporan" }],
        sources: [
          { label: "Lihat repositori", url: "https://example.com/demo/repositori-api-futsal" },
          { label: "Baca dokumentasi API", url: "https://example.com/demo/dokumentasi-api-futsal" },
        ],
        status: "published",
      },
    ],
  },
  {
    username: "rangga",
    displayName: "Rangga Mahendra",
    headline: "Mahasiswa Teknologi Informasi • Jaringan dan Infrastruktur",
    bio: "Saya lebih banyak mengerjakan praktikum jaringan dan baru mulai menyusun portofolio. Halaman ini sengaja dibiarkan kosong untuk menguji keadaan tanpa proyek.",
    skills: ["Jaringan Komputer", "Linux", "Cisco Packet Tracer"],
    contact: null,
    isPublished: true,
    projects: [],
  },
  {
    username: "sekar",
    displayName: "Sekar Anindita",
    headline: "Mahasiswa Sistem Informasi • Analisis Proses Bisnis",
    bio: "Profil contoh yang berstatus privat. Profil ini dipakai untuk memastikan pengunjung anonim tidak dapat membuka profil maupun proyeknya.",
    skills: ["Pemodelan Proses Bisnis", "BPMN", "Wawancara Proses"],
    contact: null,
    isPublished: false,
    projects: [
      {
        slug: "aplikasi-kasir-umkm",
        title: "Aplikasi Kasir untuk UMKM",
        summary:
          "Proyek contoh yang sudah berstatus published, tetapi pemiliknya menarik profil dari tampilan publik. Proyek ini tidak boleh dapat diakses pengunjung anonim.",
        category: "Sistem Informasi",
        workType: "kelompok",
        period: "September – Desember 2026",
        course: "Analisis dan Perancangan Sistem",
        skills: ["BPMN", "Wawancara Proses"],
        problem: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        process: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        contribution: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        outcome: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        cover: { alt: "Contoh tampilan aplikasi kasir.", variant: "aplikasi" },
        gallery: [],
        sources: [{ label: "Lihat repositori", url: "https://example.com/demo/repositori-kasir-umkm" }],
        status: "published",
      },
    ],
  },
];
