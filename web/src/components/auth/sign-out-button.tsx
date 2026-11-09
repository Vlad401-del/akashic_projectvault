"use client";

import { useTransition } from "react";

import { Icon } from "@/components/icons";
import { logoutAction } from "@/lib/auth-actions";

/** Tombol keluar sesi lokal; dipakai di bilah atas area pemilik. */
export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[13px] font-semibold text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
    >
      <Icon name="arrowLeft" className="size-4" />
      {isPending ? "Keluar..." : "Keluar"}
    </button>
  );
}