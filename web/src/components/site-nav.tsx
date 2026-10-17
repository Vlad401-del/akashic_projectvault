import type { ReactNode } from "react";

import { SiteBrand } from "@/components/site-brand";
import type { Profile } from "@/lib/fixtures/types";
import { initials } from "@/lib/text";

/** Lingkaran inisial nama. Dipakai di bilah atas dan header profil. */
export function Avatar({ displayName, size = "sm" }: { displayName: string; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "size-20 text-[26px] sm:size-24 sm:text-[30px]" : "size-8 text-[12px]";

  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-white ${sizeClass}`}>
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
 * berisi merek Akashic. Bilah ini menempel di atas saat halaman digulir.
 */
export function TopBar({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-0">
        <div className="flex min-w-0 items-center gap-3">{left}</div>
        <div className="flex items-center gap-3">{right ?? <SiteBrand />}</div>
      </div>
    </div>
  );
}
