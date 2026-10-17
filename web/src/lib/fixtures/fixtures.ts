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
 * | Username | Kondisi                        | Perilaku yang diuji                          |
 * |----------|--------------------------------|----------------------------------------------|
 * | nadia    | Profil publik, 3 proyek + 1 draft | Konten berubah sesuai URL; draft tersembunyi |
 * | darryl   | Profil publik, 2 proyek        | Pengguna kedua membuktikan konten per URL    |
 * | rangga   | Profil publik, 0 proyek        | Empty state profil                           |
 * | sekar    | Profil privat, 1 proyek        | Profil privat menyembunyikan seluruh proyek  |
 */
import type { Profile } from "./types";

export const profiles: Profile[] = [
  {
    username: "nadia",
    displayName: "Nadia Putri",
    headline: "Mahasiswa Sistem Informasi • Analisis Data dan Desain Produk",
    program: "Sistem Informasi, Universitas Nusantara",
    city: "Bandung",
    bio: "Saya mahasiswa semester empat yang tertarik pada cara data mentah diubah menjadi keputusan yang bisa dipakai tim. Di perkuliahan saya banyak mengerjakan tugas kelompok, sehingga saya belajar memisahkan bagian yang saya kerjakan sendiri dari hasil kerja tim. Halaman ini merangkum tugas-tugas tersebut sebagai studi kasus singkat.",
    skills: ["Analisis data", "SQL", "Visualisasi data", "Tableau", "Riset pengguna", "Figma", "Prototipe"],
    contacts: [
      { kind: "email", label: "Email", url: "https://example.com/kontak/nadia-putri" },
      { kind: "linkedin", label: "LinkedIn", url: "https://example.com/profil/nadia-putri" },
      { kind: "cv", label: "Unduh CV", url: "https://example.com/berkas/cv-nadia-putri" },
    ],
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
        role: "Analisis data dan desain dasbor",
        teamSize: 4,
        skills: ["Pembersihan data", "Visualisasi data", "Tableau Public"],
        tools: ["Google Sheets", "Tableau Public", "Figma"],
        problem: [
          "Data penjualan yang dipakai pemilik toko tersimpan dalam tiga berkas Excel terpisah dengan nama kolom yang berbeda-beda. Setiap minggu laporan disusun dengan menyalin angka secara manual, sehingga prosesnya memakan waktu dan mudah keliru ketika ada transaksi pembatalan.",
          "Kami tidak diminta membuat sistem baru, hanya membuat laporan yang bisa dibaca sendiri oleh pemilik toko tanpa perlu bertanya ke tim.",
        ],
        questions: [
          "Bagaimana tren penjualan dari bulan ke bulan?",
          "Cabang mana yang perlu diperhatikan?",
          "Kategori produk apa yang paling berkontribusi?",
        ],
        processIntro:
          "Kami mulai dengan mencocokkan ketiga berkas dan menyusun daftar kolom yang diperlukan. Urutan langkah di bawah ini yang akhirnya kami sepakati bersama.",
        processSteps: [
          {
            title: "Memetakan pertanyaan pemilik toko",
            body: "Kami menuliskan pertanyaan yang paling sering muncul saat pemilik toko membuka laporan mingguan, lalu memakai daftar itu sebagai urutan halaman dasbor.",
          },
          {
            title: "Menggabungkan data dengan kueri",
            body: "Saya menulis kueri SQL untuk menggabungkan transaksi dengan tabel produk dan pelanggan, kemudian memeriksa baris ganda yang muncul dari data pembatalan.",
          },
          {
            title: "Menetapkan definisi kolom",
            body: "Kami menulis satu halaman catatan definisi kolom agar anggota tim memakai arti yang sama untuk transaksi batal, diskon, dan tanggal tutup buku.",
          },
          {
            title: "Menyusun dan menguji halaman dasbor",
            body: "Halaman ringkasan per kategori, per kota, dan per bulan kami buat di Tableau, lalu pemilik toko diminta membacanya sendiri sambil kami catat bagian yang membingungkan.",
          },
        ],
        processNote:
          "Aturan yang saya pakai saat membersihkan data: transaksi batal ditandai pada kolom terpisah, bukan dihapus, supaya jumlah baris asli tetap bisa ditelusuri.",
        contributionIntro:
          "Bagian ini hanya pekerjaan yang saya kerjakan sendiri, terpisah dari hasil kelompok.",
        contributionChecklist: [
          "Menulis kueri penggabungan transaksi dengan tabel produk dan pelanggan.",
          "Menandai transaksi batal dan memeriksa baris ganda.",
          "Menyusun halaman ringkasan penjualan per kategori.",
          "Menulis catatan pembersihan data yang dipakai seluruh anggota tim.",
        ],
        designDecision:
          "Halaman pertama saya isi dengan ringkasan per kategori, bukan grafik tren bulanan. Alasannya, pertanyaan pemilik toko saat membuka laporan adalah kategori mana yang perlu ditambah stok, sedangkan tren bulanan lebih cocok dibaca setelah itu.",
        teammates: [
          { name: "Raka Aditya", task: "Halaman perbandingan cabang" },
          { name: "Salasbila Huda", task: "Halaman penjualan per kota" },
          { name: "Dinas Prakoso", task: "Pengumpulan berkas penjualan mentah" },
        ],
        outcomeIntro:
          "Keluaran tugas adalah satu berkas Tableau dengan lima halaman, kueri SQL yang tersimpan di dalam repositori kelompok, serta catatan pembersihan data.",
        outcomeNote:
          "Laporan akhir memuat definisi setiap kolom dan batas data yang tersedia, supaya hasilnya bisa diperiksa ulang oleh dosen maupun anggota tim.",
        outcomeCards: [
          {
            title: "Yang saya pikirkan",
            body: "Saya menaruh catatan definisi kolom di halaman terakhir, bukan menyembunyikannya, karena pembaca perlu tahu bahwa angka bulan berjalan belum lengkap.",
          },
          {
            title: "Keterbatasan",
            body: "Data hanya mencakup tiga cabang dan tidak memuat informasi stok, sehingga dasbor ini belum bisa dipakai untuk memutuskan jumlah barang yang dipesan.",
          },
        ],
        cover: {
          alt: "Contoh tampilan halaman ringkasan penjualan per kategori.",
          variant: "dashboard",
          caption: "Halaman Ringkasan. Tampilan contoh dasbor; angka pada gambar bukan data sungguhan.",
        },
        gallery: [
          {
            alt: "Contoh sketsa alur penggabungan data penjualan.",
            variant: "alur",
            caption: "Sketsa awal. Alur penggabungan data yang kami sepakati sebelum menulis kueri.",
          },
          {
            alt: "Contoh halaman laporan tugas.",
            variant: "laporan",
            caption: "Laporan akhir. Rekap definisi kolom dan batas data yang tersedia.",
          },
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
        role: "Perancang alur pengajuan pinjaman",
        teamSize: 4,
        skills: ["Riset pengguna", "Figma", "Prototipe"],
        tools: ["Figma", "Google Forms"],
        problem: [
          "Peminjaman barang bersama di lingkungan asrama masih dilakukan melalui grup pesan singkat, sehingga sulit mengetahui siapa sedang meminjam apa. Tidak ada catatan pengembalian dan sering terjadi salah paham mengenai kondisi barang.",
          "Kami membatasi diri pada alur pengajuan dan pengembalian, karena dua bagian itulah yang paling sering menimbulkan perselisihan.",
        ],
        questions: [
          "Bagaimana penghuni asrama mencatat barang yang dipinjam saat ini?",
          "Bagian mana dari alur pinjam yang paling sering menimbulkan salah paham?",
          "Informasi apa yang perlu terlihat sebelum menyetujui peminjaman?",
        ],
        processIntro:
          "Kami mewawancarai lima penghuni asrama, lalu menyusun alur berdasarkan kebiasaan yang paling sering muncul.",
        processSteps: [
          {
            title: "Mewawancarai penghuni asrama",
            body: "Lima wawancara singkat dilakukan di tempat tinggal masing-masing, dengan fokus pada cara mereka meminjam dan mengembalikan barang bulan lalu.",
          },
          {
            title: "Menuliskan daftar kebutuhan",
            body: "Hasil wawancara dikelompokkan menjadi kebutuhan yang berulang, misalnya catatan kondisi barang dan tenggat pengembalian yang terlihat jelas.",
          },
          {
            title: "Menyusun wireframe alur pengajuan",
            body: "Saya membuat wireframe halaman daftar barang, formulir pengajuan, dan status pengembalian, lalu meminta satu rekan menguji alurnya sebelum masuk ke prototipe.",
          },
          {
            title: "Dua putaran pengujian",
            body: "Prototipe diuji dengan tugas yang sama pada putaran pertama dan kedua agar perubahannya bisa dibandingkan langsung.",
          },
        ],
        processNote:
          "Catatan pengujian ditulis apa adanya, termasuk bagian yang tetap gagal dipahami peserta pada putaran kedua.",
        contributionIntro: "Bagian ini hanya pekerjaan yang saya kerjakan sendiri di dalam kelompok.",
        contributionChecklist: [
          "Membuat wireframe alur pengajuan pinjaman.",
          "Menyusun prototipe halaman daftar barang, formulir, dan status pengembalian.",
          "Memandu dua sesi pengujian dan mencatat temuannya.",
          "Menulis bagian temuan pengujian pada laporan kelompok.",
        ],
        designDecision:
          "Saya memilih menampilkan status barang sebelum formulir diisi. Peserta pengujian dua kali bertanya soal siapa yang sedang meminjam, jadi informasi itu saya pindahkan ke halaman pertama alur.",
        teammates: [
          { name: "Bintang Arya", task: "Katalog dan pencarian barang" },
          { name: "Hana Ramadhani", task: "Profil pengguna dan riwayat pinjam" },
          { name: "Yusuf Fadillah", task: "Penyusunan laporan akhir" },
        ],
        outcomeIntro:
          "Hasil proyek berupa prototipe Figma yang dapat diklik, dokumen temuan pengujian, dan laporan akhir kelompok.",
        outcomeNote:
          "Kami juga menyusun daftar perbaikan yang belum sempat dikerjakan, supaya batas prototipe ini jelas bagi pembaca.",
        outcomeCards: [
          {
            title: "Yang saya pikirkan",
            body: "Saya mempertahankan penamaan tombol yang sama di seluruh alur, karena peserta pengujian sempat bingung antara kata setujui dan terima.",
          },
          {
            title: "Keterbatasan",
            body: "Prototipe belum menyentuh proses pengembalian barang yang rusak dan belum diuji pada pengguna di luar asrama tempat kami mewawancarai.",
          },
        ],
        cover: {
          alt: "Contoh tampilan daftar barang pada prototipe aplikasi.",
          variant: "aplikasi",
          caption: "Halaman daftar barang. Tampilan contoh prototipe low-fidelity.",
        },
        gallery: [
          {
            alt: "Contoh catatan temuan pengujian pengguna.",
            variant: "riset",
            caption: "Catatan pengujian. Temuan putaran pertama dan kedua ditulis berdampingan.",
          },
        ],
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
        role: "Seluruh tahap penelitian",
        teamSize: null,
        skills: ["Wawancara", "Analisis kualitatif", "Penulisan laporan"],
        tools: ["Google Docs", "Spreadsheet"],
        problem: [
          "Banyak mahasiswa mengaku lebih memilih mencari koleksi melalui mesin pencari daripada katalog perpustakaan. Saya perlu memahami bagian mana dari proses pencarian yang membuat mereka berhenti mencoba katalog.",
          "Karena tugas ini dikerjakan sendiri, saya membatasi jumlah partisipan supaya wawancara tetap bisa didalami dalam waktu satu semester.",
        ],
        questions: [
          "Pada tahap apa mahasiswa berhenti menggunakan katalog?",
          "Informasi apa yang mereka cari lebih dulu saat datang ke perpustakaan?",
          "Kesulitan mana yang paling sering disebut berulang?",
        ],
        processIntro:
          "Rancangan penelitian disusun lebih dahulu, lalu wawancara dijalankan dengan panduan yang sama untuk semua partisipan.",
        processSteps: [
          {
            title: "Menyusun panduan wawancara",
            body: "Panduan berisi pertanyaan terbuka tentang kebiasaan terakhir mencari koleksi, lalu diperiksa dosen pembimbing sebelum dipakai.",
          },
          {
            title: "Wawancara semi-terstruktur",
            body: "Tujuh mahasiswa dari tiga program studi diwawancarai, masing-masing sekitar tiga puluh menit dengan catatan lapangan.",
          },
          {
            title: "Mengelompokkan tema",
            body: "Catatan lapangan dikelompokkan menjadi beberapa tema berulang, lalu setiap tema diperiksa kembali terhadap kutipan aslinya.",
          },
          {
            title: "Menulis laporan",
            body: "Laporan disusun dengan menampilkan kutipan pendukung di samping setiap tema, agar pembaca bisa menilai sendiri dasar kesimpulannya.",
          },
        ],
        processNote:
          "Kutipan yang tidak mewakili tema mana pun tetap saya simpan di lampiran, bukan dibuang, supaya temuan yang berlawanan tetap tercatat.",
        contributionIntro:
          "Tugas ini dikerjakan sendiri, sehingga seluruh bagian merupakan kontribusi pribadi.",
        contributionChecklist: [
          "Menyusun instrumen dan panduan pertanyaan wawancara.",
          "Menjalankan tujuh wawancara beserta catatan lapangan.",
          "Mengodekan temuan dan memeriksanya terhadap kutipan asli.",
          "Menulis laporan penelitian dan rekomendasi perbaikan alur pencarian.",
        ],
        designDecision:
          "Saya memilih menampilkan kutipan asli di samping setiap tema daripada hanya menulis kesimpulan. Cara ini membuat pembaca bisa menilai apakah pengelompokannya masuk akal.",
        teammates: [],
        outcomeIntro:
          "Luaran tugas adalah laporan penelitian sekitar dua puluh halaman, matriks tema beserta kutipan pendukung, dan rekomendasi perbaikan alur pencarian.",
        outcomeNote:
          "Laporan mencantumkan jumlah partisipan serta batas generalisasi temuannya.",
        outcomeCards: [
          {
            title: "Yang saya pikirkan",
            body: "Saya menahan diri untuk tidak menyarankan desain ulang katalog, karena data yang saya punya hanya menjelaskan kesulitan pencarian oleh tujuh partisipan.",
          },
          {
            title: "Keterbatasan",
            body: "Partisipan berasal dari satu kampus dan sebagian besar satu fakultas, sehingga temuan ini belum tentu berlaku di perpustakaan lain.",
          },
        ],
        cover: {
          alt: "Contoh catatan lapangan hasil wawancara.",
          variant: "riset",
          caption: "Catatan lapangan. Tampilan contoh; isi kutipan pada gambar bukan data sungguhan.",
        },
        gallery: [
          {
            alt: "Contoh halaman ringkasan temuan penelitian.",
            variant: "laporan",
            caption: "Ringkasan temuan. Satu halaman berisi tema utama beserta kutipan pendukungnya.",
          },
          {
            alt: "Contoh bagan tema hasil analisis.",
            variant: "alur",
            caption: "Bagan tema. Hubungan antar tema yang dipakai untuk menyusun kesimpulan.",
          },
        ],
        sources: [
          { label: "Baca laporan", url: "https://example.com/demo/laporan-riset-perpustakaan" },
        ],
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
        role: "Seluruh bagian",
        teamSize: null,
        skills: ["Python", "Analisis teks"],
        tools: ["Python", "Jupyter Notebook"],
        problem: ["Ulasan pengguna aplikasi bertambah cepat dan sulit dibaca satu per satu."],
        questions: ["Keluhan apa yang paling sering muncul pada ulasan pengguna?"],
        processIntro: "Tahap yang sudah selesai adalah pengumpulan data ulasan dan pencucian teks dasar.",
        processSteps: [
          {
            title: "Mengumpulkan ulasan",
            body: "Contoh isi untuk menguji aturan visibilitas proyek draft.",
          },
        ],
        processNote: null,
        contributionIntro:
          "Seluruh bagian dikerjakan sendiri karena ini tugas individu dan masih pada tahap awal.",
        contributionChecklist: ["Pencucian teks dasar pada contoh data ulasan."],
        designDecision: null,
        teammates: [],
        outcomeIntro: "Belum ada keluaran akhir.",
        outcomeNote: "Bagian ini akan diperbarui sebelum proyek diaktifkan tampil publik.",
        outcomeCards: [],
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
    program: "Sistem Informasi, Universitas Nusantara",
    city: "Malang",
    bio: "Saya mengerjakan sebagian besar tugas kuliah sebagai aplikasi web kecil dan senang membereskan bagian data yang berantakan. Fokus saya saat ini adalah perancangan skema basis data dan pembuatan API yang mudah diuji.",
    skills: ["PostgreSQL", "Node.js", "Express", "Docker", "Pengujian API"],
    contacts: [{ kind: "situs", label: "Halaman repositori", url: "https://example.com/profil/darryl-ramadhan" }],
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
        role: "Perancang skema dan kueri ringkasan",
        teamSize: null,
        skills: ["PostgreSQL", "SQL", "Express"],
        tools: ["PostgreSQL", "Node.js", "Express"],
        problem: [
          "Catatan pesanan toko masih berupa satu tabel besar berisi teks bebas, sehingga nama produk sering tertulis berbeda untuk barang yang sama.",
          "Pemilik toko tidak bisa melihat jumlah pesanan per produk tanpa menghitung manual.",
        ],
        questions: [
          "Produk mana yang paling sering dipesan?",
          "Bagaimana pesanan tersebar antar bulan?",
        ],
        processIntro:
          "Saya mulai dengan memisahkan satu tabel besar menjadi beberapa tabel yang saling terhubung, baru menyusun tampilan.",
        processSteps: [
          {
            title: "Memisahkan tabel",
            body: "Data dipisahkan menjadi tabel produk, pelanggan, pesanan, dan rincian pesanan agar nama produk hanya tersimpan di satu tempat.",
          },
          {
            title: "Menulis kueri ringkasan",
            body: "Kueri ringkasan menghitung jumlah pesanan per produk dan per bulan, lalu diperiksa dengan beberapa baris contoh.",
          },
          {
            title: "Membuat endpoint",
            body: "Kueri dibungkus menjadi beberapa endpoint sederhana agar halaman dashboard tidak mengambil seluruh isi tabel.",
          },
          {
            title: "Menyusun halaman dasbor",
            body: "Halaman daftar pesanan, ringkasan per produk, dan ringkasan bulanan dibuat seadanya untuk menguji keluarannya.",
          },
        ],
        processNote:
          "Saya meminta seorang teman menambahkan satu pesanan uji untuk memastikan relasi antar tabel bekerja seperti yang saya bayangkan.",
        contributionIntro:
          "Tugas ini dikerjakan sendiri, sehingga seluruh bagian merupakan kontribusi pribadi.",
        contributionChecklist: [
          "Menyusun skema tabel dan hubungan antar tabel.",
          "Menulis kueri ringkasan per produk dan per bulan.",
          "Membuat endpoint API dan halaman dashboard.",
          "Menguji penambahan pesanan baru lewat skema yang sudah dibuat.",
        ],
        designDecision:
          "Saya memakai halaman daftar pesanan sebagai halaman pertama, bukan grafik ringkasan. Alasannya, saat ada pesanan bermasalah pemilik toko lebih dahulu mencari barisnya, bukan melihat tren.",
        teammates: [],
        outcomeIntro:
          "Hasilnya adalah skrip pembuatan tabel, kueri ringkasan yang tersimpan di repositori, dan dashboard dengan tiga halaman.",
        outcomeNote:
          "Cara menjalankan proyek ditulis di berkas README supaya bisa dicoba ulang tanpa penjelasan lisan.",
        outcomeCards: [
          {
            title: "Yang saya pikirkan",
            body: "Saya menahan penambahan fitur pencarian lanjutan, karena daftar pesanan pada tugas ini sengaja berukuran kecil dan belum butuh indeks tambahan.",
          },
          {
            title: "Keterbatasan",
            body: "Belum ada autentikasi dan validasi hak akses, sehingga dashboard ini hanya cocok dijalankan di komputer sendiri.",
          },
        ],
        cover: {
          alt: "Contoh tampilan daftar pesanan pada dashboard.",
          variant: "dashboard",
          caption: "Halaman daftar pesanan. Tampilan contoh; isi tabel pada gambar bukan data sungguhan.",
        },
        gallery: [
          {
            alt: "Contoh skema tabel basis data pesanan.",
            variant: "alur",
            caption: "Skema tabel. Hubungan antara produk, pelanggan, dan pesanan.",
          },
          {
            alt: "Contoh halaman ringkasan bulanan.",
            variant: "dashboard",
            caption: "Ringkasan bulanan. Tampilan contoh halaman ringkasan.",
          },
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
        role: "Endpoint jadwal dan aturan bentrok waktu",
        teamSize: 3,
        skills: ["Node.js", "Express", "Pengujian API", "Docker"],
        tools: ["Node.js", "Express", "Docker", "Postman"],
        problem: [
          "Pemesanan lapangan dilakukan lewat percakapan pesan sehingga dua orang bisa merasa sudah memesan jadwal yang sama.",
          "Pengelola lapangan tidak punya catatan pemesanan yang rapi dan sulit memeriksa jadwal yang masih kosong.",
        ],
        questions: [
          "Jadwal mana yang masih kosong pada tanggal tertentu?",
          "Bagaimana menolak pesanan yang bertabrakan waktunya?",
        ],
        processIntro:
          "Kami menyepakati kontrak endpoint lebih dahulu, lalu membagi pekerjaan per modul agar tidak saling menunggu.",
        processSteps: [
          {
            title: "Menyepakati kontrak endpoint",
            body: "Bentuk permintaan dan balasan setiap endpoint ditulis di satu dokumen supaya tiga anggota bisa bekerja bersamaan.",
          },
          {
            title: "Membuat endpoint jadwal",
            body: "Saya menyiapkan pencarian jadwal kosong dan penyimpanan pesanan baru beserta pemeriksaan bentrok waktu.",
          },
          {
            title: "Menulis pengujian",
            body: "Dua kasus utama diuji otomatis: pesanan pada jadwal kosong dan pesanan pada jadwal yang sudah terisi.",
          },
          {
            title: "Menjalankan di Docker",
            body: "Seluruh layanan dijalankan dengan Docker agar lingkungan kerja kami sama dan mudah dicoba ulang.",
          },
        ],
        processNote:
          "Aturan bentrok waktu saya batasi pada jadwal dengan lapangan yang sama, karena lapangan berbeda tetap boleh dipakai bersamaan.",
        contributionIntro: "Bagian ini hanya pekerjaan yang saya kerjakan sendiri di dalam kelompok.",
        contributionChecklist: [
          "Membuat endpoint pencarian jadwal kosong.",
          "Menulis aturan penolakan pesanan yang bertabrakan waktu.",
          "Menyusun pengujian otomatis untuk kedua kasus tersebut.",
          "Merapikan berkas Docker Compose bersama tim.",
        ],
        designDecision:
          "Saya memilih menolak pesanan yang bentrok dengan kode kesalahan yang jelas, bukan menyimpan pesanan lalu memberi peringatan. Dengan begitu pengelola tidak perlu memeriksa pesanan yang tidak valid.",
        teammates: [
          { name: "Gita Larasati", task: "Modul autentikasi pengelola" },
          { name: "Rio Kurniawan", task: "Halaman pengelola lapangan" },
        ],
        outcomeIntro:
          "Keluaran tugas berupa layanan API dengan dokumentasi singkat, satu set pengujian yang bisa dijalankan, dan berkas Docker Compose kelompok.",
        outcomeNote:
          "Laporan akhir menjelaskan kontrak endpoint serta batas yang belum dikerjakan, yaitu pembayaran daring.",
        outcomeCards: [
          {
            title: "Yang saya pikirkan",
            body: "Saya menulis dokumentasi endpoint sebelum menyelesaikan seluruh kode, supaya rekan tim bisa memakai bentuk balasan yang sama sejak awal.",
          },
          {
            title: "Keterbatasan",
            body: "Belum ada pembayaran daring dan pengujian hanya mencakup jadwal, bukan pembatalan atau pengembalian dana.",
          },
        ],
        cover: {
          alt: "Contoh struktur endpoint layanan pemesanan.",
          variant: "alur",
          caption: "Struktur endpoint. Tampilan contoh alur pemesanan jadwal.",
        },
        gallery: [
          {
            alt: "Contoh dokumen kontrak endpoint.",
            variant: "laporan",
            caption: "Kontrak endpoint. Dokumen yang dipakai tim sebelum menulis kode.",
          },
        ],
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
    program: "Teknologi Informasi, Universitas Nusantara",
    city: "Semarang",
    bio: "Saya lebih banyak mengerjakan praktikum jaringan dan baru mulai menyusun portofolio. Halaman ini sengaja dibiarkan kosong untuk menguji keadaan tanpa proyek.",
    skills: ["Jaringan komputer", "Linux", "Cisco Packet Tracer"],
    contacts: [],
    isPublished: true,
    projects: [],
  },
  {
    username: "sekar",
    displayName: "Sekar Anindita",
    headline: "Mahasiswa Sistem Informasi • Analisis Proses Bisnis",
    program: "Sistem Informasi, Universitas Nusantara",
    city: "Yogyakarta",
    bio: "Profil contoh yang berstatus privat. Profil ini dipakai untuk memastikan pengunjung anonim tidak dapat membuka profil maupun proyeknya.",
    skills: ["Pemodelan proses bisnis", "BPMN", "Wawancara proses"],
    contacts: [],
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
        role: "Pemodelan proses",
        teamSize: 4,
        skills: ["BPMN", "Wawancara proses"],
        tools: ["draw.io"],
        problem: ["Contoh isi untuk menguji aturan visibilitas tingkat profil."],
        questions: ["Contoh isi untuk menguji aturan visibilitas tingkat profil."],
        processIntro: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        processSteps: [
          { title: "Contoh langkah", body: "Contoh isi untuk menguji aturan visibilitas tingkat profil." },
        ],
        processNote: null,
        contributionIntro: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        contributionChecklist: ["Contoh isi untuk menguji aturan visibilitas tingkat profil."],
        designDecision: null,
        teammates: [{ name: "Contoh anggota", task: "Contoh bagian yang dikerjakan anggota lain." }],
        outcomeIntro: "Contoh isi untuk menguji aturan visibilitas tingkat profil.",
        outcomeNote: null,
        outcomeCards: [],
        cover: { alt: "Contoh tampilan aplikasi kasir.", variant: "aplikasi" },
        gallery: [],
        sources: [{ label: "Lihat repositori", url: "https://example.com/demo/repositori-kasir-umkm" }],
        status: "published",
      },
    ],
  },
];
