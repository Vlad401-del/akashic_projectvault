# Konteks Lengkap Akashic Saat Ini (Untuk AI & Pengembang)

> **Ringkasan Cepat**: Akashic awalnya adalah portofolio studi kasus proyek tugas kuliah mahasiswa (*Proof of Work*). Berdasarkan kritik dosen bahwa portofolio pasif tidak memiliki diferensiasi kuat dari LinkedIn, Akashic melakukan **pivot** menjadi **Tempat Mencari Rekan Tim Lomba & Proyek (Team Finder)** berbasis **Proof of Work**. Dokumen lengkap tersimpan di [`docs/AKASHIC_SEKARANG.md`](docs/AKASHIC_SEKARANG.md).

---

## 1. Inti Masalah yang Diselesaikan (The Pivot)
- Di kampus, mahasiswa kesulitan menemukan rekan tim yang kredibel untuk lomba seperti **GEMASTIK, PKM, dan Hackathon**.
- Mahasiswa cenderung hanya mengajak teman satu sirkel karena canggung menghubungi orang baru tanpa mengetahui rekam jejaknya.
- Muncul fenomena *"Free-rider"* (penumpang gelap) di mana beban kerja kelompok hanya ditanggung segelintir orang.
- **Akashic Menyelesaikan Ini**: *"Cari rekan tim dari bukti kerja nyata, bukan sekadar klaim CV atau DM kosong."*

---

## 2. Fitur yang Sudah Selesai Dikerjakan

1. **Papan Cari Tim Publik (`/tim`)**:
   - Menampilkan kartu pencarian tim lomba aktif (mis. GEMASTIK 2027, PKM-K).
   - Menampilkan peran spesifik yang dicari, komitmen waktu (jam/minggu), tenggat, dan kartu profil pembuat tim yang terhubung langsung ke portofolio studi kasusnya.
   - Filter & pencarian: kata kunci, jenis lomba, keahlian yang dicari, dan batas jam komitmen.
2. **Detail Tim & Perkenalan Terstruktur (`/tim/[id]`)**:
   - Formulir pengajuan diri terstruktur (*Structured Intro*): Pelamar memilih peran, menjamin komitmen jam, menjelaskan apa yang dibawa, dan menyertakan tautan bukti karya (GitHub/Figma/Akashic).
   - Pengajuan tersimpan di `web/.data/team-requests.json`.
3. **Pasang Pencarian Tim Baru (`/dashboard/tim/baru`)**:
   - Pemilik tim dapat membuat posting pencarian anggota dengan rincian peran dan komitmen waktu.
4. **Dasbor Pemilik (`/dashboard`)**:
   - Menampilkan proyek portofolio, status terbit/draft.
   - Menampilkan **Pencarian Tim Saya** yang sedang aktif.
   - Menampilkan **Perkenalan Masuk (Inbox Pelamar)** dengan rincian peran, komitmen jam, dan tautan bukti karya pelamar.
   - **Review perkenalan**: tandai "Sedang Diskusi", "Diterima", atau "Ditolak", dan salin kontak pelamar (kontak wajib diisi pada formulir perkenalan).
5. **Portofolio Studi Kasus (`/u/[username]`, `/u/[username]/p/[slug]`)**:
   - Studi kasus tugas kuliah transparan (Masalah → Proses → Kontribusi Diri vs Kelompok → Hasil → Bukti Karya).

---

## 3. Cara Menjalankan

```powershell
cd web
npm run dev
```
Buka di browser: `http://localhost:3000`

- Papan Cari Tim: `http://localhost:3000/tim`
- Dasbor Pemilik & Inbox: `http://localhost:3000/dashboard`
- Contoh Portofolio: `http://localhost:3000/u/nadia`

Dokumentasi arsitektur, skema data TypeScript, dan roadmap tahap berikutnya dapat dibaca di:
👉 **[`docs/AKASHIC_SEKARANG.md`](docs/AKASHIC_SEKARANG.md)**
