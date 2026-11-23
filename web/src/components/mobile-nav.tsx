"use client";

import Link from "next/link";
import { useRef } from "react";

export function MobileNav({ dark = false }: { dark?: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={menu} className="relative shrink-0 md:hidden" onKeyDown={(event) => {
      if (event.key === "Escape" && menu.current) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary className={`flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border px-3 text-sm font-semibold [&::-webkit-details-marker]:hidden ${dark ? "border-cream/30 text-cream" : "border-line-strong text-ink"}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        <span className="sr-only min-[360px]:not-sr-only">Menu</span>
      </summary>
      <nav aria-label="Navigasi ponsel" className="absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-2.5rem)] rounded-xl border border-line bg-canvas p-2 text-ink shadow-lg">
        {[
          { href: "/#cara-kerja", label: "Cara kerja" },
          { href: "/#karya", label: "Karya" },
          { href: "/#lomba", label: "Lomba" },
          { href: "/tim", label: "Cari tim" },
        ].map((link) => <Link key={link.href} href={link.href} onClick={() => { if (menu.current) menu.current.open = false; }} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-accent-soft">{link.label}</Link>)}
      </nav>
    </details>
  );
}
