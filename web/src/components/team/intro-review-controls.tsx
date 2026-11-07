"use client";

import { useState, useTransition } from "react";

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
  contact,
}: {
  teamId: string;
  sentAt: string;
  initialReview: IntroReviewStatus;
  contact?: string;
}) {
  const [review, setReview] = useState<IntroReviewStatus>(initialReview);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleReview(next: IntroReviewStatus) {
    setError(null);
    startTransition(async () => {
      const result = await reviewTeamIntroAction(teamId, sentAt, next);
      if (result.ok) {
        setReview(result.review);
      } else {
        setError(result.message);
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
          {meta.label}
        </span>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ubah status perkenalan">
          {ACTIONS.map((action) => (
            <button
              key={action.status}
              type="button"
              disabled={isPending || review === action.status}
              onClick={() => handleReview(action.status)}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent disabled:cursor-default disabled:opacity-50"
            >
              <Icon name={action.icon} className="size-3" />
              {action.label}
            </button>
          ))}
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