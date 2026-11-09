import Link from "next/link";
import type { ReactNode } from "react";

import { SiteBrand } from "@/components/site-brand";
import type { Profile } from "@/lib/fixtures/types";
import { initials } from "@/lib/text";

/** Lingkaran inisial nama. Dipakai di bilah atas dan header profil. */
export function Avatar({ displayName, size = "sm" }: { displayName: string; size?: "sm" | "lg" }) {
  const sizeClass =
    size === "lg" ? "size-20 text-[28px] sm:size-24 sm:text-[32px]" : "size-8 text-[12px]";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-forest font-display font-semibold text-sun ring-2 ring-surface ${sizeClass}`}
    >
      {initials(displayName)}
    </span>
  );
}

/** Penanda pemilik portofolio di bilah atas: avatar kecil + nama. */
export function OwnerChip({ profile }: { profile: Profile }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar displayName={profile.displayName} />
      <span className="truncate text-[15px] font-semibold text-ink">{profile.displayName}</span>
    </span>
  );
}

/**
 * Bilah atas halaman publik.
 *
 * Sisi kiri berisi penanda halaman (pemilik atau tautan kembali) dan sisi kanan
 * berisi navigasi dan merek Akashic. Bilah ini menempel di atas saat halaman digulir.
 */
export function TopBar({
  left,
  right,
  tone = "light",
}: {
  left: ReactNode;
  right?: ReactNode;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={`sticky top-0 z-30 border-b ${
        isDark
          ? "on-dark border-cream/10 bg-forest text-cream"
          : "border-line bg-canvas"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">{left}</div>
        <div className="flex items-center gap-4">
          {right ?? (
            <div className="flex items-center gap-4 sm:gap-5">
              <Link
                href="/tim"
                className="link-underline hidden text-[14px] font-semibold text-ink-2 transition-colors hover:text-ink sm:inline"
              >
                Cari Tim
              </Link>
              <Link
                href="/login"
                className="link-underline text-[14px] font-semibold text-ink-2 transition-colors hover:text-ink"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-full bg-sun px-4 text-[13px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Daftar
              </Link>
              <SiteBrand />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
