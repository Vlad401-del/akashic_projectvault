"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@/components/icons";

/**
 * Tombol kembali yang pakai browser history (router.back()).
 * Fallback ke /tim bila tidak ada history (misalnya dibuka dari tab baru).
 */
export function BackButton({ fallback = "/tim" }: { fallback?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-2 transition-colors hover:text-ink"
      aria-label="Kembali ke halaman sebelumnya"
    >
      <Icon name="arrowLeft" className="size-4" />
      Kembali
    </button>
  );
}
