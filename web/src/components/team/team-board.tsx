"use client";

import { useMemo, useState } from "react";

import { Icon } from "@/components/icons";
import { TeamCard } from "@/components/team/team-card";
import {
  emptyTeamFilter,
  filterTeamPosts,
  hasActiveFilter,
  listCategoryOptions,
  listSkillOptions,
  MAX_HOURS_OPTIONS,
  type TeamFilter,
} from "@/lib/team-filter";
import type { TeamPostWithOwner } from "@/lib/teams";

const selectClass =
  "h-10 w-full rounded-lg border border-line bg-canvas px-3 text-[14px] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

/**
 * Papan pencarian tim dengan filter sisi klien: kata kunci, jenis lomba,
 * keahlian yang dicari, dan batas jam komitmen. Datanya kecil (fixture plus
 * berkas lokal), sehingga seluruh daftar dikirim sekali dan disaring di
 * peramban tanpa permintaan tambahan.
 */
export function TeamBoard({ items }: { items: TeamPostWithOwner[] }) {
  const [filter, setFilter] = useState<TeamFilter>(emptyTeamFilter);

  const categories = useMemo(() => listCategoryOptions(items), [items]);
  const skills = useMemo(() => listSkillOptions(items), [items]);
  const results = useMemo(() => filterTeamPosts(items, filter), [items, filter]);
  const active = hasActiveFilter(filter);

  function update<K extends keyof TeamFilter>(field: K, value: TeamFilter[K]) {
    setFilter((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="mt-6">
      <form
        role="search"
        aria-label="Saring pencarian tim"
        onSubmit={(event) => event.preventDefault()}
        className="rounded-xl border border-line bg-surface p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_190px]">
          <div>
            <label htmlFor="team-query" className="sr-only">
              Kata kunci
            </label>
            <input
              id="team-query"
              type="search"
              value={filter.query}
              onChange={(event) => update("query", event.target.value)}
              placeholder="Cari judul, ide, atau peran…"
              className={selectClass}
            />
          </div>

          <div>
            <label htmlFor="team-category" className="sr-only">
              Jenis lomba
            </label>
            <select
              id="team-category"
              value={filter.category}
              onChange={(event) => update("category", event.target.value as TeamFilter["category"])}
              className={selectClass}
            >
              <option value="">Semua jenis lomba</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="team-skill" className="sr-only">
              Keahlian yang dicari
            </label>
            <select
              id="team-skill"
              value={filter.skill}
              onChange={(event) => update("skill", event.target.value)}
              className={selectClass}
            >
              <option value="">Semua keahlian</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="team-hours" className="sr-only">
              Batas jam komitmen per minggu
            </label>
            <select
              id="team-hours"
              value={filter.maxHours === null ? "" : String(filter.maxHours)}
              onChange={(event) =>
                update("maxHours", event.target.value === "" ? null : Number(event.target.value))
              }
              className={selectClass}
            >
              <option value="">Jam berapa saja</option>
              {MAX_HOURS_OPTIONS.map((hours) => (
                <option key={hours} value={hours}>
                  Maks. {hours} jam/minggu
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-ink-2" aria-live="polite">
            Menampilkan <span className="font-semibold text-ink">{results.length}</span> dari {items.length} tim
            terbuka
          </p>
          {active ? (
            <button
              type="button"
              onClick={() => setFilter(emptyTeamFilter())}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[13px] font-medium text-ink transition-colors hover:border-line-strong hover:text-accent"
            >
              <Icon name="x" className="size-3" />
              Hapus filter
            </button>
          ) : null}
        </div>
      </form>

      {results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
            <Icon name="users" className="size-4" />
          </span>
          <p className="mt-3 text-[15px] font-medium text-ink">
            Tidak ada tim yang cocok dengan filter Anda
          </p>
          <p className="mt-1 text-[13px] text-ink-2">
            Coba kata kunci lain, longgarkan batas jam, atau hapus semua filter.
          </p>
          <button
            type="button"
            onClick={() => setFilter(emptyTeamFilter())}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <Icon name="x" className="size-3.5" />
            Hapus semua filter
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {results.map((item) => (
            <TeamCard key={item.team.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}