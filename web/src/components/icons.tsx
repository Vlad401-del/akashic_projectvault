import type { ReactNode } from "react";

/**
 * Kumpulan ikon garis untuk tahap 1.
 *
 * Ditulis sendiri (bukan menambah paket ikon) supaya tidak ada dependensi baru
 * dan ukuran berkas tetap kecil. Semua ikon memakai `currentColor`, tebal garis
 * 1,75, dan `aria-hidden` karena selalu mendampingi teks yang sudah menjelaskan
 * maksudnya.
 */
const PATHS = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.75h.01" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.2-2.6 4" />
      <path d="M12 17.2h.01" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  externalLink: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10.5 13.5 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </>
  ),
  chevronRight: <path d="m9 6 6 6-6 6" />,
  graduationCap: (
    <>
      <path d="M22 9.5 12 5 2 9.5l10 4.5 10-4.5Z" />
      <path d="M6 11.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.8" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10.5c0 5.5-8 11.5-8 11.5S4 16 4 10.5a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 8.5 5.5L20.5 7" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7.5 10.5V17" />
      <path d="M7.5 7.4h.01" />
      <path d="M11.5 17v-6.5" />
      <path d="M11.5 13.2c0-1.6 1.1-2.7 2.6-2.7s2.4 1 2.4 2.6V17" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v3.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5V15" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M12 15V3.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10.5h18" />
    </>
  ),
  users: (
    <>
      <path d="M15.5 20.5v-1.6a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1.6" />
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M21.5 20.5v-1.6a4 4 0 0 0-3-3.9" />
      <path d="M16.5 4.7a4 4 0 0 1 0 6.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.5 7.5l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a6 6 0 0 1 7.5-7.5l-3.1 3.1Z" />
  ),
  book: (
    <>
      <path d="M4 19.2A2.5 2.5 0 0 1 6.5 16.7H20" />
      <path d="M6.5 2.5H20v19H6.5A2.5 2.5 0 0 1 4 19V5a2.5 2.5 0 0 1 2.5-2.5Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.6 2.6 5-5.2" />
    </>
  ),
  list: (
    <>
      <path d="M8.5 6.5h12" />
      <path d="M8.5 12h12" />
      <path d="M8.5 17.5h12" />
      <path d="M3.5 6.5h.01" />
      <path d="M3.5 12h.01" />
      <path d="M3.5 17.5h.01" />
    </>
  ),
  activity: <path d="M3 12h3.5l3-7.5L14 19l3-7h4" />,
  route: (
    <>
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="5.5" r="2.5" />
      <path d="M9 18.5h7a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h6.5" />
    </>
  ),
  flag: (
    <>
      <path d="M4.5 15.2s1-1 4-1 5 2 8 2 4-1 4-1V3.5s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
      <path d="M4.5 21.5v-18" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <circle cx="8.5" cy="9" r="2" />
      <path d="m21 15.5-4.5-4.5-9.5 9.5" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21.5h3" />
      <path d="M12 2.5a6 6 0 0 1 6 6c0 2-1 3.1-2 4.1s-1.3 2.2-1.3 3.4H9.3c0-1.2-.3-2.4-1.3-3.4s-2-2.1-2-4.1a6 6 0 0 1 6-6Z" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-[18px]" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`${className} shrink-0`}
    >
      {PATHS[name]}
    </svg>
  );
}
