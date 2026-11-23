"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { TeamSearchStatus } from "@/lib/fixtures/types";
import { setTeamStatusAction } from "@/lib/team-actions";

export function TeamStatusControl({ teamId, status, slots }: { teamId: string; status: TeamSearchStatus; slots: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const next = status === "open" ? "closed" : "open";

  if (status === "closed" && slots === 0) {
    return <span className="text-[12px] text-ink-2">Kuota penuh. Ubah target anggota untuk membuka lagi.</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => {
          setMessage("");
          try {
            const result = await setTeamStatusAction(teamId, next);
            if (result.ok) {
              router.refresh();
            } else setMessage(result.message ?? "Status belum berubah.");
          } catch {
            setMessage("Status belum berubah. Coba lagi.");
          }
        })}
        className="inline-flex min-h-9 items-center rounded-lg border border-line px-3 text-[13px] font-medium text-ink hover:border-line-strong hover:text-accent disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : next === "closed" ? "Tutup pencarian" : "Buka kembali"}
      </button>
      {message ? <p role="alert" className="text-[12px] text-rose-600">{message}</p> : null}
    </div>
  );
}
