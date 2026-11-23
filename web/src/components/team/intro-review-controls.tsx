"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Icon, type IconName } from "@/components/icons";
import type { IntroReviewStatus } from "@/lib/fixtures/types";
import { reviewTeamIntroAction } from "@/lib/team-actions";

const STATUS_META: Record<
  IntroReviewStatus,
  { label: string; badgeClass: string }
> = {
  baru: { label: "Baru", badgeClass: "bg-accent/10 text-accent" },
  diskusi: { label: "Sedang Diskusi", badgeClass: "bg-amber-100 text-amber-800" },
  diterima: { label: "Diterima", badgeClass: "bg-emerald-100 text-emerald-800" },
  ditolak: { label: "Ditolak", badgeClass: "bg-rose-100 text-rose-700" },
};

const ACTIONS: { status: IntroReviewStatus; label: string; icon: IconName }[] = [
  { status: "diskusi", label: "Sedang Diskusi", icon: "clock" },
  { status: "diterima", label: "Terima", icon: "check" },
  { status: "ditolak", label: "Tolak", icon: "x" },
];

/**
 * Kontrol tinjauan satu perkenalan masuk: badge status, tombol ubah status,
 * dan tombol salin kontak pelamar. Status selalu disertai label teks, bukan
 * hanya warna.
 */
export function IntroReviewControls({
  teamId,
  sentAt,
  initialReview,
  joinedAt,
  contact,
}: {
  teamId: string;
  sentAt: string;
  initialReview: IntroReviewStatus;
  joinedAt?: string | null;
  contact?: string;
}) {
  const router = useRouter();
  const [review, setReview] = useState<IntroReviewStatus>(initialReview);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleReview(next: IntroReviewStatus) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await reviewTeamIntroAction(teamId, sentAt, next);
        if (result.ok) {
          setReview(result.review);
          router.refresh();
        } else {
          setError(result.message);
        }
      } catch {
        setError("Status belum dapat disimpan. Periksa koneksi, lalu coba lagi.");
      }
    });
  }

  async function handleCopy() {
    if (!contact) {
      return;
    }

    try {
      await navigator.clipboard.writeText(contact);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Tidak dapat menyalin ke clipboard; salin manual dari teks kontak.");
    }
  }

  const meta = STATUS_META[review];

  return (
    <div className="mt-4 border-t border-line/60 pt-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${meta.badgeClass}`}
        >
          {joinedAt || review === "diterima" ? "Anggota tim" : meta.label}
        </span>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ubah status perkenalan">
          {ACTIONS.map((action) => {
            // Acceptance fills a seat immediately and cannot be downgraded.
            const lockedAfterAccept = review === "diterima" && action.status !== "diterima";
            return (
              <button
                key={action.status}
                type="button"
                disabled={isPending || Boolean(joinedAt) || review === action.status || lockedAfterAccept}
                title={lockedAfterAccept ? "Status tidak bisa diubah setelah pelamar diterima" : undefined}
                onClick={() => handleReview(action.status)}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent disabled:cursor-default disabled:opacity-50"
              >
                <Icon name={action.icon} className="size-3" />
                {action.label}
              </button>
            );
          })}
        </div>

        {contact ? (
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent"
          >
            <Icon name={copied ? "check" : "mail"} className="size-3" />
            {copied ? "Kontak tersalin" : "Salin kontak"}
          </button>
        ) : null}
      </div>

      {review === "diterima" ? (
        <p className="mt-2 text-[13px] text-ink-2" role="status">
          Pelamar sudah menjadi anggota tim. Jumlah anggota otomatis bertambah dan pencarian ditutup ketika kuota terpenuhi.
        </p>
      ) : null}

      {contact ? (
        <p className="mt-2 text-[13px] text-ink-2">
          Kontak pelamar: <span className="font-medium text-ink">{contact}</span>
        </p>
      ) : (
        <p className="mt-2 text-[13px] text-ink-2">
          Perkenalan ini dikirim sebelum kolom kontak tersedia.
        </p>
      )}

      {error ? (
        <p className="mt-2 text-[13px] font-medium text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
