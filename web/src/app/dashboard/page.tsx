import type { Metadata } from "next";
import Link from "next/link";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectRow } from "@/components/editor/project-row";
import { Icon } from "@/components/icons";
import { PrototypeNotice } from "@/components/prototype-notice";
import { Avatar } from "@/components/site-nav";
import { IntroReviewControls } from "@/components/team/intro-review-controls";
import { getDemoOwner, listOwnedProjects } from "@/lib/content";
import { listIncomingIntros, listOwnedTeamPosts, openSlots } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Dasbor Pemilik — Akashic",
};

/**
 * Rute ini membaca penyimpanan lokal setiap permintaan supaya proyek dan perkenalan tim
 * yang baru disimpan langsung muncul di daftar.
 */
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const owner = getDemoOwner();
  const projects = listOwnedProjects();
  const draftCount = projects.filter((project) => project.status === "draft").length;
  const publishedCount = projects.length - draftCount;

  const ownedTeams = listOwnedTeamPosts();
  const incomingIntros = listIncomingIntros();
  const unreviewedCount = incomingIntros.filter((entry) => entry.review === "baru").length;

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/" backLabel="Halaman awal" />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <PrototypeNotice className="mb-8">
          Area pemilik tanpa login. Data proyek dan pencarian tim disimpan di berkas lokal komputer ini
          (<code>web/.data/</code>), bukan di database, dan berlaku untuk akun contoh <strong>{owner.displayName}</strong>.
        </PrototypeNotice>

        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar displayName={owner.displayName} size="lg" />

            <div className="min-w-0">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Area pemilik</p>
              <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[34px]">
                Dasbor Saya
              </h1>
              <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.65] text-ink-2">{owner.headline}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="checkCircle" className="size-4 text-emerald-600" />
                  {publishedCount} proyek terbit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="pencil" className="size-4" />
                  {draftCount} draft
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="users" className="size-4 text-accent" />
                  {ownedTeams.length} pencarian tim
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mail" className="size-4 text-purple-600" />
                  {incomingIntros.length} perkenalan masuk
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/tim"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent"
            >
              <Icon name="users" className="size-4" />
              Papan Cari Tim
            </Link>
            <Link
              href={`/u/${owner.username}`}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong"
            >
              <Icon name="externalLink" className="size-4" />
              Portofolio publik
            </Link>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Icon name="plus" className="size-4" />
              Proyek baru
            </Link>
          </div>
        </header>

        {/* Bagian 1: Perkenalan Masuk (Pelamar Tim Berbasis Bukti Kerja) */}
        <section aria-labelledby="perkenalan-masuk-heading" className="mt-12 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="perkenalan-masuk-heading" className="text-[22px] font-semibold tracking-tight text-ink">
                  Perkenalan Masuk
                </h2>
                {unreviewedCount > 0 ? (
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-accent">
                    {unreviewedCount} belum ditinjau
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[14px] text-ink-2">
                Pengajuan dari mahasiswa yang ingin bergabung ke tim Anda dengan menyertakan bukti karya nyata.
                Tandai sebagai sedang diskusi, diterima, atau ditolak, lalu salin kontaknya untuk tindak lanjut.
              </p>
            </div>
          </div>

          {incomingIntros.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="mail" className="size-4" />
              </span>
              <p className="mt-3 text-[15px] font-medium text-ink">Belum ada perkenalan masuk</p>
              <p className="mt-1 text-[13px] text-ink-2">
                Perkenalan yang dikirim pengunjung melalui halaman detail tim Anda akan langsung muncul di sini.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {incomingIntros.map((entry) => (
                <div
                  key={`${entry.teamId}-${entry.sentAt}`}
                  className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-colors hover:border-line-strong"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-ink">
                          {entry.intro.senderName}
                        </span>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
                          Peran: {entry.intro.role}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-ink-2">
                        Untuk tim:{" "}
                        <Link
                          href={`/tim/${entry.teamId}`}
                          className="font-medium text-ink hover:text-accent hover:underline"
                        >
                          {entry.teamTitle}
                        </Link>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-2">
                        <Icon name="clock" className="size-3" />
                        {entry.intro.weeklyHours} jam/minggu
                      </span>
                      <p className="mt-1 text-[11px] text-ink-2">
                        {new Date(entry.sentAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-2 text-[14px]">
                    <div>
                      <p className="font-semibold text-ink">Apa yang dibawa:</p>
                      <p className="mt-0.5 leading-relaxed text-ink-2">{entry.intro.bring}</p>
                    </div>

                    {entry.intro.learn ? (
                      <div>
                        <p className="font-semibold text-ink">Ingin mempelajari:</p>
                        <p className="mt-0.5 leading-relaxed text-ink-2">{entry.intro.learn}</p>
                      </div>
                    ) : null}

                    {entry.intro.proofUrl ? (
                      <div className="pt-1">
                        <a
                          href={entry.intro.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                        >
                          <Icon name="externalLink" className="size-3.5" />
                          Lihat Tautan Bukti Karya Pelamar
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <IntroReviewControls
                    teamId={entry.teamId}
                    sentAt={entry.sentAt}
                    initialReview={entry.review}
                    contact={entry.intro.contact}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bagian 2: Pencarian Tim Saya */}
        <section aria-labelledby="tim-saya-heading" className="mt-12 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 id="tim-saya-heading" className="text-[22px] font-semibold tracking-tight text-ink">
                Pencarian Tim Saya
              </h2>
              <p className="mt-1 text-[14px] text-ink-2">
                Posting pencarian anggota untuk lomba atau proyek yang sedang Anda pimpin.
              </p>
            </div>

            <Link
              href="/dashboard/tim/baru"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[14px] font-medium text-ink hover:border-line-strong hover:text-accent"
            >
              <Icon name="plus" className="size-4" />
              Pasang Pencarian Baru
            </Link>
          </div>

          {ownedTeams.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="users" className="size-4" />
              </span>
              <p className="mt-3 text-[15px] font-medium text-ink">Belum ada pencarian tim</p>
              <p className="mt-1 text-[13px] text-ink-2">
                Sedang bersiap untuk GEMASTIK atau PKM? Buat pencarian tim dan tentukan peran yang Anda butuhkan.
              </p>
              <Link
                href="/dashboard/tim/baru"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-white hover:bg-accent-hover"
              >
                <Icon name="plus" className="size-3.5" />
                Buat Pencarian Tim
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {ownedTeams.map(({ team }) => {
                const slots = openSlots(team);
                return (
                  <div
                    key={team.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong sm:p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          {team.competition}
                        </span>
                        <h3 className="text-[16px] font-semibold text-ink">
                          <Link href={`/tim/${team.id}`} className="hover:text-accent hover:underline">
                            {team.title}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[13px] text-ink-2">{team.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-ink-2">
                        <span>{slots > 0 ? `Butuh ${slots} anggota lagi` : "Slot penuh"}</span>
                        <span>·</span>
                        <span>Tenggat: {team.deadline}</span>
                        <span>·</span>
                        <span>{team.weeklyHours} jam/minggu</span>
                      </div>
                    </div>

                    <Link
                      href={`/tim/${team.id}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:border-line-strong hover:text-accent"
                    >
                      Buka Halaman Tim
                      <Icon name="arrowRight" className="size-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bagian 3: Daftar Proyek (Portofolio) */}
        <section aria-labelledby="daftar-proyek-pemilik" className="mt-12 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="daftar-proyek-pemilik" className="text-[22px] font-semibold tracking-tight text-ink">
              Daftar Studi Kasus Proyek
            </h2>
            <p className="text-[14px] text-ink-2">
              Draft hanya terlihat di sini, bukan di halaman publik.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="folder" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold text-ink">Belum ada proyek</h3>
              <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-[1.65] text-ink-2">
                Mulai dari satu tugas kuliah. Judul dan ringkasan sudah cukup untuk menyimpan draft pertama.
              </p>
              <Link
                href="/dashboard/projects/new"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <Icon name="plus" className="size-4" />
                Buat proyek baru
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectRow project={project} username={owner.username} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 flex items-start gap-2 text-[14px] leading-6 text-ink-2">
            <Icon name="info" className="mt-0.5 size-4" />
            <span>
              Penyimpanannya masih berkas lokal, jadi proyek dan data tim hanya ada di komputer ini dan belum ada
              autentikasi maupun pengaturan profil pemilik. Keduanya masuk tahap Supabase.
            </span>
          </p>
        </section>
      </div>
    </>
  );
}
