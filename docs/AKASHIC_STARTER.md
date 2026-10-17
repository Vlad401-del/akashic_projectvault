# Akashic — Panduan Mulai dan Prompt Pengerjaan

Dokumen kerja kelompok • 17 Oktober 2026

## 1. Keputusan: hifi singkat dahulu, kemudian implementasi di IDE

Panduan ini mengasumsikan produk yang dipilih adalah Akashic dan repositori belum berisi aplikasi yang perlu dipertahankan. Jika ternyata sudah ada kode, minta AI membaca kode itu sebelum mengubah teknologi atau struktur. Panduan ini belum dijalankan pada repositori kelompok karena URL dan isi repositorinya belum diberikan.

Urutannya: sepakati cakupan → buat tiga layar acuan di Figma Make → uji alur dengan calon pengguna → bangun satu alur yang berfungsi di VS Code → lengkapi dan uji aplikasi secara lokal. Alokasikan satu sesi sekitar 2–3 jam untuk acuan desain. Jika belum sempurna tetapi alur sudah jelas, lanjutkan implementasi. Batas waktu ini adalah saran kerja, bukan estimasi pasti dari alat.

Git menyimpan versi kode dan dokumen. IDE adalah tempat mengerjakan aplikasinya. Desain yang sudah dipilih menjadi acuan implementasi; dokumentasi serta kode final disimpan dalam repo yang sama.

## 2. Alat yang dipakai

| Kebutuhan | Pilihan | Perannya |
|---|---|---|
| Hifi dan prototipe | Figma Make yang sudah tersedia | Menguji susunan layar, isian, dan alur navigasi. |
| IDE | Visual Studio Code | Membuka repo dan menjalankan aplikasi secara lokal. |
| AI coding | GitHub Copilot di VS Code | Membantu implementasi bertahap dengan konteks berkas. Mulai dari paket Free jika tersedia pada akun; penggunaannya terbatas. |
| Aplikasi web | Next.js App Router + TypeScript | Halaman publik dan area pengelolaan dalam satu aplikasi. |
| Tampilan | Tailwind CSS | Menerapkan desain yang konsisten. |
| Database dan login | Supabase lokal: PostgreSQL + Auth | Menyimpan profil, proyek, dan akun di laptop. |
| Gambar | Supabase Storage lokal | Menyimpan sampul serta galeri di laptop dengan kebijakan akses. |
| Versi dan kolaborasi | Git + repositori yang sudah dibuat | Branch, commit, dan peninjauan perubahan. |
| Runtime aplikasi | Node.js LTS + npm | Menjalankan Next.js melalui localhost. |
| Runtime backend lokal | Docker Desktop + Supabase CLI | Menjalankan PostgreSQL, Auth, dan Storage lokal. |

Gunakan Node.js LTS yang masih didukung dan memenuhi persyaratan Next.js. Dokumentasi yang diperiksa mencantumkan minimum Node.js 20.9; jangan memasang versi lama hanya karena memenuhi minimum tersebut. Commit lockfile npm agar anggota kelompok memakai versi dependensi yang konsisten.

Fase sekarang sepenuhnya lokal: website dan backend berjalan di laptop. Jangan membuat proyek Supabase cloud, menghubungkan Vercel, menjalankan deployment, menyalakan tunnel publik, atau mengaktifkan auto-deploy dari Git. Push ke repo untuk menyimpan kode tetap diperbolehkan; push bukan perintah untuk menerbitkan aplikasi. Jika repo pernah dihubungkan ke layanan deployment, nonaktifkan koneksi otomatisnya terlebih dahulu.

Supabase lokal memerlukan Docker Desktop di Windows dan Supabase CLI. Instalasi awal membutuhkan internet untuk mengunduh dependensi dan container. Setelah terpasang, alur inti menggunakan layanan lokal; tautan eksternal tentu tetap memerlukan internet. Jangan memasang PostgreSQL/MySQL terpisah untuk aplikasi ini karena PostgreSQL sudah termasuk di dalam stack Supabase lokal. Mulai UI dengan fixture terlebih dahulu sehingga penyiapan Docker tidak menghambat sesi desain. Jalankan Supabase lokal mulai tahap autentikasi/database.

Tidak perlu menambah Laravel, Express, atau FastAPI ke MVP ini. Next.js menangani lapisan aplikasi, sedangkan Supabase menyediakan database, autentikasi, dan penyimpanan. AI coding membantu membuat produk; fitur AI di dalam produk belum diperlukan.

### Konsep nama dan arah visual

Nama produk adalah **Akashic**. Dalam identitas produk ini, namanya dimaknai sebagai ruang rekam perjalanan karya dan kemampuan mahasiswa. Arah desainnya menyerupai arsip karya yang tertata dan kontemporer. Hindari ornamen mistis atau gaya permainan fantasi yang mengurangi keterbacaan studi kasus.

**Prismatic minimal** berarti warna spektrum dipakai sebagai aksen kecil, sedangkan teks dan isi proyek tetap dominan. Ini pilihan desain, bukan klaim bahwa warna tertentu otomatis meningkatkan konversi.

| Elemen | Warna/penerapan |
|---|---|
| Latar | #F8F9FC |
| Permukaan/kartu | #FFFFFF |
| Teks utama | #182230 |
| Teks sekunder | #526071 |
| Garis | #DCE2EA |
| Tombol utama, link, fokus | Biru #2563EB dengan teks putih pada tombol |
| Spektrum dekoratif | Cyan #06B6D4 → biru #2563EB → hijau #22C55E → lime #84CC16 pada prisma merek dan garis tipis saja |

> **Revisi warna (permintaan pemilik produk).** Aksen utama semula violet #6D28D9 dengan spektrum
> violet → biru → cyan. Setelah prototipe Figma Make selesai, pemilik produk meminta warna
> mengikuti gradien tulisan "dreamer" pada gambar referensi (cyan → biru → hijau, tombol biru
> solid) dengan tetap mempertahankan kesan prismatic. Aksen utama kini biru #2563EB dan spektrum
> dekoratif bergerak cyan → biru → hijau. Catatan: cyan dan hijau tidak lolos kontras untuk teks,
> jadi keduanya hanya dipakai pada tanda merek dan garis tipis. Rincian pengukuran kontras ada di
> [`design/README.md`](design/README.md).

Sebagian besar layar tetap netral; kira-kira 5–10% area boleh membawa aksen warna. Gradient cukup pada tanda merek, garis tipis, atau ornamen kecil. Jangan memakai teks bergradient pada paragraf, latar pelangi penuh, kilau bergerak, atau kartu berwarna berbeda tanpa makna. Status draft/published tetap memiliki label teks; warna bukan satu-satunya penanda. Gunakan focus ring yang jelas dan periksa kontras teks pada setiap pasangan warna.

## 3. Produk yang akan diselesaikan

**Janji produk:** mahasiswa mengubah tugas kuliah menjadi studi kasus proyek dan menerbitkannya sebagai portofolio website melalui satu tautan.

**Pengguna awal:** mahasiswa Sistem Informasi/informatika yang menyiapkan lamaran magang dan memiliki sedikitnya dua tugas proyek.

**Output lokal:** satu halaman profil dan beberapa halaman detail proyek yang dibuka melalui localhost. Contoh rute: `/u/darryl` dan `/u/darryl/p/dashboard-penjualan`. Seluruh akun uji dilayani aplikasi lokal yang sama. Contoh alamat lengkap: `http://localhost:3000/u/darryl`. Alamat localhost hanya mengarah ke perangkat yang membukanya; tautan ini belum dapat dibagikan sebagai portofolio online kepada perekrut.

Alur utama: daftar → isi profil → buat proyek → tulis masalah/proses/kontribusi/hasil → tambah bukti karya → simpan draft → pratinjau → aktifkan tampilan publik lokal → salin tautan lokal → buka tanpa login di peramban privat pada laptop yang sama.

### Wajib untuk MVP

- Daftar, login, logout, dan pemulihan kata sandi melalui surel.
- Profil: username unik, nama tampil, headline, bio, keterampilan, dan tautan kontak opsional yang disetujui untuk publik.
- Proyek: judul, ringkasan, masalah, proses, kontribusi pribadi, hasil, keterampilan, serta konteks mata kuliah opsional.
- Satu gambar sampul dan galeri kecil; bukti kode, prototipe, dashboard, atau laporan dimasukkan sebagai tautan HTTPS.
- Daftar proyek, edit, hapus, status draft/published, pratinjau milik sendiri, terbitkan, dan tarik dari publik.
- Profil serta detail proyek publik yang nyaman dibaca di laptop dan ponsel.
- Empty state, loading, pesan kegagalan, dan konfirmasi hapus.

### Ditunda

Pembaca PDF dengan AI, unggah PDF, impor otomatis GitHub/Figma, ekspor CV/PDF, custom domain, pilihan banyak tema, pembayaran, analitik pengunjung, kolaborasi tim, akun dosen, badge terverifikasi, dan admin panel. PDF laporan masih bisa ditautkan jika pengguna memang memberikan akses pada dokumen tersebut. Mendukung tautan tidak berarti mengimpor isinya secara otomatis.

### Makna publikasi pada tahap lokal

Istilah published/terbitkan adalah status visibilitas di dalam aplikasi, bukan tindakan hosting. Gunakan penjelasan “Tampil pada portofolio lokal” pada versi pengembangan. Pengunjung anonim diuji menggunakan jendela privat pada laptop yang sama. Publikasi website ke internet berada di luar lingkup fase ini.

### Aturan publikasi yang sederhana

Profil baru bersifat privat sampai pengguna mengaktifkan publikasi profil. Proyek hanya terlihat publik jika profil aktif DAN status proyek published. Draft tidak boleh tersedia melalui URL langsung atau permintaan database anonim.

Untuk MVP, perubahan pada proyek yang sudah terbit langsung berlaku setelah tombol **Simpan perubahan publik** ditekan. Tampilkan pemberitahuan yang menjelaskan perilaku ini. Proyek draft memakai tombol **Simpan draft**. Fitur menyunting draft terpisah dari versi publik ditunda; jangan membuat janji bahwa versi lama tetap tersedia jika mekanismenya belum dibangun.

Menarik profil dari publik menyembunyikan seluruh proyeknya. Menarik satu proyek menyembunyikan proyek itu saja. Menghapus profil/proyek harus membuat akses publik terkait berhenti. Gunakan data demonstrasi tanpa informasi sensitif saat menguji.

## 4. Prompt Figma Make: kerjakan layar demi layar

Gunakan prompt A terlebih dahulu. Sesudah hasilnya dapat dibaca dan hierarkinya jelas, lanjutkan B dan C dalam percakapan yang sama. Data prototipe boleh berada di memori dan diberi label sebagai data demo. Prototipe ini tidak membuktikan login, penyimpanan, atau publikasi produksi sudah tersedia.

### Prompt A — halaman detail proyek

```text
Buat prototipe hifi desktop Akashic, sebuah produk yang membantu mahasiswa menyusun tugas menjadi studi kasus portofolio. Mulai hanya dari halaman DETAIL PROYEK PUBLIK pada lebar acuan 1440 px, dengan tata letak yang tetap berfungsi pada lebar 390 px.

Gaya visual: prismatic minimal yang rapi, seperti arsip karya profesional muda. Background #F8F9FC, permukaan #FFFFFF, teks utama #182230, teks sekunder #526071, garis #DCE2EA. Aksen utama violet #6D28D9 untuk tombol, link, dan fokus. Spektrum violet → biru #2563EB → cyan #0891B2 hanya pada tanda merek atau satu garis tipis; coral #E87979 sangat terbatas sebagai dekorasi. Sekitar 90–95% area layar tetap netral. Gunakan warna solid untuk tombol dan teks; pilih satu aksen dominan per komponen. Gunakan font sans-serif yang mudah dibaca, misalnya Inter dengan fallback system font. Spasi berbasis 8 px, radius sekitar 10–12 px. Gunakan sedikit bayangan dan ruang kosong yang cukup. Jangan menambahkan gradient besar, teks pelangi, efek holografik/glow, glassmorphism, ilustrasi AI, angka statistik rekaan, badge verifikasi, atau animasi besar. Bahasa antarmuka Indonesia. Akashic adalah ruang rekam karya mahasiswa; tampilkan merek sebagai wordmark sederhana dengan satu tanda prisma kecil, tanpa simbol mistis. Jangan publikasikan prototipe ke internet, menghubungkan backend, atau menyalakan hosting. Gunakan pratinjau kerja Figma Make saja.

Contoh fiktif: mahasiswa bernama Nadia Putri, headline “Mahasiswa Sistem Informasi • Analisis Data dan Desain Produk”. Proyek “Dashboard Penjualan Ritel”, jenis tugas kelompok, mata kuliah Visualisasi Data. Tampilkan contoh narasi singkat dan konkret; jangan mengarang metrik peningkatan bisnis.

Susunan halaman:
1. Navigasi tipis: nama Nadia Putri, tautan Kembali ke portofolio.
2. Header proyek: kategori, judul, ringkasan dua kalimat, keterampilan, periode opsional.
3. Gambar dashboard sebagai bukti karya. Gunakan ilustrasi dashboard netral yang jelas sebagai contoh, bukan foto stok.
4. Konten terstruktur: Masalah, Proses, Kontribusi Saya, dan Hasil. Kontribusi pribadi harus menonjol dan terpisah dari hasil kelompok.
5. Panel ringkas berisi konteks mata kuliah dan tombol Lihat Dashboard, Baca Laporan. Tombol sumber merupakan tautan demo yang diberi label, bukan integrasi layanan.
6. Galeri dua gambar jika ada dan bagian Proyek lainnya.

Maksimum lebar konten sekitar 1120 px. Isi narasi utama sekitar 65–75 karakter per baris. Pada ponsel, panel pindah ke bawah header dan seluruh konten terbaca tanpa scroll horizontal. Gunakan label teks bersama ikon. Jika sumber belum ada, sembunyikan tombolnya. Tampilkan halaman ini dahulu; jangan membuat landing page pemasaran, database, atau autentikasi.
```

### Prompt B — profil publik

```text
Pertahankan sistem visual dan contoh pengguna pada layar sebelumnya. Tambahkan halaman PROFIL PUBLIK Nadia Putri dan hubungkan kartu proyek ke detail proyek yang sudah dibuat.

Tampilkan nama, headline, bio 2–3 kalimat, keterampilan, tautan kontak opsional, serta tiga proyek demo: Dashboard Penjualan Ritel, NextUse — Platform Berbagi Barang, dan Riset Pengalaman Pengguna Perpustakaan. Nyatakan seluruh isi ini sebagai contoh fiktif. Setiap kartu memiliki sampul, judul, ringkasan satu kalimat, dan maksimal tiga keterampilan. Gunakan dua kolom di desktop dan satu di ponsel. Prioritaskan isi karya; tidak perlu hero setinggi satu layar atau grafik kemampuan persentase.

Tambahkan keadaan tanpa proyek: pesan singkat bahwa karya belum diterbitkan. Jangan tampilkan tombol edit atau status draft pada profil publik. Tambahkan navigasi prototipe yang memungkinkan penguji membuka profil lalu detail proyek dan kembali lagi.
```

### Prompt C — editor proyek

```text
Tambahkan layar EDITOR PROYEK untuk pemilik akun menggunakan sistem visual yang sama. Ini simulasi lokal prototipe, tanpa login sungguhan atau backend.

Gunakan area kerja dua kolom di desktop: formulir utama dan panel pratinjau ringkas. Pada ponsel, tampilkan berurutan. Header memuat Kembali ke proyek, status Draft, Simpan draft, Pratinjau, dan Terbitkan.

Kelompokkan isian menjadi: Identitas proyek; Cerita proyek; Bukti karya. Isian: judul, ringkasan, mata kuliah opsional, tugas individu/kelompok, masalah, proses, kontribusi pribadi, hasil, keterampilan, sampul, dan tautan sumber opsional. Gunakan textarea biasa. Bantu pengguna dengan pertanyaan pendek seperti “Bagian mana yang Anda kerjakan sendiri?”. Jangan menambahkan editor dokumen kompleks.

Sertakan keadaan input kosong, kesalahan judul kosong dan URL tidak valid, status sedang menyimpan, serta pesan perubahan belum disimpan. Tampilkan checklist sebelum publikasi: judul dan narasi wajib lengkap; kontribusi pribadi jelas; minimal satu bukti berupa gambar atau tautan; pengguna menyatakan berhak membagikan karya dan tidak menyertakan data sensitif. Checklist ini pernyataan pengguna, bukan verifikasi platform.

Sediakan simulasi pratinjau dan tombol kembali. Tandai penerbitan sebagai simulasi demo. Untuk proyek Published, tombol simpan bernama “Simpan perubahan publik” dan beri keterangan bahwa perubahan akan langsung tampil di halaman publik. Jangan menambahkan AI penulis, pembayaran, admin, CV, atau menu lain.
```

Selesai desain: simpan tangkapan layar ketiga tampilan ke `docs/design/` di repo, tambahkan tautan Figma dan keputusan warna/komponen ke README atau dokumen desain. Jangan mengekspor seluruh aplikasi prototipe lalu menimpa repo secara membabi buta. AI di IDE memakai gambar sebagai referensi dan menerapkan pola Next.js yang dipilih.

> **Catatan pelaksanaan.** Prototipe Figma Make sudah selesai dan tangkapan layarnya disimpan di
> [`design/`](design/README.md) beserta tautan Figma dan keputusan warna/komponen. Kalimat warna
> pada prompt A di atas dibiarkan seperti aslinya sebagai catatan prompt yang benar-benar dipakai;
> palet yang berlaku sekarang ada pada tabel di bagian 2.

## 5. Mulai dari repo yang sudah dibuat

Jika repo belum ada di laptop: salin alamat clone dari layanan Git, jalankan `git clone ALAMAT_REPO_ANDA`, lalu buka folder hasilnya melalui VS Code → Open Folder. Ganti placeholder dengan alamat sebenarnya. Jika repo sudah ada di laptop, buka folder itu; jangan clone ulang.

Di terminal VS Code, periksa terlebih dahulu:

```powershell
git status
node --version
npm --version
```

Jika ada perubahan milik anggota lain, pertahankan dan pahami sebelum melanjutkan. Jika repo sudah punya aplikasi, gunakan perintah pemasangan dari README/lockfile yang tersedia. Jangan menjalankan generator di atas kode yang ada.

Untuk repo baru yang hanya berisi dokumen, gunakan subfolder `web` agar README dan dokumen repo tidak berbenturan dengan generator:

```powershell
git switch -c feat/akashic-foundation
npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*" --disable-git
cd web
npm run dev
```

Jalankan perintah satu per satu. Jika generator mengajukan pilihan tambahan, gunakan pilihan default dan catat hasilnya. Buka `http://localhost:3000`. Hentikan dev server dengan Ctrl+C sebelum menjalankan pemeriksaan di terminal yang sama. Jika repo sudah memiliki branch dengan nama tersebut, gunakan branch yang ada atau nama baru yang jelas.

Simpan dokumen ini sebagai `docs/AKASHIC_STARTER.md` dari root repo. Root repo berisi dokumen dan folder `web`; dependensi aplikasi berada di `web/package.json`. Seluruh perintah aplikasi dijalankan dari `web`. Belum ada konfigurasi hosting yang perlu dibuat.

### Menyiapkan backend lokal setelah tahap UI selesai

Instal dan jalankan Docker Desktop sesuai panduan Windows-nya. Dari folder `web` yang sudah memiliki package.json:

```powershell
npm install --save-dev --save-exact supabase
npx supabase init
npx supabase start
npx supabase status
```

Jalankan `init` hanya bila folder konfigurasi Supabase belum tersedia. Jika sudah ada, pakai konfigurasi proyek tersebut. CLI akan mengunduh container pada start pertama; waktunya bergantung koneksi. Tidak perlu `supabase login` atau `supabase link` untuk stack lokal. Config dan migration berada di `web/supabase/` sehingga perintah CLI tetap dijalankan dari `web`.

Ambil API URL dan publishable/anon key lokal dari output CLI untuk `web/.env.local`, mengikuti nama variabel yang digunakan kode. Jangan menyalin secret/service-role key ke variabel `NEXT_PUBLIC_*`. Gunakan endpoint yang benar-benar dilaporkan CLI, bukan URL proyek cloud. UI Studio lokal membantu membaca database, dan kotak surel pengujian lokal menangkap surel konfirmasi/reset; alamat tepatnya mengikuti output CLI. Surel ini bukan dikirim ke inbox pribadi.

Jalankan `npm run dev` pada terminal lain. Setelah selesai, hentikan Next.js dengan Ctrl+C dan stack backend dengan `npx supabase stop`. Jangan menjalankan reset database yang menghapus data tanpa memahami dampaknya; reset hanya untuk lingkungan uji yang boleh dibangun ulang dari migration/seed. Container, cache, dan data runtime tidak di-commit; config, migration, dan seed sintetis disimpan di Git.

Jangan membuat proyek Git kedua di dalam `web`. Jangan memakai `git init` jika repo sudah tersedia. `.env.local` harus diabaikan Git; `.env.example` hanya memuat nama variabel dan placeholder.

## 6. Prompt implementasi di IDE

Tempel prompt berikut satu per satu ke Copilot Chat/Agent setelah membuka repo. Sertakan tangkapan layar Figma ketika mulai tahap UI. Setiap tahap harus berakhir dengan hasil yang dapat dijalankan. Jangan mengirim kelima prompt sekaligus.

### Prompt 1 — fondasi dan halaman publik dengan data contoh

```text
Kerjakan fondasi MVP Akashic di repo ini. Baca AGENTS.md jika ada, README, docs/AKASHIC_STARTER.md, package.json, lockfile, dan struktur repo terlebih dahulu. Pertahankan perubahan pengguna. Jika belum ada aplikasi, gunakan Next.js App Router, TypeScript, Tailwind, ESLint dan npm di subfolder web. Jika sudah ada aplikasi, jangan scaffold ulang atau mengganti stack tanpa menjelaskan ketidakcocokannya.

Implementasikan tahap pertama saja: halaman profil publik /u/[username] dan detail /u/[username]/p/[slug] dari fixture bertipe di modul terpisah. Gunakan dua pengguna fiktif untuk memastikan konten ditentukan oleh URL. Lampirkan desain Figma sebagai referensi jika tersedia; jika tidak, ikuti warna dan susunan di dokumen. Buat komponen ProjectCard, ProfileHeader, ProjectStory, dan SourceLinks yang dapat digunakan ulang. Hindari satu komponen raksasa. Konten bahasa Indonesia. Gambar contoh lokal dengan hak penggunaan jelas atau placeholder yang diberi label.

Halaman akar boleh berupa pengantar singkat dan tautan Lihat contoh portofolio; jangan habiskan waktu untuk landing page pemasaran. Username/proyek tidak ada menghasilkan not-found. Tautan sumber hanya http/https, tidak boleh javascript: atau HTML mentah. Pastikan responsive di 390 dan 1440 px, fokus keyboard terlihat, label aksesibel, serta link/kembali bekerja. Jangan menghubungkan Supabase, AI API, pembayaran, atau autentikasi palsu. Kerjakan hanya secara lokal; jangan deploy, membuat tunnel publik, atau menyiapkan Vercel.

Jalankan lint menggunakan konfigurasi yang tersedia, pemeriksaan tipe, dan production build. Tambahkan script yang diperlukan jika belum ada. Jangan menghapus aturan lint untuk meloloskan pemeriksaan. Jelaskan berkas berubah, cara menjalankan, hasil pemeriksaan, dan fitur yang masih memakai fixture.
```

### Prompt 2 — database, autentikasi, dan akses data

```text
Lanjutkan dari implementasi tahap pertama. Tambahkan Supabase Auth dengan surel/password, konfirmasi surel, logout, dan pemulihan password, mengikuti dokumentasi resmi yang cocok dengan versi Next.js dan SDK yang terpasang. Gunakan cookie-based SSR; periksa apakah versi ini memakai proxy.ts atau middleware.ts, jangan mencampurkan pola versi. Gunakan konfigurasi lingkungan dan SDK resmi, bukan server autentikasi sendiri. Gunakan Supabase lokal melalui Docker Desktop dan CLI, dengan config/migration di web/supabase. Endpoint dan publishable/anon key lokal diambil dari CLI dan diisi pengguna di web/.env.local. Jangan membuat atau menautkan proyek cloud, jangan menjalankan login/link ke platform, jangan deploy. Surel konfirmasi/reset diuji melalui kotak surel lokal dari CLI.

Buat migration SQL yang tersimpan di repo untuk:
- profiles: id mengacu auth.users, username unik dan ternormalisasi, display_name, headline, bio, skills, public_contact_url opsional, is_published default false, timestamps.
- projects: id, owner_id, slug, title, summary, problem, process, contribution, outcome, course opsional, work_type, skills, cover_path opsional, status draft/published default draft, timestamps; unik owner_id + slug.
- project_sources: id, project_id, label, url.
- project_images: id, project_id, storage_path, alt_text, sort_order.

Aktifkan RLS dan grants minimum. Pemilik boleh membaca serta mengubah data sendiri. Pengunjung anonim hanya boleh membaca profil published dan proyek published dengan profil published; sumber/gambar mengikuti izin proyek induknya. Uji kebijakan juga dengan pengguna terautentikasi lain, bukan hanya anonim. Jangan mengekspos surel login, metadata auth, atau service-role key dalam profil publik. Pemilik tidak boleh mengganti owner_id ke akun lain atau menempelkan sumber pada proyek orang lain. Jangan membuat public view yang melewati RLS tanpa meninjau security invoker-nya.

Lindungi dashboard pada server dan validasi identitas pada setiap mutasi; jangan mengandalkan tombol tersembunyi. Sediakan dokumentasi menjalankan migration, variabel .env.example, URL redirect auth localhost, dan langkah membuat dua akun uji. Jangan mengaku autentikasi lulus bila kredensial belum tersedia: bedakan validasi lokal dengan pengujian integrasi yang tertunda. Jangan menonaktifkan RLS untuk memperbaiki error.
```

### Prompt 3 — satu alur dari editor sampai portofolio publik

```text
Bangun dashboard proyek /dashboard, pengaturan profil /dashboard/profile, editor baru /dashboard/projects/new, editor /dashboard/projects/[id]/edit, dan pratinjau khusus pemilik. Gunakan database tahap sebelumnya sebagai sumber data nyata, bukan localStorage. Ikuti desain editor yang dilampirkan. Gunakan textarea sederhana dan validasi server.

Implementasikan buat/edit/hapus proyek, sumber HTTPS, pratinjau draft milik sendiri, publikasi profil, publikasi proyek, dan penarikan publikasi. Slug dibentuk dari judul saat dibuat, tetapi stabil setelah proyek terbit agar tautan tidak berubah ketika judul diedit. Tangani konflik username/slug dengan pesan yang jelas.

Untuk publikasi, wajib ada judul, ringkasan, masalah, proses, kontribusi, hasil, minimal satu bukti gambar/tautan, dan persetujuan pengguna atas hak publikasi. Validasi ini berlaku pada server juga. Jangan memberi label terverifikasi. Untuk proyek published, tombol “Simpan perubahan publik” menjelaskan bahwa simpan langsung mengubah halaman publik; tidak ada sistem draft versi kedua pada MVP.

Sebelum fitur unggah selesai, gunakan tautan sumber sebagai bukti sehingga satu alur sudah dapat diuji. Tampilkan feedback penyimpanan, empty/error/loading state, konfirmasi hapus, serta peringatan meninggalkan perubahan belum tersimpan. Draft harus ditolak pada rute publik meskipun ID/slug diketahui. Halaman privat tidak boleh di-cache sebagai halaman bersama; setelah publish/unpublish/edit, pastikan halaman publik segera mencerminkan status baru. Ganti fixture pada jalur produksi dengan data nyata; jika fixture dipertahankan untuk demo, pisahkan secara eksplisit.

Uji alur akun A membuat draft → preview → publish → terlihat anonim → unpublish → tidak terlihat anonim. Akun B tidak boleh mengeditnya. Jalankan lint, typecheck, dan build; laporkan hasil sebenarnya.
```

### Prompt 4 — gambar sampul dan galeri

```text
Tambahkan unggah sampul dan galeri kecil melalui Supabase Storage lokal pada stack Docker yang sudah digunakan. Jangan membuat bucket pada layanan cloud. Batasi MVP ke JPEG/PNG/WebP, maksimum 5 MB per gambar dan maksimal 5 gambar per proyek. Validasi ukuran serta tipe file di lapisan tepercaya, tidak hanya ekstensi di browser. Gunakan nama file acak, alt text, progres/error unggah, dan penanganan berkas yatim jika penyimpanan metadata gagal. Jangan mendukung SVG, HTML, PDF, atau arsip pada tahap ini.

Gunakan bucket privat dan policy akses yang mengikuti pemilik serta status publikasi proyek/profil. Pengunjung memperoleh akses gambar hanya untuk proyek yang benar-benar publik, melalui URL bertanda tangan berumur pendek atau mekanisme server yang memeriksa izin. Tidak ada cache publik jangka panjang untuk gambar privat. Jelaskan bahwa salinan yang sudah diunduh tidak dapat ditarik kembali dan signed URL lama masih berlaku sampai kedaluwarsa. Jangan menggunakan public bucket hanya demi membuat gambar muncul.

Uji akun A dan B, anonim, draft, published, dan unpublish; periksa akses URL file selain tampilan UI. Selesaikan responsive image dan keadaan tanpa sampul. Jalankan pemeriksaan proyek dan dokumentasikan batas fitur yang ada.
```

### Prompt 5 — verifikasi lokal dan dokumentasi kelompok

```text
Audit MVP terhadap docs/AKASHIC_STARTER.md. Jangan menambah fitur baru. Perbaiki alur inti yang rusak. Tambahkan pengujian integrasi/e2e yang bernilai untuk pemisahan akun dan visibilitas draft/published, menggunakan lingkungan uji dan data sintetis. Cek anonymous request terhadap database dan akses file, bukan hanya menyembunyikan elemen UI. Jika lingkungan belum tersedia, sediakan prosedur manual dan laporkan status belum diuji.

Jalankan lint, typecheck, dan production build. Periksa halaman publik di 390 dan 1440 px, navigasi keyboard, label form, pesan error, route yang tidak ada, tautan bukti, reset password, dan status setelah reload. Pastikan tidak ada rahasia pada kode, log, bundle browser, atau git diff. Pastikan .env.local tidak terlacak dan README memiliki langkah setup, migration, auth redirect, environment variables, keterbatasan, dan akun demo sintetis bila diperlukan.

Verifikasi seluruh alur melalui localhost dengan Supabase lokal. Uji akun A, akun B, dan anonim memakai browser/profile terpisah. Siapkan README agar anggota kelompok dapat clone repo, menjalankan npm ci dari web, menyalakan Docker/Supabase, menerapkan migration, membuat akun uji, dan menjalankan Next.js. Dokumentasikan alamat layanan lokal, kotak surel uji, prosedur menghentikan layanan, serta batasan localhost. Jangan menjalankan hosting/deployment, menghubungkan layanan cloud, menambahkan tunnel publik, atau membuat auto-deploy. Status published hanya mengendalikan visibilitas dalam aplikasi lokal. Laporkan apa yang lulus, gagal, atau belum dapat diperiksa.
```

## 7. Target kerja pertama dan cara kolaborasi

**Sesi pertama selesai apabila:** tiga layar acuan ada, repo terbuka di VS Code, aplikasi lokal berjalan, dan satu profil contoh dapat membuka detail proyek. Belum perlu mengunggah laporan atau memanggil model AI.

**Target berikutnya:** satu akun menyimpan proyek, mengaktifkan tampilan publik lokalnya, dan profil dapat dibaca melalui jendela privat pada laptop yang sama. Sesudah itu kelompok melengkapi upload serta pengujian. Hosting baru dibahas apabila diminta kemudian.

Pisahkan tanggung jawab kelompok menjadi alur/desain, halaman publik, editor, serta data/auth/pengujian sesuai jumlah anggota. Sepakati rute dan nama field sebelum bekerja di berkas yang sama. Gunakan branch per fitur, commit kecil, dan tinjau perubahan sebelum menggabungkan ke branch utama. Jangan force-push untuk menyelesaikan konflik rutin.

Sebelum commit, baca `git status` dan `git diff`; tambahkan berkas yang memang ingin disimpan. Jalankan lint, pemeriksaan tipe, dan build dari folder `web`. Script sebenarnya mengikuti package.json yang dibuat, bukan asumsi bahwa semua proyek memiliki script dengan nama sama.

## 8. Pengujian manfaat produk

Setelah alur dasar berjalan, minta tiga mahasiswa menggunakan dua tugas lama masing-masing. Amati bagian formulir yang membuat mereka bingung, apakah kontribusi pribadi bisa dijelaskan, dan apakah studi kasus dapat diselesaikan tanpa bantuan kelompok. Minta satu orang yang menilai portofolio membaca hasilnya dan menjelaskan kemampuan yang ia tangkap. Data ini lebih berguna untuk laporan Manajemen Produk daripada menambah banyak tema.

## Referensi alat

Dokumentasi diperiksa 17 Oktober 2026. Paket layanan, kuota, dan API dapat berubah; gunakan versi dokumentasi yang sesuai saat implementasi.

- Figma Make, pengantar: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make
- Figma, panduan prompting bertahap: https://help.figma.com/hc/en-us/articles/31304529835671-Attach-files-to-a-prompt-in-the-Figma-agent-and-Figma-Make
- Next.js, instalasi: https://nextjs.org/docs/app/getting-started/installation
- Next.js, opsi generator: https://nextjs.org/docs/pages/api-reference/cli/create-next-app
- GitHub Copilot, paket: https://github.com/features/copilot/plans
- Supabase, Next.js quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase, SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase lokal dan Docker: https://supabase.com/docs/guides/local-development
- Supabase CLI: https://supabase.com/docs/guides/local-development/cli/getting-started

Dokumen ini adalah spesifikasi dan prompt pengerjaan, bukan laporan bahwa aplikasi atau migration sudah selesai diuji. Belum ada perubahan pada repo kelompok atau layanan yang dijalankan melalui panduan ini.
