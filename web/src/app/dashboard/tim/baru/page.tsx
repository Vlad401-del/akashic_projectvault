import type { Metadata } from "next";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { TeamPostFormComponent } from "@/components/team/team-post-form-component";
import { getDemoOwner } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pasang Pencarian Tim Baru — Akashic",
};

export const dynamic = "force-dynamic";

export default function NewTeamPostPage() {
  const owner = getDemoOwner();

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Area pemilik" />

      <main className="mx-auto max-w-[840px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <header className="mb-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
            Papan Cari Tim
          </p>
          <h1 className="mt-1.5 text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
            Pasang Pencarian Anggota Tim
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            Tentukan lomba yang ingin diikuti, bagi peran yang jelas, dan tentukan komitmen waktu agar calon rekan tim yang melamar dapat diandalkan.
          </p>
        </header>

        <TeamPostFormComponent />
      </main>
    </>
  );
}
