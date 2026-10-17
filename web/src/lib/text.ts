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
