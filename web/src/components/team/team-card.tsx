import Link from "next/link";

import { Icon } from "@/components/icons";
import { Avatar } from "@/components/site-nav";
import type { TeamPostWithOwner } from "@/lib/teams";
import { openSlots, roleSkillsLabel } from "@/lib/team-utils";

/**
 * Kartu posting pencarian anggota tim untuk papan `/tim`.
 *
 * Mengikuti filosofi "Proof of Work": kartu menonjolkan peran yang dicari,
 * komitmen waktu yang jelas, serta profil pemilik yang memiliki rekam jejak
 * studi kasus di Akashic.
 */
export function TeamCard({ item }: { item: TeamPostWithOwner }) {
  const { team, owner } = item;
  const slots = openSlots(team);

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

      {/* Judul & Tautan */}
      <h3 className="mt-4 text-[22px] font-semibold leading-[1.15] text-ink">
        <Link
          href={`/tim/${team.id}`}
          className="rounded after:absolute after:inset-0 after:content-['']"
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
          Tenggat: {team.deadline}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="message" className="size-3.5" />
          {item.discussionCount} pesan diskusi
        </span>
      </div>

      {/* Pemilik Posting (Pembuat Tim) dengan Proof of Work */}
      <div className="mt-auto border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative z-10 flex min-w-0 items-center gap-2.5">
            <Avatar displayName={owner.displayName} size="sm" />
            <div className="min-w-0">
              <Link
                href={`/u/${owner.username}`}
                className="truncate block text-[14px] font-semibold text-ink hover:text-accent hover:underline"
              >
                {owner.displayName}
              </Link>
              <p className="truncate text-[12px] text-ink-2">{owner.headline}</p>
            </div>
          </div>

          <span className="relative z-10 inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-accent">
            Ajukan diri
            <Icon name="arrowRight" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
