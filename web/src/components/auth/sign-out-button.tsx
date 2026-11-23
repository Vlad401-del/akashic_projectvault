"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";

import { Icon } from "@/components/icons";
import { logoutAction } from "@/lib/auth-actions";

/** Tombol keluar sesi lokal; dipakai di bilah atas area pemilik. */
export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <div className="relative shrink-0">
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        setError("");
        try { const result = await logoutAction(); setError(result.error); }
        catch (error) { unstable_rethrow(error); setError("Belum berhasil keluar. Periksa koneksi lalu coba lagi."); }
      })}
      aria-busy={isPending}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[13px] font-semibold text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
    >
      <Icon name="arrowLeft" className="size-4" />
      {isPending ? "Keluar..." : "Keluar"}
    </button>
    {error ? <p role="alert" className="absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-lg border border-danger/30 bg-canvas p-3 text-sm text-danger shadow-lg">{error}</p> : null}
    </div>
  );
}
