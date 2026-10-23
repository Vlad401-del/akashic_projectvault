/**
 * Mengambil kalimat pertama dari sebuah paragraf.
 *
 * Dipakai kartu proyek karena ringkasan kartu dibatasi satu kalimat, sedangkan
 * `summary` pada detail proyek sengaja dua kalimat.
 */
export function firstSentence(text: string): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  const match = normalized.match(/^.*?[.!?](?=\s|$)/);

  return (match ? match[0] : normalized).trim();
}

/**
 * Inisial nama untuk lingkaran avatar, misalnya "Nadia Putri" menjadi "NP".
 *
 * Hanya dua kata pertama yang dipakai supaya lingkarannya tetap terbaca.
 */
export function initials(displayName: string): string {
  const words = displayName.trim().split(/\s+/).slice(0, 2);

  return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

/** Nama depan saja, dipakai pada label "Dikerjakan oleh ...". */
export function firstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? displayName;
}
