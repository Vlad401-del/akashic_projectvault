import Link from "next/link";

import { SiteBrand } from "@/components/site-brand";

/**
 * Halaman tidak ditemukan.
 *
 * Dipakai untuk username atau slug yang tidak ada, sekaligus untuk profil dan
 * proyek yang belum tampil publik. Pesannya sengaja tidak membedakan keduanya
 * agar keberadaan profil privat atau draft tidak bisa ditebak dari pesan.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:py-14">
      <SiteBrand />

      <div className="mt-10 max-w-[60ch]">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Kesalahan 404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Alamat yang Anda buka tidak tersedia. Kemungkinan tautannya salah tulis, atau profil dan proyeknya
          belum diaktifkan untuk tampil publik.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong"
        >
          Kembali ke halaman awal
        </Link>
      </div>
    </div>
  );
}
