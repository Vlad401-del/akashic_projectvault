/**
 * Penolong tampilan murni untuk papan tim.
 *
 * Dipisah dari `teams.ts` karena komponen klien (papan dengan filter) ikut
 * memakainya, sedangkan `teams.ts` membaca berkas lokal lewat node:fs dan
 * hanya boleh hidup di server.
 */
import type { TeamPost, TeamRole } from "@/lib/fixtures/types";

/** Label ringkas jumlah slot yang masih dibutuhkan, dipakai di kartu dan detail. */
export function openSlots(team: TeamPost): number {
  return Math.max(team.targetMembers - team.currentMembers, 0);
}

/** Label "wajib ada" kemampuan pada satu peran, dipakai di kartu dan detail. */
export function roleSkillsLabel(role: TeamRole): string {
  return role.skills.length > 0 ? role.skills.join(", ") : "Kemampuan bebas";
}

export function formatTeamDeadline(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)
    : value;
}
