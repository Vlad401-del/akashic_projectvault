import Link from "next/link";

import { MobileMenu } from "@/components/mobile-menu";
import { SiteBrand } from "@/components/site-brand";
import { TopBar } from "@/components/site-nav";
import { getCurrentUser } from "@/lib/auth-session";

/**
 * Bagian navigasi halaman /tim yang butuh data sesi user.
 * Dirender terpisah dalam Suspense agar konten utama (daftar tim) bisa di-cache.
 */
export async function TeamPageNav() {
  const user = await getCurrentUser();
  const newTeamHref = user ? "/dashboard/tim/baru" : "/register";

  return (
    <TopBar
      left={
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="link-underline text-[14px] font-semibold text-ink-2 transition-colors hover:text-ink"
          >
            Beranda
          </Link>
          <span className="text-line-strong" aria-hidden="true">/</span>
          <span className="text-[14px] font-semibold text-ink">Cari Tim</span>
        </div>
      }
      right={
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 text-[14px] font-semibold text-ink-2 transition-colors hover:text-ink sm:flex"
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-forest font-display text-[11px] font-semibold text-sun"
              >
                {user.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </span>
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[14px] font-medium text-ink-2 transition-colors hover:text-ink sm:inline"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="hidden h-9 items-center rounded-full bg-sun px-4 text-[13px] font-bold text-ink transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                Daftar
              </Link>
            </>
          )}
          <SiteBrand />
          <MobileMenu
            tone="light"
            links={[
              { label: "Beranda", href: "/" },
              ...(user
                ? [{ label: `Dashboard (${user.name.split(" ")[0]})`, href: "/dashboard" }]
                : [
                    { label: "Masuk", href: "/login" },
                    { label: "Daftar", href: "/register", primary: true as const },
                  ]),
              { label: "Pasang pencarian tim", href: newTeamHref, primary: true as const },
            ]}
          />
        </div>
      }
    />
  );
}

/**
 * Tombol CTA "Pasang Pencarian Tim" di hero banner yang bergantung pada status login.
 * Dirender terpisah dalam Suspense.
 */
export async function NewTeamCta() {
  const user = await getCurrentUser();
  const href = user ? "/dashboard/tim/baru" : "/register";
  return (
    <Link
      href={href}
      className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-sun px-6 text-[15px] font-bold text-ink shadow-[4px_4px_0_0_#0b1a13] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0b1a13] lg:self-auto"
    >
      Pasang Pencarian Tim
    </Link>
  );
}
