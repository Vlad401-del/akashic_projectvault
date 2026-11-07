import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PrototypeNotice } from "@/components/prototype-notice";
import { SiteBrand } from "@/components/site-brand";
import { TopBar } from "@/components/site-nav";
import { TeamCard } from "@/components/team/team-card";
import { listOpenTeamPosts } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Papan Cari Tim — Rekan Lomba Berbasis Bukti Kerja",
  description:
    "Cari rekan lomba GEMASTIK, PKM, dan hackathon dari bukti kerja nyata dan studi kasus, bukan sekadar CV.",
};

export const dynamic = "force-dynamic";

export default function TeamBoardPage() {
  const openTeams = listOpenTeamPosts();

  return (
    <>
      <TopBar
        left={
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[14px] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              Portofolio
            </Link>
            <span className="text-line-strong" aria-hidden="true">/</span>
            <span className="text-[14px] font-semibold text-ink">Cari Tim</span>
          </div>
        }
        right={
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden text-[14px] font-medium text-ink-2 transition-colors hover:text-ink sm:inline"
            >
              Area Pemilik
            </Link>
            <SiteBrand />
          </div>
        }
      />

      <main className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <PrototypeNotice className="mb-8">
          Fitur baru (Tahap Pivot): Papan cari tim lomba dari bukti kerja. Perkenalan yang dikirim disimpan di komputer ini (<code>web/.data/team-requests.json</code>).
        </PrototypeNotice>

        {/* Hero Banner */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[46rem]">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[13px] font-medium text-accent">
              <Icon name="users" className="size-3.5" />
              <span>Matching Berbasis Rekam Jejak</span>
            </div>
            <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[38px]">
              Cari rekan tim dari bukti kerja, bukan cuma CV
            </h1>
            <p className="mt-3 text-[16px] leading-[1.7] text-ink-2">
              Bosan mencari tim lomba hanya dari lingkaran yang itu-itu saja? Di Akashic, setiap pembuat tim dan pelamar menunjukkan studi kasus nyata dan komitmen jam yang jelas.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/dashboard/tim/baru"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Icon name="plus" className="size-4" />
              Pasang Pencarian Tim
            </Link>
          </div>
        </header>

        {/* Nilai Pembeda Ringkas */}
        <section aria-label="Keunggulan matching tim" className="mt-10 grid grid-cols-1 gap-4 rounded-xl border border-line bg-surface p-5 sm:grid-cols-3 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-accent">
              <Icon name="checkCircle" className="size-4" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-ink">Bukti Kerja Nyata</h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">
                Lihat apa yang pernah dibuat calon rekan di portofolio Akashic mereka sebelum mengajak.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-accent">
              <Icon name="users" className="size-4" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-ink">Peran Spesifik</h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">
                Tanggung jawab dibagi jelas sejak awal: frontend, backend, desain UI, atau analisis data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-accent">
              <Icon name="clock" className="size-4" />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-ink">Bebas &ldquo;DM Kosong&rdquo;</h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">
                Formulir perkenalan terstruktur: komitmen waktu dan kontribusi langsung disepakati.
              </p>
            </div>
          </div>
        </section>

        {/* Daftar Pencarian Tim */}
        <section aria-labelledby="heading-pencarian" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
            <h2 id="heading-pencarian" className="text-[22px] font-semibold tracking-tight text-ink">
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
                  href="/dashboard/tim/baru"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  <Icon name="plus" className="size-4" />
                  Buat Pencarian Tim
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {openTeams.map((item) => (
                <TeamCard key={item.team.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
