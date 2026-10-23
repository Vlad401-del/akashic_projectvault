import type { WorkType } from "@/lib/fixtures/types";

/** Label jenis tugas, misalnya "Tugas kelompok". */
export function workTypeLabel(workType: WorkType): string {
  return workType === "kelompok" ? "Tugas kelompok" : "Tugas individu";
}

/** Label jenis tugas beserta jumlah anggota, dipakai pada panel Konteks tugas. */
export function workTypeWithTeam(workType: WorkType, teamSize: number | null): string {
  const base = workTypeLabel(workType);

  return workType === "kelompok" && teamSize && teamSize > 1 ? `${base}, ${teamSize} anggota` : base;
}
