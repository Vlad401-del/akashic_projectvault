import Link from "next/link";
import type { ReactNode } from "react";

import { Avatar } from "@/components/avatar";
import { SiteBrand } from "@/components/site-brand";
import { getCurrentUser } from "@/lib/auth-session";
import { firstName } from "@/lib/text";

/** Navigasi akun mengikuti sesi: tombol masuk atau identitas pemilik. */
export async function AccountNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const user = await getCurrentUser();

  if (user) {
    return (
      <Link
        href="/dashboard"
        aria-label={`Buka area akun ${user.name}`}
        className={`inline-flex min-h-10 max-w-[11rem] items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors sm:max-w-[13rem] ${
          dark
            ? "border-cream/25 bg-cream/10 text-cream hover:bg-cream/20"
            : "border-line-strong bg-surface text-ink hover:border-accent hover:bg-accent-soft"
        }`}
      >
        <Avatar displayName={user.name} />
        <span className="truncate text-[13px] font-semibold sm:text-[14px]">{firstName(user.name)}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex min-h-10 items-center rounded-lg bg-sun px-4 text-[14px] font-bold text-ink transition-colors hover:bg-sun-soft"
    >
      Masuk
    </Link>
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
              <AccountNav />
              <span className="hidden sm:inline-flex"><SiteBrand /></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
