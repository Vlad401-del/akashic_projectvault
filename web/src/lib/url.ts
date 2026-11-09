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

/**
 * Sumber gambar yang boleh dirender.
 *
 * Menerima jalur lokal di dalam `public` (diawali satu garis miring, misalnya
 * `/images/projects/dashboard.jpg`) atau URL http/https. Skema seperti
 * `javascript:` dan `data:` ditolak, begitu juga `//host` yang bisa
 * membajak domain.
 */
export function toSafeImageSrc(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return toSafeExternalUrl(trimmed);
}

/**
 * Seperti toSafeExternalUrl, tetapi juga menolak domain placeholder
 * `example.com` agar tautan mati tidak tampil sebagai tombol kontak/bukti karya.
 */
export function toPublicExternalUrl(value: string | null | undefined): string | null {
  const url = toSafeExternalUrl(value);
  if (!url) {
    return null;
  }

  const hostname = new URL(url).hostname;
  if (hostname === "example.com" || hostname.endsWith(".example.com")) {
    return null;
  }

  return url;
}
