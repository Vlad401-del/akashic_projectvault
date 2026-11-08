/**
 * Logika filter dan pencarian papan tim (`/tim`).
 *
 * Fungsinya murni tanpa React supaya bisa diuji terpisah dan dipakai ulang
 * bila kelak filter dipindah ke URL atau kueri database pada tahap Supabase.
 * Seluruh penyaringan dilakukan atas pencarian yang sudah berstatus "open".
 */
import type { TeamPostWithOwner } from "@/lib/teams";

/** Kategori lomba yang dikenali dari teks kompetisi pada posting. */
export const COMPETITION_CATEGORIES = ["GEMASTIK", "PKM", "Hackathon", "Tugas Akhir", "Lainnya"] as const;

export type CompetitionCategory = (typeof COMPETITION_CATEGORIES)[number];

/** Batas maksimum jam komitmen per minggu yang bisa dipilih pengunjung. */
export const MAX_HOURS_OPTIONS = [4, 8, 12, 20] as const;

export type TeamFilter = {
  /** Kata kunci pada judul, ringkasan, kompetisi, atau peran. */
  query: string;
  /** Kosong berarti semua jenis lomba. */
  category: CompetitionCategory | "";
  /** Kosong berarti semua keahlian. */
  skill: string;
  /** Null berarti tanpa batas jam. */
  maxHours: number | null;
};

export function emptyTeamFilter(): TeamFilter {
  return { query: "", category: "", skill: "", maxHours: null };
}

export function hasActiveFilter(filter: TeamFilter): boolean {
  return (
    filter.query.trim().length > 0 ||
    filter.category !== "" ||
    filter.skill !== "" ||
    filter.maxHours !== null
  );
}

/** Mengenali jenis lomba dari teks kompetisi bebas, misalnya "PKM-K 2027". */
export function competitionCategory(competition: string): CompetitionCategory {
  const text = competition.toLowerCase();

  if (text.includes("gemastik")) return "GEMASTIK";
  if (text.includes("pkm")) return "PKM";
  if (text.includes("hackathon") || text.includes("hakathon")) return "Hackathon";
  if (text.includes("tugas akhir") || text.includes("skripsi")) return "Tugas Akhir";
  return "Lainnya";
}

/** Daftar keahlian unik dari seluruh peran, urut abjad, untuk pilihan filter. */
export function listSkillOptions(items: TeamPostWithOwner[]): string[] {
  const skills = new Set<string>();

  for (const { team } of items) {
    for (const role of team.roles) {
      for (const skill of role.skills) {
        if (skill.trim().length > 0) {
          skills.add(skill.trim());
        }
      }
    }
  }

  return Array.from(skills).sort((a, b) => a.localeCompare(b, "id"));
}

/** Kategori yang benar-benar muncul di data, supaya pilihan tidak kosong semua. */
export function listCategoryOptions(items: TeamPostWithOwner[]): CompetitionCategory[] {
  const present = new Set(items.map(({ team }) => competitionCategory(team.competition)));

  return COMPETITION_CATEGORIES.filter((category) => present.has(category));
}

export function filterTeamPosts(items: TeamPostWithOwner[], filter: TeamFilter): TeamPostWithOwner[] {
  const query = filter.query.trim().toLowerCase();

  return items.filter(({ team }) => {
    if (filter.category !== "" && competitionCategory(team.competition) !== filter.category) {
      return false;
    }

    if (filter.skill !== "") {
      const hasSkill = team.roles.some((role) =>
        role.skills.some((skill) => skill.trim().toLowerCase() === filter.skill.toLowerCase()),
      );
      if (!hasSkill) {
        return false;
      }
    }

    // Jam 0 berarti "fleksibel" sehingga lolos batas jam berapa pun.
    if (filter.maxHours !== null && team.weeklyHours > filter.maxHours) {
      return false;
    }

    if (query.length > 0) {
      const haystack = [team.title, team.summary, team.competition, ...team.roles.map((role) => role.title)]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });
}