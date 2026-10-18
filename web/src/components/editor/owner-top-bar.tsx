import Link from "next/link";

import { Icon } from "@/components/icons";
import { OwnerChip, TopBar } from "@/components/site-nav";
import type { Profile } from "@/lib/fixtures/types";

/**
 * Bilah atas area pemilik.
 *
 * Sisi kiri berisi tautan kembali dan sisi kanan berisi penanda akun pemilik,
 * supaya jelas bahwa halaman ini bukan halaman yang dilihat pengunjung.
 */
export function OwnerTopBar({
  owner,
  backHref,
  backLabel,
}: {
  owner: Profile;
  backHref: string;
  backLabel: string;
}) {
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
      right={<OwnerChip profile={owner} />}
    />
  );
}
