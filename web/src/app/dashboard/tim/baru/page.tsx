import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { TeamPostFormComponent } from "@/components/team/team-post-form-component";
import { getDemoOwner } from "@/lib/content";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Pasang Pencarian Tim Baru — Akashic",
};

export const dynamic = "force-dynamic";

export default async function NewTeamPostPage() {
  const cloud = isSupabaseConfigured();
  const owner = cloud ? await getCloudOwner() : getDemoOwner();
  if (!owner) redirect("/login");
  const ready = !cloud || owner.isPublished;

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

        {!ready ? (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-[14px] leading-6 text-amber-950">
            <p className="font-semibold">Terbitkan profil sebelum memasang pencarian.</p>
            <p className="mt-1">Calon anggota perlu mengenali pembuat tim. Studi kasus proyek dapat kamu tambahkan untuk membantu mereka menilai pengalamanmu.</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-semibold underline underline-offset-2">
              <Link href="/dashboard/profile">Atur profil publik</Link>
            </div>
          </div>
        ) : null}

        {ready ? <TeamPostFormComponent /> : null}
      </main>
    </>
  );
}
