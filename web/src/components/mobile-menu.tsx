"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icons";

export type MobileMenuLink = {
  label: string;
  href: string;
  /** Jika true, tombol ditampilkan sebagai pill penuh warna. */
  primary?: boolean;
};

/**
 * Tombol hamburger + drawer navigasi untuk layar kecil.
 *
 * Muncul hanya di bawah breakpoint `sm` (640 px). Menerima daftar tautan
 * yang sama dengan yang ada di navbar desktop supaya kontennya selalu sinkron.
 */
export function MobileMenu({
  links,
  tone = "light",
}: {
  links: MobileMenuLink[];
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);

  const isDark = tone === "dark";

  const buttonBase = isDark
    ? "text-cream/80 hover:text-cream"
    : "text-ink-2 hover:text-ink";

  return (
    <div className="sm:hidden">
      {/* Tombol hamburger */}
      <button
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex size-10 items-center justify-center rounded-lg transition-colors ${buttonBase}`}
      >
        <Icon name={open ? "x" : "list"} className="size-5" />
      </button>

      {/* Drawer overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Panel menu */}
      <nav
        aria-label="Navigasi mobile"
        className={`fixed right-0 top-16 z-50 w-64 rounded-bl-2xl border-b border-l shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${
          isDark
            ? "border-cream/10 bg-forest text-cream"
            : "border-line bg-canvas text-ink"
        }`}
      >
        <ul className="flex flex-col p-3">
          {links.map((link) =>
            link.primary ? (
              <li key={link.href} className="mt-2 px-1">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-11 w-full items-center justify-center rounded-full text-[15px] font-bold transition-colors ${
                    isDark
                      ? "bg-sun text-ink hover:bg-sun/90"
                      : "bg-accent text-white hover:bg-accent-hover"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-11 items-center rounded-lg px-3 text-[15px] font-medium transition-colors ${
                    isDark
                      ? "hover:bg-cream/10 hover:text-cream"
                      : "hover:bg-surface hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
