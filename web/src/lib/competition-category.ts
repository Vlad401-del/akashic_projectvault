/**
 * Helper untuk memisahkan prefix kategori lomba dari teks kompetisi bebas.
 *
 * Dipakai di:
 * - TeamPostFormComponent (UI form buat/edit tim)
 * - Test unit di tests/demo/fixes.spec.ts
 */

/** Regex yang mengenali prefix kategori lomba. */
export const CATEGORY_PREFIX_RE = /^(GEMASTIK|PKM|Hackathon|Lainnya)\s*/i;

/** Kategori yang tersedia di dropdown. */
export const ACTIVE_DROPDOWN_CATS = ["GEMASTIK", "PKM", "Hackathon", "Lainnya"] as const;
export type ActiveCategory = (typeof ACTIVE_DROPDOWN_CATS)[number] | "";

/**
 * Ambil prefix kategori dari teks kompetisi.
 * "GEMASTIK 2027 Kategori UX" => "GEMASTIK".
 * "lomba bebas tanpa prefix" => "".
 */
export function extractCategory(competition: string): ActiveCategory {
  const match = competition.match(CATEGORY_PREFIX_RE);
  if (!match) return "";
  const cat = match[1];
  // Pastikan nilainya ada di daftar aktif.
  return ACTIVE_DROPDOWN_CATS.find((category) => category.toLowerCase() === cat.toLowerCase()) ?? "";
}

/**
 * Strip prefix kategori dari teks kompetisi -- sisanya adalah teks detail.
 * "GEMASTIK 2027 Kategori UX" => "2027 Kategori UX".
 * "lomba bebas" => "lomba bebas".
 */
export function extractDetail(competition: string): string {
  // This value also drives the controlled input. Preserve trailing spaces while
  // typing; teamPostFromForm trims the full competition text when saving.
  return competition.replace(CATEGORY_PREFIX_RE, "").trimStart();
}
