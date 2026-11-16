import Link from "next/link";

import { Icon } from "@/components/icons";
import { Avatar } from "@/components/avatar";
import type { TeamPostWithOwner } from "@/lib/teams";
import { formatTeamDeadline, openSlots, roleSkillsLabel } from "@/lib/team-utils";

/**
 * Kartu posting pencarian anggota tim untuk papan `/tim`.
 *
 * Mengikuti filosofi "Proof of Work": kartu menonjolkan peran yang dicari,
 * komitmen waktu yang jelas, serta profil pemilik yang memiliki rekam jejak
 * studi kasus di Akashic.
 */
export function TeamCard({ item, example = false }: { item: TeamPostWithOwner; example?: boolean }) {
  const { team, owner } = item;
  const slots = openSlots(team);
  const detailHref = example ? `/tim/contoh-${team.id}` : `/tim/${team.id}`;

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[18px] p-5 sm:p-6">
      {/* Baris Atas: Kompetisi & Slot Tersedia */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-coral px-2.5 py-1 text-[12px] font-bold text-ink">
          {team.competition}
        </span>

        {team.status === "open" ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
            <span className="size-2 rounded-full bg-accent" />
            {slots > 0 ? `Butuh ${slots} anggota lagi` : "Slot sedang ditinjau"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2">
            <span className="size-2 rounded-full bg-ink-2" />
            Pencarian ditutup
          </span>
        )}
      </div>

      {example ? <p className="mt-3 text-[12px] font-semibold text-ink-2">Contoh tampilan · data fiktif</p> : null}

      {/* Judul & Tautan */}
      <h3 className="mt-4 text-[22px] font-semibold leading-[1.15] text-ink">
        <Link
          href={detailHref}
          className="rounded hover:text-accent hover:underline"
        >
          {team.title}
        </Link>
      </h3>

      {/* Ringkasan Ide */}
      <p className="mt-2 line-clamp-3 text-[15px] leading-[1.65] text-ink-2">
        {team.summary}
      </p>

      {/* Peran yang Dicari */}
      <div className="mt-4 border-t border-line/60 pt-3.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-2">
          Peran yang dicari:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {team.roles.map((role, idx) => (
            <div
              key={idx}
              className="rounded-full border border-ink/15 bg-sun-soft/60 px-2.5 py-1 text-[13px]"
            >
              <span className="font-medium text-ink">{role.title}</span>
              {role.skills.length > 0 ? (
                <span className="text-ink-2"> · {roleSkillsLabel(role)}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Komitmen & Waktu */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-2">
        <span className="inline-flex items-center gap-1">
          <Icon name="clock" className="size-3.5" />
          {team.weeklyHours > 0 ? `~${team.weeklyHours} jam/minggu` : "Komitmen fleksibel"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="calendar" className="size-3.5" />
          Tenggat: {formatTeamDeadline(team.deadline)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="message" className="size-3.5" />
          {item.discussionCount} pesan diskusi
        </span>
      </div>

      {/* Pemilik Posting (Pembuat Tim) dengan Proof of Work */}
      <div className="mt-auto border-t border-line pt-4">
        <div className="flex items-center gap-3">
          <div className="relative z-10 flex min-w-0 items-center gap-2.5">
            <Avatar displayName={owner.displayName} size="sm" />
            <div className="min-w-0">
              {example ? (
                <span className="block truncate text-[14px] font-semibold text-ink">{owner.displayName}</span>
              ) : (
                <Link href={`/u/${owner.username}`} className="block truncate text-[14px] font-semibold text-ink hover:text-accent hover:underline">
                  {owner.displayName}
                </Link>
              )}
              <p className="truncate text-[12px] text-ink-2">{owner.headline}</p>
            </div>
          </div>

        </div>
        <Link
          href={detailHref}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          {example ? "Lihat contoh detail tim" : "Lihat tim dan ajukan diri"}
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
