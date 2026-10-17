import Link from "next/link";

import { Icon } from "@/components/icons";
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
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14 xl:px-0">
      <SiteBrand />

      <div className="mt-10 max-w-[60ch]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Kesalahan 404</p>
        <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-ink sm:text-[32px]">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-[17px] leading-[1.7] text-ink-2">
          Alamat yang Anda buka tidak tersedia. Kemungkinan tautannya salah tulis, atau profil dan proyeknya
          belum diaktifkan untuk tampil publik.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Icon name="arrowLeft" className="size-4" />
          Kembali ke halaman awal
        </Link>
      </div>
    </div>
  );
}
