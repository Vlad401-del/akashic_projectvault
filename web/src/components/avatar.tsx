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
