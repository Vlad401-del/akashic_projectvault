/**
 * DATA CONTOH (FIXTURE) PAPAN PENCARIAN ANGGOTA TIM.
 *
 * Tim, ringkasan ide, peran, dan tenggat di berkas ini tetap fiktif dan hanya
 * dipakai untuk menguji tata letak serta alur "pasang pencarian → terima
 * perkenalan". Berbeda dari versi awal, NAMA LOMBA pada kolom `competition`
 * kini mengacu pada kompetisi mahasiswa yang benar-benar ada (GEMASTIK, PKM,
 * COMPFEST, Arkavidia, Garuda Hacks, HOLOGY, IndonesiaNEXT) agar papan terasa
 * nyata. Identitas tim dan mahasiswa tetap rekaan; tidak ada tanggal resmi,
 * hadiah, atau metrik lomba yang diklaim, dan tenggat diisi tanggal masa depan
 * agar kartu tidak terlihat kedaluwarsa.
 *
 * Pencarian dimiliki beberapa profil publik berbeda supaya papan tampil
 * beragam. Pemilik editor (nadia) sengaja tidak punya pencarian di fixture
 * supaya keadaan kosong pada dashboard teruji, dan pencarian pertamanya dapat
 * dibuat lewat formulir `/dashboard/tim/baru`.
 */
import type { TeamPost } from "./types";

export const teamPosts: TeamPost[] = [
  {
    id: "gemastik-2027-analitik-komplain",
    title: "Tim GEMASTIK 2027 — Analitik Keluhan Asrama",
    competition: "GEMASTIK 2027 (Analitis Data)",
    summary:
      "Ide untuk lomba analitik data: merapikan catatan keluhan asrama yang selama ini tersebar di tiga buku tulis menjadi satu dasbor mingguan untuk panitia. Laporan sering tidak konsisten karena setiap panitia menulis dengan format berbeda, dan keluhan antar bulan belum pernah bisa dibandingkan. Peran dibagi jelas sejak awal: satu orang data, satu antarmuka, dan satu narasi.",
    ownerUsername: "darryl",
    roles: [
      {
        title: "Pengolahan data",
        skills: ["SQL", "Pembersihan data", "Spreadsheet lanjutan"],
      },
      {
        title: "Desain antarmuka",
        skills: ["Figma", "Prototipe", "Wireframe"],
      },
    ],
    currentMembers: 1,
    targetMembers: 3,
    weeklyHours: 8,
    deadline: "10 Desember 2026",
    meetingNote:
      "Kelompok belajar dua kali sepekan di lab, minggu potensi online. Progres ditulis di dokumen bersama sebelum tiap pertemuan supaya yang absen tetap ikut.",
    status: "open",
  },
  {
    id: "pkm-k-jadwal-shift-lab",
    title: "Tim PKM-K — Aplikasi jadwal shift lab",
    competition: "PKM-K 2027",
    summary:
      "Ide pemberdayaan: jadwal shift asisten lab saat ini ditulis di papan tulis dan sering berubah tanpa diketahui asisten yang lain. Aplikasi kecil berbasis web dapat menampilkan jadwal aktif dan pengingat singkat. Saat ini baru ada kerangka alurnya, sehingga pengerjaan desain dan pengembangan masih terbuka.",
    ownerUsername: "rangga",
    roles: [
      {
        title: "Pengembang web",
        skills: ["HTML", "CSS", "JavaScript dasar"],
      },
    ],
    currentMembers: 2,
    targetMembers: 3,
    weeklyHours: 6,
    deadline: "18 Januari 2027",
    meetingNote:
      "Kerja paling sering asinkron lewat pesan; pertemuan langsung cukup sekali sepekan untuk mencoba aplikasi bersama di lab.",
    status: "open",
  },
  {
    id: "gemastik-2027-penambangan-data-kualitas-udara",
    title: "Tim GEMASTIK 2027 — Analitik kualitas udara kota",
    competition: "GEMASTIK 2027 (Penambangan Data)",
    summary:
      "Ide untuk divisi penambangan data: menggabungkan data kualitas udara dari beberapa sumber terbuka menjadi satu peta mingguan yang mudah dibaca warga. Sumber-sumber itu memakai satuan dan rentang waktu berbeda, sehingga tantangan utamanya justru merapikan dan membandingkan, bukan sekadar menampilkan grafik. Perlu satu orang yang terbiasa membersihkan data, satu orang untuk peta, dan satu orang untuk menulis narasi temuan.",
    ownerUsername: "alya",
    roles: [
      { title: "Penambangan data", skills: ["Python", "pandas", "API terbuka"] },
      { title: "Antarmuka peta", skills: ["JavaScript", "Leaflet"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "28 Februari 2027",
    meetingNote:
      "Evaluasi daring tiap Rabu; setiap anggota menuliskan progres di dokumen bersama sebelum pertemuan supaya jeda kuliah tidak menghentikan proyek.",
    status: "open",
  },
  {
    id: "gemastik-2027-perangkat-lunak-posyandu",
    title: "Tim GEMASTIK 2027 — Perangkat lunak pencatatan posyandu",
    competition: "GEMASTIK 2027 (Pengembangan Perangkat Lunak)",
    summary:
      "Kader posyandu masih mencatat berat dan tinggi balita di buku, lalu memindahkannya ke spreadsheet berbulan-bulan kemudian. Kami ingin membuat aplikasi sederhana yang dipakai saat kegiatan berlangsung dan menandai balita yang perlu diperiksa. Perlu satu pengembang backend, satu pengembang antarmuka, dan satu orang yang menguji langsung bersama kader.",
    ownerUsername: "fajar",
    roles: [
      { title: "Pengembang backend", skills: ["Node.js", "PostgreSQL"] },
      { title: "Pengembang antarmuka", skills: ["React", "TypeScript"] },
      { title: "Pengujian lapangan", skills: ["Wawancara pengguna", "Dokumentasi"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 10,
    deadline: "15 Maret 2027",
    meetingNote:
      "Bertemu di lab sekali sepekan dan mengunjungi posyandu tiap dua pekan; catatan kunjungan langsung dipakai untuk memperbaiki alur aplikasi.",
    status: "open",
  },
  {
    id: "gemastik-2027-kota-cerdas-bank-sampah",
    title: "Tim GEMASTIK 2027 — Pemantauan bank sampah kelurahan",
    competition: "GEMASTIK 2027 (Kota Cerdas)",
    summary:
      "Bank sampah kelurahan punya banyak catatan setoran yang tidak pernah diringkas, sehingga pengurus sulit melihat warga mana yang paling aktif. Kami membayangkan satu panel sederhana yang merangkum setoran per pekan dan mengirim pengingat. Perlu satu orang untuk timbangan digital, satu untuk panel data, dan satu untuk koordinasi lapangan.",
    ownerUsername: "bima",
    roles: [
      { title: "Piranti & sensor", skills: ["Arduino", "Sensor berat"] },
      { title: "Panel data", skills: ["Web", "Basis data"] },
      { title: "Koordinasi lapangan", skills: ["Wawancara", "Logistik"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "20 Maret 2027",
    meetingNote:
      "Rapat daring tiap Senin dan kunjungan ke bank sampah saat akhir pekan; tugas dibagi supaya tidak ada yang menanggung dua bagian sekaligus.",
    status: "open",
  },
  {
    id: "gemastik-2027-keamanan-siber-layanan-kampus",
    title: "Tim GEMASTIK 2027 — Audit keamanan layanan kampus",
    competition: "GEMASTIK 2027 (Keamanan Siber)",
    summary:
      "Banyak layanan kampus mahasiswa dibangun cepat tanpa pemeriksaan keamanan dasar. Kami ingin menyusun daftar periksa sederhana dan mengujinya pada beberapa layanan tiruan di lingkungan sendiri. Perlu satu orang untuk pengujian, satu orang untuk menulis laporan temuan, dan satu orang untuk menyiapkan lingkungan uji.",
    ownerUsername: "deva",
    roles: [
      { title: "Pengujian keamanan", skills: ["Web security", "Burp Suite"] },
      { title: "Penulisan laporan", skills: ["Dokumentasi teknis"] },
      { title: "Lingkungan uji", skills: ["Linux", "Docker"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 12,
    deadline: "10 Maret 2027",
    meetingNote:
      "Kerja asinkron lewat repositori, dengan satu sesi daring untuk membahas temuan baru; setiap temuan wajib disertai langkah mengulanginya.",
    status: "open",
  },
  {
    id: "gemastik-2027-ux-catatan-panen",
    title: "Tim GEMASTIK 2027 — Desain aplikasi catatan panen",
    competition: "GEMASTIK 2027 (Desain Pengalaman Pengguna)",
    summary:
      "Petani kecil mencatat hasil panen di ingatan atau di kertas, sehingga sulit melihat pola musim. Kami ingin merancang aplikasi catatan yang tetap bisa dipakai dengan satu tangan dan saat sinyal lemah. Perlu satu perancang antarmuka, satu orang riset pengguna, dan satu orang untuk prototipe interaktif.",
    ownerUsername: "citra",
    roles: [
      { title: "Perancang antarmuka", skills: ["Figma", "Design system"] },
      { title: "Riset pengguna", skills: ["Wawancara", "Usability test"] },
      { title: "Prototipe", skills: ["Prototyping", "Microcopy"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "18 Maret 2027",
    meetingNote:
      "Sesi desain bersama dua kali sepekan; hasil uji dengan petani selalu dibahas sebelum lanjut ke iterasi berikutnya.",
    status: "open",
  },
  {
    id: "pkm-k-2027-jasa-perawatan-sepatu",
    title: "Tim PKM-K 2027 — Jasa perawatan sepatu kampus",
    competition: "PKM-K 2027",
    summary:
      "Layanan perawatan sepatu di sekitar kampus ramai, tetapi pemesanan masih lewat pesan pribadi dan sering bentrok jadwal. Kami ingin menguji model usaha dengan sistem pemesanan dan jadwal jemput yang jelas, sekaligus menghitung biaya nyatanya. Perlu satu orang operasional, satu orang pemasaran, dan satu orang pencatatan keuangan.",
    ownerUsername: "darryl",
    roles: [
      { title: "Operasional", skills: ["Manajemen jadwal"] },
      { title: "Pemasaran", skills: ["Konten", "Media sosial"] },
      { title: "Keuangan", skills: ["Pembukuan sederhana"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "5 Februari 2027",
    meetingNote:
      "Evaluasi usaha tiap dua pekan dengan pembukuan tertulis; keputusan harga dan jadwal diambil bersama, bukan oleh satu orang.",
    status: "open",
  },
  {
    id: "pkm-pm-2027-literasi-keuangan-remaja",
    title: "Tim PKM-PM 2027 — Kelas literasi keuangan remaja",
    competition: "PKM-PM 2027",
    summary:
      "Remaja di lingkungan kami sering kehabisan uang sebelum akhir bulan karena tidak mencatat pengeluaran. Kami ingin menyusun pendampingan singkat berisi kebiasaan mencatat dan menabung, lalu mengukur perubahan kebiasaannya. Perlu satu penyusun materi, satu fasilitator, dan satu orang pengolah hasil sebelum-sesudah.",
    ownerUsername: "citra",
    roles: [
      { title: "Penyusun materi", skills: ["Literasi keuangan"] },
      { title: "Fasilitator", skills: ["Public speaking"] },
      { title: "Pengolahan hasil", skills: ["Data", "Laporan"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 6,
    deadline: "12 Februari 2027",
    meetingNote:
      "Pertemuan persiapan tiap pekan menjelang kelas; sesudah kelas, tim mencatat apa yang berhasil dan apa yang perlu diubah.",
    status: "open",
  },
  {
    id: "pkm-kc-2027-penyiram-otomatis",
    title: "Tim PKM-KC 2027 — Alat penyiram tanaman otomatis",
    competition: "PKM-KC 2027",
    summary:
      "Tanaman di kebun sekolah sering mati saat libur karena penyiraman bergantung pada jadwal manual. Kami ingin merancang alat penyiram otomatis berbasis kelembapan tanah dengan biaya yang bisa ditiru sekolah lain. Perlu satu perancang rangkaian, satu pemrogram perangkat, dan satu orang pengujian lapangan.",
    ownerUsername: "bima",
    roles: [
      { title: "Rangkaian elektronik", skills: ["Sensor kelembapan", "Rangkaian"] },
      { title: "Pemrograman perangkat", skills: ["Arduino", "C++"] },
      { title: "Pengujian lapangan", skills: ["Pengukuran", "Dokumentasi"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "25 Februari 2027",
    meetingNote:
      "Merakit bersama di lab tiap Sabtu; sebelum alat dibawa ke kebun, setiap perubahan dicatat agar hasil pengujian bisa diulang.",
    status: "open",
  },
  {
    id: "pkm-pi-2027-pencatatan-warung",
    title: "Tim PKM-PI 2027 — Pencatatan kasir untuk warung mitra",
    competition: "PKM-PI 2027",
    summary:
      "Warung mitra kami mencatat penjualan hanya di ingatan, sehingga sulit tahu barang apa yang paling laku. Kami ingin menerapkan aplikasi pencatatan sederhana dan melatih pemiliknya memakainya setiap hari. Perlu satu pendamping mitra, satu pengembang aplikasi, dan satu orang yang mencatat perubahan sebelum-sesudah.",
    ownerUsername: "fajar",
    roles: [
      { title: "Pendamping mitra", skills: ["Pelatihan", "Wawancara"] },
      { title: "Pengembang aplikasi", skills: ["Web", "Basis data"] },
      { title: "Pencatatan hasil", skills: ["Data", "Laporan"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "8 Februari 2027",
    meetingNote:
      "Kunjungan ke warung dua kali sepekan pada jam sepi; setiap perubahan aplikasi diuji lebih dulu bersama pemilik warung.",
    status: "open",
  },
  {
    id: "pkm-re-2027-kualitas-air-sungai",
    title: "Tim PKM-RE 2027 — Pemetaan kualitas air anak sungai",
    competition: "PKM-RE 2027",
    summary:
      "Kami ingin menguji apakah pengukuran sederhana seperti kejernihan, suhu, dan pH yang dilakukan rutin dapat menggambarkan perubahan kualitas air satu anak sungai. Fokusnya pada metode yang bisa diulang, bukan pada klaim besar. Perlu satu orang pengambil sampel, satu orang analisis data, dan satu orang penulisan ilmiah.",
    ownerUsername: "alya",
    roles: [
      { title: "Pengambilan sampel", skills: ["Prosedur lapangan"] },
      { title: "Analisis data", skills: ["Statistik", "Python"] },
      { title: "Penulisan ilmiah", skills: ["Penulisan akademik", "Referensi"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 10,
    deadline: "20 Februari 2027",
    meetingNote:
      "Pengambilan sampel tiap Sabtu pagi dengan jadwal bergilir; hasil minggu itu dibahas tiap Selasa sebelum uji berikutnya disusun.",
    status: "open",
  },
  {
    id: "compfest-2027-aic-asisten-belajar",
    title: "Tim COMPFEST — Asisten belajar dari catatan kuliah",
    competition: "COMPFEST 2027 — AI Innovation Challenge (Universitas Indonesia)",
    summary:
      "Materi kuliah menumpuk dan sulit diulang sebelum ujian. Kami ingin membangun asisten yang merangkum catatan dan menyusun kuis latihan dari materi sendiri, dengan jawaban yang sumbernya bisa dilacak. Perlu satu orang pengolahan bahasa, satu orang antarmuka, dan satu orang evaluasi kualitas jawaban.",
    ownerUsername: "deva",
    roles: [
      { title: "Pengolahan bahasa alami", skills: ["Python", "Embeddings"] },
      { title: "Antarmuka", skills: ["React", "REST API"] },
      { title: "Evaluasi", skills: ["Pengujian", "Kualitas data"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 12,
    deadline: "15 Maret 2027",
    meetingNote:
      "Sprint dua pekan dengan demo singkat di akhir setiap sprint; setiap fitur baru ditinjau memakai daftar jawaban uji yang sama.",
    status: "open",
  },
  {
    id: "arkavidia-2027-hackvidia-logistik-bencana",
    title: "Tim Arkavidia — Koordinasi logistik bencana",
    competition: "Arkavidia 2027 — Hackvidia (hackathon ITB)",
    summary:
      "Saat bencana, bantuan sering menumpuk di satu titik sementara titik lain kosong karena kebutuhan tidak terlihat. Kami ingin membuat prototipe papan koordinasi yang memperbarui kebutuhan antar pos dalam hitungan menit. Perlu satu pengembang backend, satu pengembang antarmuka, dan satu orang yang memahami alur relawan.",
    ownerUsername: "darryl",
    roles: [
      { title: "Pengembang backend", skills: ["API", "Basis data"] },
      { title: "Pengembang antarmuka", skills: ["React", "Peta"] },
      { title: "Riset alur relawan", skills: ["Wawancara relawan"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 16,
    deadline: "7 Maret 2027",
    meetingNote:
      "Kerja intensif dua pekan menjelang penjurian dan dibagi per modul; setiap malam ada pembaruan singkat status tiap modul.",
    status: "open",
  },
  {
    id: "garuda-hacks-2027-pengingat-ibu-hamil",
    title: "Tim Garuda Hacks — Pengingat pemeriksaan ibu hamil",
    competition: "Garuda Hacks 2027 (hackathon)",
    summary:
      "Jadwal pemeriksaan ibu hamil mudah terlewat karena hanya diingat bidan. Kami ingin membuat pengingat sederhana yang bisa dipakai bidan desa dan tetap berjalan di ponsel lama. Perlu satu pengembang mobile, satu pengembang backend, dan satu orang desain antarmuka.",
    ownerUsername: "bima",
    roles: [
      { title: "Pengembang mobile", skills: ["Flutter"] },
      { title: "Pengembang backend", skills: ["API", "Basis data"] },
      { title: "Desain antarmuka", skills: ["Figma"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 20,
    deadline: "22 Maret 2027",
    meetingNote:
      "Hackathon akhir pekan penuh, didahului dua sesi persiapan daring; pembagian peran diputuskan sebelum hari-H.",
    status: "open",
  },
  {
    id: "compfest-2027-bpc-percetakan-hemat",
    title: "Tim COMPFEST — Rencana usaha percetakan hemat",
    competition: "COMPFEST 2027 — Business Plan Competition (Universitas Indonesia)",
    summary:
      "Mahasiswa sering mencetak hanya beberapa lembar tetapi membayar harga satuan yang mahal. Kami ingin menyusun rencana usaha percetakan paket hemat dengan analisis biaya dan perkiraan permintaan yang jujur. Perlu satu orang keuangan, satu orang riset pasar, dan satu orang operasional.",
    ownerUsername: "rangga",
    roles: [
      { title: "Keuangan", skills: ["Model biaya", "Proyeksi"] },
      { title: "Riset pasar", skills: ["Survei", "Analisis"] },
      { title: "Operasional", skills: ["Perencanaan layanan"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "28 Februari 2027",
    meetingNote:
      "Rapat tiap pekan dengan dokumen terbuka; angka pada proyeksi selalu disertai sumber asumsinya agar bisa diperiksa ulang.",
    status: "open",
  },
  {
    id: "hology-2027-katalog-desa-wisata",
    title: "Tim HOLOGY — Katalog desa wisata lokal",
    competition: "HOLOGY 2027 (Universitas Brawijaya)",
    summary:
      "Desa wisata di sekitar kami punya potensi, tetapi informasinya hanya tersebar di unggahan lama. Kami ingin membangun katalog rapi berisi paket, jalur, dan kontak pemandu yang bisa diperbarui warga sendiri. Perlu satu pengembang web, satu perancang visual, dan satu orang pendamping warga.",
    ownerUsername: "citra",
    roles: [
      { title: "Pengembang web", skills: ["Web", "CMS"] },
      { title: "Perancang visual", skills: ["Figma", "Fotografi"] },
      { title: "Pendamping warga", skills: ["Pelatihan"] },
    ],
    currentMembers: 1,
    targetMembers: 4,
    weeklyHours: 8,
    deadline: "30 Maret 2027",
    meetingNote:
      "Kunjungan ke desa tiap dua pekan dan pertemuan daring di antaranya; warga ikut mencoba katalog sebelum dianggap selesai.",
    status: "open",
  },
  {
    id: "indonesianext-2027-hackathon-umkm-kuliner",
    title: "Tim IndonesiaNEXT — Digitalisasi UMKM kuliner",
    competition: "IndonesiaNEXT 2027 — Digital Hackathon (Telkomsel)",
    summary:
      "UMKM kuliner kecil sering hanya melayani pesanan lewat pesan pribadi sehingga kehilangan pembeli saat ramai. Kami ingin membangun prototipe pemesanan dan pencatatan menu yang bisa dipakai pemilik warung sendiri. Perlu satu pengembang aplikasi, satu orang analisis data, dan satu orang pendamping UMKM.",
    ownerUsername: "fajar",
    roles: [
      { title: "Pengembang aplikasi", skills: ["Web", "Basis data"] },
      { title: "Analisis data", skills: ["Data", "Laporan"] },
      { title: "Pendamping UMKM", skills: ["Pelatihan", "Wawancara"] },
    ],
    currentMembers: 2,
    targetMembers: 4,
    weeklyHours: 16,
    deadline: "25 Maret 2027",
    meetingNote:
      "Pengerjaan intensif menjelang penjurian dengan pertemuan harian singkat; setiap malam tim meninjau bersama apa yang sudah bisa dicoba.",
    status: "open",
  },
];
