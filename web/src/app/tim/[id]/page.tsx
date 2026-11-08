import { notFound } from "next/navigation";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { PrototypeNotice } from "@/components/prototype-notice";
import { Avatar, TopBar } from "@/components/site-nav";
import { IntroFormComponent } from "@/components/team/intro-form-component";
import { getPublicProfile } from "@/lib/content";
import { getTeamPost, listKnownTeamIds } from "@/lib/teams";
import { openSlots, roleSkillsLabel } from "@/lib/team-utils";

export function generateStaticParams() {
  return listKnownTeamIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getTeamPost(id);

  if (!item) {
    return { title: "Pencarian Tim Tidak Ditemukan" };
  }

  return {
    title: `${item.team.title} — Cari Tim Akashic`,
    description: item.team.summary,
  };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getTeamPost(id);

  if (!item) {
    notFound();
  }

  const { team, owner } = item;
  const ownerProfile = getPublicProfile(owner.username);
  const slots = openSlots(team);

  return (
    <>
      <TopBar
        left={
          <div className="flex items-center gap-2 text-[14px]">
            <Link
              href="/tim"
              className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-hover"
            >
              <Icon name="arrowLeft" className="size-4" />
              Kembali ke papan tim
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <PrototypeNotice className="mb-8">
          Halaman pencarian tim publik. Pengajuan diri melalui formulir di bawah akan tersimpan di{" "}
          <code>web/.data/team-requests.json</code> dan dapat dibuka oleh pemilik tim di dasbornya.
        </PrototypeNotice>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Kolom Kiri / Utama: Detail Tim & Formulir */}
          <div className="space-y-8 lg:col-span-8">
            <article className="rounded-xl border border-line bg-surface p-6 sm:p-8">
              {/* Badge & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-md bg-accent/10 px-3 py-1 text-[13px] font-semibold text-accent">
                  {team.competition}
                </span>

                {team.status === "open" ? (
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {slots > 0 ? `Terbuka · Butuh ${slots} anggota lagi` : "Terbuka · Meninjau perkenalan"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-2">
                    <span className="size-2 rounded-full bg-ink-2" />
                    Pencarian Ditutup
                  </span>
                )}
              </div>

              {/* Judul Tim */}
              <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">
                {team.title}
              </h1>

              {/* Ringkasan Ide */}
              <div className="mt-6 border-t border-line/60 pt-5">
                <h2 className="text-[14px] font-semibold uppercase tracking-[0.05em] text-ink-2">
                  Ide Proyek & Masalah yang Ingin Dipecahkan
                </h2>
                <p className="mt-2 text-[16px] leading-[1.75] text-ink">
                  {team.summary}
                </p>
              </div>

              {/* Rincian Peran */}
              <div className="mt-8 border-t border-line/60 pt-6">
                <h2 className="text-[18px] font-semibold text-ink">
                  Peran yang Dicari di Tim Ini
                </h2>
                <p className="mt-1 text-[14px] text-ink-2">
                  Pilihlah salah satu peran di bawah yang sesuai dengan keahlian atau minat belajar Anda.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {team.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-line bg-canvas p-4"
                    >
                      <h3 className="text-[15px] font-semibold text-ink">{role.title}</h3>
                      <p className="mt-1 text-[13px] text-ink-2">
                        Keahlian: <span className="font-medium text-ink">{roleSkillsLabel(role)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameter Kerja Tim */}
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-line/60 pt-6 sm:grid-cols-3">
                <div className="rounded-lg border border-line bg-canvas p-3.5">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
                    <Icon name="clock" className="size-3.5 text-accent" />
                    Komitmen Waktu
                  </span>
                  <p className="mt-1 text-[14px] font-semibold text-ink">
                    {team.weeklyHours > 0 ? `${team.weeklyHours} jam/minggu` : "Fleksibel"}
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-canvas p-3.5">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
                    <Icon name="calendar" className="size-3.5 text-accent" />
                    Tenggat Pendaftaran
                  </span>
                  <p className="mt-1 text-[14px] font-semibold text-ink">
                    {team.deadline}
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-canvas p-3.5">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
                    <Icon name="users" className="size-3.5 text-accent" />
                    Ukuran Tim
                  </span>
                  <p className="mt-1 text-[14px] font-semibold text-ink">
                    {team.currentMembers} dari {team.targetMembers} orang
                  </p>
                </div>
              </div>

              {team.meetingNote ? (
                <div className="mt-4 rounded-lg bg-canvas p-3.5 text-[13px] text-ink-2">
                  <strong className="text-ink">Ritme komunikasi:</strong> {team.meetingNote}
                </div>
              ) : null}
            </article>

            {/* Formulir Perkenalan Terstruktur */}
            {team.status === "open" ? (
              <section id="ajukan-diri">
                <IntroFormComponent
                  teamId={team.id}
                  teamTitle={team.title}
                  roles={team.roles}
                  ownerDisplayName={owner.displayName}
                />
              </section>
            ) : (
              <div className="rounded-xl border border-line bg-surface p-8 text-center">
                <p className="text-[16px] font-semibold text-ink">Pencarian tim ini sudah ditutup.</p>
                <p className="mt-1 text-[14px] text-ink-2">
                  Seluruh slot peran untuk tim ini telah terisi. Silakan cari tim lain di papan pencarian.
                </p>
                <div className="mt-4">
                  <Link
                    href="/tim"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Lihat Tim Lain
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan / Sidebar: Profil Pembuat Tim (Proof of Work) */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-2">
                Pembuat Pencarian Tim
              </p>

              <div className="mt-4 flex items-start gap-3.5">
                <Avatar displayName={owner.displayName} size="sm" />
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold text-ink">
                    <Link
                      href={`/u/${owner.username}`}
                      className="hover:text-accent hover:underline"
                    >
                      {owner.displayName}
                    </Link>
                  </h3>
                  <p className="text-[13px] text-ink-2">@{owner.username}</p>
                </div>
              </div>

              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                {owner.headline}
              </p>

              {ownerProfile?.bio ? (
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2/80">
                  &ldquo;{ownerProfile.bio}&rdquo;
                </p>
              ) : null}

              {ownerProfile?.skills && ownerProfile.skills.length > 0 ? (
                <div className="mt-4 border-t border-line/60 pt-3">
                  <p className="text-[12px] font-semibold text-ink-2">Keahlian:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ownerProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-canvas px-2 py-0.5 text-[12px] text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 border-t border-line pt-4">
                <Link
                  href={`/u/${owner.username}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-canvas px-4 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent"
                >
                  <Icon name="externalLink" className="size-4" />
                  Lihat Portofolio & Bukti Karya
                </Link>
                <p className="mt-2 text-center text-[12px] text-ink-2">
                  Verifikasi proyek & studi kasus sebelum memutuskan bergabung.
                </p>
              </div>
            </div>

            {/* Kotak Pengingat Etika Kolaborasi */}
            <div className="rounded-xl border border-line bg-canvas p-5 text-[13px] leading-relaxed text-ink-2">
              <strong className="block font-semibold text-ink">Kenapa Akashic?</strong>
              <p className="mt-1">
                Lomba kampus seperti GEMASTIK dan PKM membutuhkan komitmen nyata. Dengan mencantumkan peran dan bukti kerja di awal, Anda terhindar dari kerja kelompok di mana hanya 1 orang yang bekerja.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
