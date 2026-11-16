import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectRow } from "@/components/editor/project-row";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/avatar";
import { IntroReviewControls } from "@/components/team/intro-review-controls";
import { JoinTeamControl } from "@/components/team/join-team-control";
import { TeamStatusControl } from "@/components/team/team-status-control";
import { DiscussionThread } from "@/components/team/discussion-thread";
import { getDemoOwner, listOwnedProjects } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth-session";
import { getTeamDiscussion } from "@/lib/discussions";
import { listIncomingIntros, listOwnedTeamPosts } from "@/lib/teams";
import { getCloudTeamDiscussion, listCloudIncomingIntros, listCloudOwnedTeamPosts, listCloudSentIntros } from "@/lib/team-cloud";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatTeamDeadline, openSlots } from "@/lib/team-utils";

export const metadata: Metadata = {
  title: "Dasbor Pemilik — Akashic",
};

/**
 * Rute ini membaca penyimpanan lokal setiap permintaan supaya proyek dan perkenalan tim
 * yang baru disimpan langsung muncul di daftar.
 */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cloud = isSupabaseConfigured();
  const user = cloud ? await getCurrentUser() : null;
  const owner = cloud ? await getCloudOwner() : getDemoOwner();
  if (!owner) redirect("/login");
  const projects = cloud ? owner.projects : listOwnedProjects();
  const draftCount = projects.filter((project) => project.status === "draft").length;
  const publishedCount = projects.length - draftCount;

  const ownedTeams = cloud && user ? await listCloudOwnedTeamPosts(user.id) : listOwnedTeamPosts();
  const incomingIntros = cloud && user ? await listCloudIncomingIntros(user.id) : listIncomingIntros();
  const sentIntros = cloud && user ? await listCloudSentIntros(user.id) : [];
  const unreviewedCount = incomingIntros.filter((entry) => entry.review === "baru").length;
  const ownedDiscussions = await Promise.all(ownedTeams.map(async (item) => ({
    item,
    messages: cloud ? await getCloudTeamDiscussion(item.team.id) : getTeamDiscussion(item.team.id),
  })));
  const discussionMessageCount = ownedDiscussions.reduce((total, entry) => total + entry.messages.length, 0);

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/" backLabel="Halaman awal" />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        {!cloud ? <p className="mb-6 border-l-4 border-sun bg-sun-soft px-4 py-3 text-[14px] leading-6 text-ink">
          Mode pengembangan: proyek dan pencarian tim di area ini memakai profil contoh Nadia. Akun yang masuk belum memiliki ruang karya terpisah.
        </p> : null}
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
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="message" className="size-4 text-coral" />
                  {discussionMessageCount} pesan diskusi
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
              href={owner.isPublished ? `/u/${owner.username}` : "/dashboard/profile"}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong"
            >
              <Icon name="externalLink" className="size-4" />
              {owner.isPublished ? "Portofolio publik" : "Atur profil"}
            </Link>
            {cloud && owner.isPublished ? (
              <Link href="/dashboard/profile" className="inline-flex h-11 items-center rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink hover:border-line-strong">
                Atur profil
              </Link>
            ) : null}
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
                    joinedAt={entry.joinedAt}
                    contact={entry.intro.contact}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {cloud ? (
          <section aria-labelledby="pengajuan-saya-heading" className="mt-12 border-t border-line pt-8">
            <h2 id="pengajuan-saya-heading" className="text-[22px] font-semibold tracking-tight text-ink">Pengajuan Saya</h2>
            <p className="mt-1 text-[14px] text-ink-2">Pantau pengajuanmu. Setelah diterima, konfirmasi bergabung untuk mengisi slot tim.</p>
            {sentIntros.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-line bg-surface p-6">
                <p className="text-[14px] text-ink-2">Belum ada pengajuan. Cari tim yang sesuai dengan keterampilan dan waktu yang kamu punya.</p>
                <Link href="/tim" className="mt-3 inline-block text-[14px] font-semibold text-accent underline">Jelajahi papan tim</Link>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {sentIntros.map((entry) => (
                  <li key={`${entry.teamId}-${entry.sentAt}`} className="rounded-xl border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        {entry.teamVisible ? (
                          <Link href={`/tim/${entry.teamId}`} className="font-semibold text-ink hover:text-accent hover:underline">{entry.teamTitle}</Link>
                        ) : <span className="font-semibold text-ink">{entry.teamTitle}</span>}
                        <p className="mt-1 text-[13px] text-ink-2">Peran: {entry.role}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
                        entry.joinedAt ? "bg-emerald-100 text-emerald-800" :
                        entry.review === "diterima" ? "bg-amber-100 text-amber-800" :
                        entry.review === "diskusi" ? "bg-blue-100 text-blue-800" :
                        entry.review === "ditolak" ? "bg-rose-100 text-rose-700" :
                        "bg-accent/10 text-accent"
                      }`}>
                        {entry.joinedAt ? "✓ Anggota tim" : entry.review === "diskusi" ? "Sedang Diskusi" : entry.review === "diterima" ? "🎉 Diterima" : entry.review === "ditolak" ? "Ditolak" : "Diajukan"}
                      </span>
                    </div>

                    {entry.review === "diterima" && !entry.joinedAt ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
                        <p className="text-[13px] font-semibold text-amber-900">Kamu diterima ke tim ini!</p>
                        <p className="mt-0.5 text-[12px] text-amber-800">
                          Konfirmasi kesediaanmu untuk mengisi slot. Setelah dikonfirmasi, kamu resmi menjadi anggota tim.
                        </p>
                        {entry.ownerContact ? (
                          <p className="mt-2 text-[12px] text-amber-900">
                            Kontak pemilik tim{entry.ownerName ? ` (${entry.ownerName})` : ""}:{" "}
                            <span className="font-semibold">{entry.ownerContact}</span>
                          </p>
                        ) : null}
                        {entry.teamOpen ? (
                          <JoinTeamControl teamId={entry.teamId} />
                        ) : (
                          <p className="mt-2 text-[12px] text-amber-800">Pencarian sudah ditutup — hubungi pemilik langsung via kontak di atas.</p>
                        )}
                      </div>
                    ) : null}

                    {entry.joinedAt && entry.ownerContact ? (
                      <p className="mt-2 text-[12px] text-ink-2">
                        Kontak pemilik{entry.ownerName ? ` ${entry.ownerName}` : ""}:{" "}
                        <span className="font-medium text-ink">{entry.ownerContact}</span>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

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
                        <span className={team.status === "open" ? "font-semibold text-emerald-700" : "font-semibold text-ink-2"}>
                          {team.status === "open" ? "Dibuka" : "Ditutup"}
                        </span>
                        <span>·</span>
                        <span>{slots > 0 ? `Butuh ${slots} anggota lagi` : "Slot penuh"}</span>
                        <span>·</span>
                        <span>Tenggat: {formatTeamDeadline(team.deadline)}</span>
                        <span>·</span>
                        <span>{team.weeklyHours} jam/minggu</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {cloud ? <TeamStatusControl teamId={team.id} status={team.status} slots={slots} /> : null}
                      {cloud ? (
                        <Link href={`/dashboard/tim/${team.id}/edit`} className="inline-flex min-h-9 items-center rounded-lg border border-line px-3 text-[13px] font-medium text-ink hover:border-line-strong hover:text-accent">
                          Edit pencarian
                        </Link>
                      ) : null}
                      <Link
                        href={`/tim/${team.id}`}
                        className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg border border-line px-3 text-[13px] font-medium text-ink hover:border-line-strong hover:text-accent"
                      >
                        Buka Halaman Tim
                        <Icon name="arrowRight" className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bagian 3: Diskusi tim milik pemilik */}
        <section aria-labelledby="diskusi-tim-heading" className="mt-12 border-t border-line pt-8">
          <h2 id="diskusi-tim-heading" className="text-[22px] font-semibold tracking-tight text-ink">
            Diskusi Tim Saya
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">
            Baca dan balas pertanyaan calon anggota. Semua pesan dapat dibaca di halaman publik tim.
          </p>

          {ownedDiscussions.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="message" className="size-4" />
              </span>
              <p className="mt-3 text-[15px] font-medium text-ink">Belum ada tim untuk didiskusikan</p>
              <p className="mt-1 text-[13px] text-ink-2">
                Pasang pencarian tim terlebih dahulu; utas diskusinya akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {ownedDiscussions.map(({ item, messages }) => (
                <div
                  key={item.team.id}
                  className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6"
                >
                  <Link href={`/tim/${item.team.id}#diskusi`} className="mb-4 block font-semibold text-accent hover:underline">{item.team.title}</Link>
                  <DiscussionThread
                    teamId={item.team.id}
                    initialMessages={messages}
                    closed={item.team.status !== "open"}
                    accountName={cloud ? user?.name : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bagian 4: Daftar Proyek (Portofolio) */}
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
        </section>
      </div>
    </>
  );
}
