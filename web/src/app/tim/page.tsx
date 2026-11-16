import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Icon } from "@/components/icons";
import { TeamBoard } from "@/components/team/team-board";
import { listOpenTeamPosts } from "@/lib/teams";
import { NewTeamCta, TeamPageNav } from "./team-page-nav";

export const metadata: Metadata = {
  title: "Papan Cari Tim — Rekan Lomba Berbasis Bukti Kerja",
  description:
    "Cari rekan lomba GEMASTIK, PKM, dan hackathon dari bukti kerja nyata dan studi kasus, bukan sekadar CV.",
};

// Data tim diperbarui saat ada posting baru atau perubahan status lewat revalidatePath.
// Halaman ini tidak butuh render ulang per request -- ISR 60 detik cukup.
export const revalidate = 60;

export default async function TeamBoardPage() {
  const openTeams = listOpenTeamPosts();

  return (
    <>
      <Suspense fallback={
        <div className="sticky top-0 z-30 h-14 border-b border-line/60 bg-cream/80 backdrop-blur-sm" />
      }>
        <TeamPageNav />
      </Suspense>

      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-8 sm:px-8 sm:pt-10">
        {/* Hero Banner */}
        <header className="on-dark relative isolate overflow-hidden rounded-[24px] bg-forest px-6 py-10 text-cream sm:px-10 sm:py-14">
          <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 text-cream/[0.07]" />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 -z-10 size-[320px] rounded-full border border-dashed border-sun/30"
          />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[44rem]">
              <p className="eyebrow text-sun">Matching berbasis rekam jejak</p>
              <h1 className="mt-4 text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[56px]">
                Cari rekan tim dari bukti kerja,{" "}
                <em className="font-medium italic text-sun">bukan cuma CV.</em>
              </h1>
              <p className="mt-5 max-w-[38rem] text-[16px] leading-[1.7] text-cream/75">
                Bosan mencari tim lomba hanya dari lingkaran yang itu-itu saja? Di Akashic, setiap pembuat tim dan pelamar menunjukkan studi kasus nyata dan komitmen jam yang jelas.
              </p>
            </div>

            <Suspense fallback={
              <div className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-sun/50 px-6 text-[15px] font-bold text-ink/50 self-start lg:self-auto">
                <Icon name="plus" className="size-4" />
                Pasang Pencarian Tim
              </div>
            }>
              <NewTeamCta />
            </Suspense>
          </div>
        </header>

        {/* Nilai Pembeda Ringkas */}
        <section aria-label="Keunggulan matching tim" className="mt-6 grid grid-cols-1 border-y border-ink/15 sm:grid-cols-3">
          {[
            {
              title: "Bukti Kerja Nyata",
              body: "Lihat apa yang pernah dibuat calon rekan di portofolio Akashic mereka sebelum mengajak.",
            },
            {
              title: "Peran Spesifik",
              body: "Tanggung jawab dibagi jelas sejak awal: frontend, backend, desain UI, atau analisis data.",
            },
            {
              title: "Bebas \u201cDM Kosong\u201d",
              body: "Formulir perkenalan terstruktur: komitmen waktu dan kontribusi langsung disepakati.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="flex items-start gap-4 border-ink/15 py-6 sm:px-6 sm:first:pl-0 sm:[&:not(:first-child)]:border-l [&:not(:first-child)]:border-t sm:[&:not(:first-child)]:border-t-0"
            >
              <span className="font-display text-[15px] font-semibold tabular-nums text-coral">0{index + 1}</span>
              <div>
                <h3 className="text-[19px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{item.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Daftar Pencarian Tim */}
        <section aria-labelledby="heading-pencarian" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/15 pb-4">
            <h2 id="heading-pencarian" className="text-[32px] font-semibold leading-tight text-ink">
              Pencarian Tim Terbuka
            </h2>
            <span className="text-[14px] font-medium text-ink-2">
              {openTeams.length} tim sedang mencari anggota
            </span>
          </div>

          {openTeams.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-surface p-12 text-center">
              <p className="text-[16px] font-medium text-ink">Belum ada pencarian tim yang terbuka saat ini.</p>
              <p className="mt-1 text-[14px] text-ink-2">
                Jadilah yang pertama membuat pencarian tim untuk kompetisi Anda!
              </p>
              <div className="mt-5">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  <Icon name="plus" className="size-4" />
                  Buat Pencarian Tim
                </Link>
              </div>
            </div>
          ) : (
            <Suspense fallback={<p className="mt-6 text-[14px] text-ink-2">Memuat papan tim…</p>}>
              <TeamBoard items={openTeams} />
            </Suspense>
          )}
        </section>
      </main>
    </>
  );
}
