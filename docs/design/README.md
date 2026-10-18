# Catatan desain Akashic

Folder ini menyimpan tangkapan layar dan keputusan desain tahap 1, sesuai permintaan di
[`../AKASHIC_STARTER.md`](../AKASHIC_STARTER.md) bagian "Selesai desain".

## Sumber desain

- **Prototipe Figma Make (rujukan utama):**
  <https://www.figma.com/make/Yx7iEOVBGA9EYEnVgbI7Qa/HiFi-Prototype-for-Akashic>
  Enam layar: Profil, Detail proyek, Profil tanpa proyek, serta tiga layar Editor (Draft, Sudah
  terbit, Proyek baru). Tiga layar publik sudah diterapkan; tiga layar Editor juga sudah dibangun,
  sudah menyimpan ke berkas lokal, dan belum tersambung database maupun login.
- **Referensi warna tambahan (permintaan pemilik produk):**
  gradien tulisan "dreamer" pada `referensi-warna-dreamer.png` — teks gelap dengan gradien cyan →
  biru → hijau, dan tombol biru solid.

Pratinjau live Figma Make tidak bisa dibuka dari peramban sesi kerja ini (`*.figma.site` diblokir
proxy: `ERR_TUNNEL_CONNECTION_FAILED`). Karena itu tangkapan layar di bawah diambil dari alamat
pratinjau cached-preview-nya, dan struktur/kelas Tailwind-nya dibaca langsung dari DOM prototipe
melalui tab "Files"/pratinjau tersebut.

## Tangkapan layar

| Berkas | Isi |
|---|---|
| `figma-make-detail-proyek.png` | Prototipe: halaman detail proyek (utuh, lebar acuan 1440 px) |
| `figma-make-profil.png` | Prototipe: halaman profil publik |
| `figma-make-profil-tanpa-proyek.png` | Prototipe: keadaan profil tanpa proyek |
| `implementasi-detail-proyek.png` | Implementasi tahap 1: bagian atas detail proyek pada 1440 px |
| `implementasi-detail-proyek-utuh.png` | Implementasi tahap 1: detail proyek utuh |
| `implementasi-profil.png` | Implementasi tahap 1: profil publik |
| `referensi-warna-dreamer.png` | Referensi warna dari pemilik produk |

## Keputusan warna

Palet netral tetap seperti spesifikasi. Yang berubah adalah warna aksen: dari violet `#6D28D9`
menjadi biru `#2563EB`, dengan spektrum dekoratif cyan → biru → hijau, mengikuti referensi
"dreamer". Alasan perubahan: permintaan pemilik produk agar warna mengikuti gambar referensi
tersebut, tetapi tetap memberi kesan prismatic (tanda merek tetap prisma tiga sisi dengan tiga
warna spektrum).

| Peran | Nilai | Kontras pada latar putih | Dipakai untuk |
|---|---|---|---|
| Latar | `#F8F9FC` | — | Latar halaman |
| Permukaan | `#FFFFFF` | — | Kartu, panel, bilah atas |
| Teks utama | `#182230` | 15,2:1 | Judul dan teks isi |
| Teks sekunder | `#526071` | 5,9:1 | Keterangan, label, ringkasan |
| Garis | `#DCE2EA` / `#C8D0DB` | — | Garis pemisah, garis kartu saat disorot |
| Aksen (tombol, tautan, fokus) | `#2563EB` | 5,17:1 | Tombol utama, tautan, focus ring |
| Aksen saat disorot | `#1D4ED8` | 6,4:1 | Keadaan hover tombol |
| Aksen lembut | `#EAF1FD` | — | Kepala kartu "Kontribusi saya", lencana nomor |
| Spektrum dekoratif | cyan `#06B6D4` → biru `#2563EB` → hijau `#22C55E` → lime `#84CC16` | 2,3–2,6:1 (**tidak lolos** untuk teks) | Hanya prisma merek dan garis tipis |
| Gradien kata merek | cyan `#0891B2` → biru `#2563EB` → hijau `#15803D` | 4,4–5,2:1 | Tulisan "Akashic" saja |
| Bahaya (belum dipakai) | `#B42318` / `#FEF3F2` | 6,6:1 | Pesan kegagalan (tahap berikutnya) |

Catatan penting: cyan, hijau, dan lime **tidak pernah** dipakai sebagai warna teks atau tombol
karena kontrasnya gagal. Ketiganya hanya muncul pada tanda prisma, gradien kata merek, dan garis
tipis, sesuai batas "5–10% area beraksen" pada spesifikasi. Gradien kata merek memakai versi yang
sedikit lebih gelap daripada spektrum dekoratif agar tetap terbaca.

## Keputusan komponen hasil penyelarasan dengan prototipe

| Bagian | Keputusan |
|---|---|
| Bilah atas | Menempel di atas, tinggi 56 px, `bg-surface/95` + `backdrop-blur`; kiri penanda halaman, kanan merek |
| Avatar | Lingkaran `bg-ink` berisi inisial nama; 32 px di bilah atas, 80–96 px di header profil |
| Pemberitahuan prototipe | Kotak bergaris dengan ikon info, menyatakan bahwa isi halaman fiktif |
| Header profil | Grid `auto + 1fr`: avatar di kiri, nama 40 px, headline, program studi/kota dengan ikon, bio, Keterampilan, Kontak |
| Kartu proyek | Seluruh kartu dapat diklik lewat tautan yang meluas (`after:inset-0`), sampul menempel di tepi atas dengan garis bawah |
| Header detail proyek | Kategori · jenis tugas · periode, judul 48 px, ringkasan, label keterampilan |
| Susunan detail proyek | Header dan sampul membentang penuh; narasi di kolom kiri, panel "Konteks tugas" menempel di kolom kanan (320 px) |
| Bagian narasi | Bernomor 01–05 dengan ikon di kotak bergaris: Masalah, Proses, Kontribusi saya, Hasil, Galeri |
| Kontribusi saya | Kartu dengan kepala berwarna aksen lembut, daftar centang pekerjaan sendiri, kotak "Keputusan desain yang saya ambil", lalu daftar "Dikerjakan anggota lain" |
| Tambahan kami | Lencana "Contoh tampilan" pada setiap ilustrasi dan catatan bahwa semua tautan bukti karya mengarah ke `example.com`; prototipe tidak memilikinya, tetapi aturan kejujuran data contoh di spesifikasi kami memerlukannya |

## Keputusan layar editor

| Bagian | Keputusan |
|---|---|
| Susunan | Dua kolom di layar besar: formulir di kiri, panel "Pratinjau ringkas" yang menempel (sticky) di kanan. Di ponsel pratinjau turun ke bawah formulir |
| Header | Tautan kembali, penanda status (Draft / Sudah terbit), penanda "Ada perubahan belum disimpan", lalu tombol Pratinjau, Simpan, dan Terbitkan |
| Nama tombol simpan | Proyek draft dan proyek baru memakai "Simpan draft"; proyek terbit memakai "Simpan perubahan publik" dengan keterangan bahwa perubahan langsung mengganti halaman publik |
| Kelompok isian | Tiga bagian seperti desain: Identitas proyek, Cerita proyek, Bukti karya |
| Narasi | Textarea biasa, bukan editor dokumen. Paragraf dipisah baris kosong, butir daftar satu per baris, pasangan judul/isi dipisah tanda pisah panjang |
| Pratinjau | Panel ringkas yang ikut berubah saat mengetik, plus jendela pratinjau penuh yang memakai komponen halaman publik yang sama |
| Checklist terbit | Tujuh syarat isi dihitung otomatis, ditambah dua pernyataan pemilik (hak membagikan karya dan tidak ada data sensitif). Dinyatakan sebagai pernyataan pengguna, bukan verifikasi platform |
| Kejujuran | Pemberitahuan di atas formulir menyebut bahwa area pemilik belum punya login dan bahwa isinya disimpan ke berkas lokal di komputer ini, bukan ke database. Setiap tombol simpan/terbit menampilkan konfirmasi berisi waktu penyimpanan |

Tangkapan layar layar editor belum ditambahkan. Jendela peramban pada sesi kerja ini tidak dapat
menampilkan tab secara terlihat sehingga tangkapan layar gagal diambil; yang tersimpan di sini baru
tangkapan prototipe dan tiga layar publik.
