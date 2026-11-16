"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { confirmTeamJoinAction } from "@/lib/team-actions";

export function JoinTeamControl({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return <button type="button" onClick={() => setConfirming(true)} className="mt-3 rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-white">
      Konfirmasi bergabung
    </button>;
  }

  return <div className="mt-3 rounded-lg border border-line bg-canvas p-3 text-[13px] text-ink">
    <p>Setelah dikonfirmasi, kamu mengisi satu slot tim. Pastikan kamu sudah menyepakati komitmen dengan pemilik tim.</p>
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" disabled={pending} onClick={() => startTransition(async () => {
        setError("");
        try {
          const result = await confirmTeamJoinAction(teamId);
          if (result.ok) router.refresh();
          else setError(result.message ?? "Belum bisa bergabung.");
        } catch {
          setError("Belum bisa bergabung. Periksa koneksi lalu coba lagi.");
        }
      })} className="rounded-lg bg-accent px-3 py-2 font-semibold text-white disabled:opacity-60">
        {pending ? "Mengonfirmasi..." : "Ya, saya bergabung"}
      </button>
      <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="rounded-lg border border-line px-3 py-2">Batal</button>
    </div>
    {error ? <p role="alert" className="mt-2 text-danger">{error}</p> : null}
  </div>;
}
