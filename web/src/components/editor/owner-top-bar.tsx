import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Icon } from "@/components/icons";
import { OwnerChip } from "@/components/avatar";
import { TopBar } from "@/components/site-nav";
import { getCurrentUser } from "@/lib/auth-session";
import type { Profile } from "@/lib/fixtures/types";

/**
 * Bilah atas area pemilik.
 *
 * Sisi kiri berisi tautan kembali dan sisi kanan berisi penanda akun pemilik,
 * supaya jelas bahwa halaman ini bukan halaman yang dilihat pengunjung.
 * Bila ada sesi masuk lokal, tombol keluar ikut ditampilkan.
 */
export async function OwnerTopBar({
  owner,
  backHref,
  backLabel,
}: {
  owner: Profile;
  backHref: string;
  backLabel: string;
}) {
  const user = await getCurrentUser();

  return (
    <TopBar
      showMobileMenu={false}
      left={
        <Link
          href={backHref}
          className="inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
        >
          <Icon name="arrowLeft" className="size-[18px] shrink-0" />
          <span className="sm:hidden">{backHref === "/" ? "Beranda" : backHref === "/dashboard" ? "Dasbor" : backLabel}</span>
          <span className="hidden truncate sm:inline">{backLabel}</span>
        </Link>
      }
      right={
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <OwnerChip profile={owner} compactOnSmallScreens />
          {user ? <SignOutButton /> : null}
        </div>
      }
    />
  );
}
