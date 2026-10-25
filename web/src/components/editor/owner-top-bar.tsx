import Link from "next/link";

import { Icon } from "@/components/icons";
import { OwnerChip, TopBar } from "@/components/site-nav";
import type { Profile } from "@/lib/fixtures/types";
import { signOutAction } from "@/lib/auth-actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
      right={
        <div className="flex items-center gap-3">
          <OwnerChip profile={owner} />
          {isSupabaseConfigured() ? <form action={signOutAction}><button type="submit" className="text-sm font-medium text-ink-2 hover:text-accent">Keluar</button></form> : null}
        </div>
      }
    />
  );
}
