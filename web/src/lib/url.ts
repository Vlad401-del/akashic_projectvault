/**
 * Aturan tautan keluar untuk Akashic.
 *
 * Tautan bukti karya hanya boleh memakai protokol http/https. Skema seperti
 * `javascript:`, `data:`, atau `vbscript:` ditolak agar tidak bisa dipakai
 * menyisipkan skrip. Isi tautan selalu dirender sebagai teks link, bukan HTML.
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeExternalUrl(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value.trim());
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Mengembalikan tautan yang sudah dinormalisasi, atau null bila tidak aman.
 * Dipakai sebelum merender tombol/tautan sumber.
 */
export function toSafeExternalUrl(value: string | null | undefined): string | null {
  if (!value || !isSafeExternalUrl(value)) {
    return null;
  }

  return new URL(value.trim()).toString();
}
