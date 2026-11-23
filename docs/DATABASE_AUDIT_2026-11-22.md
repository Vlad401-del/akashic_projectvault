# Audit database Akashic — 22 November 2026

## Cakupan yang diperiksa

Delapan tabel public: profiles, projects, project_sources, project_images, team_posts, team_roles, team_intros, team_discussions. Pemeriksaan mencakup RLS, foreign key, check/unique constraints, fungsi berprivilege, bucket project-covers, indeks, dan advisor Supabase.

## Perbaikan diterapkan

- INSERT pengajuan sekarang wajib review=baru dan joined_at kosong. Sebelumnya klien langsung berpotensi memasukkan review=diterima.
- Constraint proyek menolak alamat sampul unggahan akun lain.
- SELECT gambar publik mensyaratkan pemilik proyek sama dengan folder pemilik gambar, proyek published, dan profil published.
- Tiga indeks untuk foreign key diskusi/pengajuan dan indeks ekspresi alamat sampul proyek terbit.
- Migrasi: 20261122053308_audit_access_and_cover_integrity.sql, sudah diterapkan di Supabase.

## Bukti uji

- Semua delapan tabel public mengaktifkan RLS.
- Transaksi peran authenticated: INSERT pengajuan dengan status diterima ditolak; UPDATE proyek akun lain memengaruhi nol baris. Transaksi dibatalkan.
- Peran anon: nol draft dan nol profil privat terlihat.
- Sampul draft akun lain: nol objek terlihat pada pengujian sebelumnya.
- Pemeriksaan integritas: nol tim melebihi kuota; nol tim penuh berstatus open; nol anggota joined berstatus selain diterima; nol pengajuan duplikat; nol sampul unggahan dengan pemilik berbeda.
- Fungsi berprivilege yang diperiksa memiliki search_path kosong.

## Belum selesai / batas audit

- Perlindungan sandi bocor Supabase belum aktif.
- Dua policy UPDATE pengajuan merupakan jalur pemilik dan pelamar; advisor masih memperingatkan evaluasi ganda. Ini belum dioptimalkan; trigger tetap mengunci transisi status.
- Indeks baru belum memiliki riwayat penggunaan; jangan dihapus hanya karena advisor menyebut unused.
- Pembuatan tim beserta peran dan penyimpanan proyek beserta sumber masih berupa beberapa permintaan database. Atomic RPC dan uji kegagalan parsial belum dilakukan.
- Penerimaan bersamaan oleh dua tab belum diuji; pemeriksaan reservasi slot di server masih read-then-update. Konfirmasi bergabung sendiri memakai UPDATE atomik yang mencegah tim melebihi kuota.
- Berkas sampul yang diunggah lalu tidak dipakai/diganti belum memiliki pembersihan otomatis dan kuota total per akun. Batas tiap berkas 3 MB saja belum membatasi total penyimpanan.
- Pemeriksaan signature MIME unggahan bukan decoding ulang gambar. Uji berkas rusak, batas dimensi, dan transfer Storage nyata masih diperlukan.
- Audit ini bukan bukti semua jalur bebas kesalahan atau pengganti pengujian penetrasi. Tidak ada data pengguna yang dihapus sebagai bagian audit.
