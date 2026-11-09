import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Icon } from "@/components/icons";
import { OwnerChip, TopBar } from "@/components/site-nav";
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
      left={
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
        >
          <Icon name="arrowLeft" className="size-[18px]" />
          {backLabel}
        </Link>
      }
      right={
        <div className="flex items-center gap-3">
          <OwnerChip profile={owner} />
          {user ? <SignOutButton /> : null}
        </div>
      }
    />
  );
}
