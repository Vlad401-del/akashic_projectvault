import type { ReactElement } from "react";

import { Icon } from "@/components/icons";
import type { CoverVariant } from "@/lib/fixtures/types";

/**
 * Placeholder bukti karya untuk tahap 1.
 *
 * Belum ada unggahan gambar (Supabase Storage baru masuk tahap 4), jadi sampul
 * dan galeri memakai ilustrasi netral yang digambar sendiri. Hak penggunaan
 * jelas karena dibuat di repositori ini, dan setiap ilustrasi diberi label
 * "Contoh tampilan" supaya tidak disangka tangkapan layar proyek sungguhan.
 * Ilustrasi sengaja tidak memuat angka atau metrik apa pun.
 *
 * Warna aksen mengikuti palet terbaru: biru #2563EB, cyan #06B6D4, hijau
 * #22C55E. Hanya dipakai sebagai aksen kecil; sebagian besar ilustrasi netral.
 */
const SURFACE = "#FFFFFF";
const CANVAS = "#F8F9FC";
const LINE = "#DCE2EA";
const BLOCK = "#E7ECF3";
const INK_SOFT = "#8A96A6";
const ACCENT = "#2563EB";
const CYAN = "#06B6D4";
const GREEN = "#22C55E";

function TextLines({
  x,
  y,
  widths,
  height = 8,
  gap = 16,
  fill = BLOCK,
}: {
  x: number;
  y: number;
  widths: number[];
  height?: number;
  gap?: number;
  fill?: string;
}) {
  return (
    <>
      {widths.map((width, index) => (
        <rect
          key={`${x}-${y}-${index}`}
          x={x}
          y={y + index * (height + gap)}
          width={width}
          height={height}
          rx={height / 2}
          fill={fill}
        />
      ))}
    </>
  );
}

function DashboardArt() {
  const bars = [58, 92, 44, 110, 76, 64, 96];
  const barColors = [ACCENT, CYAN, ACCENT, GREEN, ACCENT, CYAN, ACCENT];

  return (
    <>
      <rect width="640" height="400" fill={SURFACE} />
      <rect width="640" height="44" fill={CANVAS} />
      <circle cx="24" cy="22" r="4" fill={LINE} />
      <circle cx="40" cy="22" r="4" fill={LINE} />
      <circle cx="56" cy="22" r="4" fill={LINE} />
      <rect x="112" y="15" width="120" height="14" rx="7" fill={BLOCK} />

      <rect y="44" width="132" height="356" fill={CANVAS} />
      {[74, 106, 138, 170, 202].map((y, index) => (
        <g key={y}>
          <rect x="20" y={y} width="12" height="12" rx="3" fill={index === 0 ? ACCENT : LINE} />
          <rect x="40" y={y + 2} width={index === 0 ? 68 : 56} height="8" rx="4" fill={index === 0 ? ACCENT : BLOCK} />
        </g>
      ))}

      {[168, 340, 512].map((x) => (
        <g key={x}>
          <rect x={x} y="70" width="112" height="62" rx="12" fill={CANVAS} stroke={LINE} />
          <rect x={x + 16} y="86" width="44" height="8" rx="4" fill={BLOCK} />
          <rect x={x + 16} y="104" width="66" height="14" rx="7" fill={INK_SOFT} opacity="0.45" />
        </g>
      ))}

      <rect x="168" y="156" width="456" height="188" rx="12" fill={CANVAS} stroke={LINE} />
      <rect x="188" y="176" width="90" height="9" rx="4.5" fill={BLOCK} />
      <line x1="188" y1="316" x2="604" y2="316" stroke={LINE} />
      <line x1="188" y1="266" x2="604" y2="266" stroke={LINE} strokeDasharray="4 6" />
      {bars.map((height, index) => (
        <rect
          key={`bar-${index}`}
          x={198 + index * 56}
          y={316 - height}
          width="30"
          height={height}
          rx="6"
          fill={barColors[index]}
        />
      ))}
      <circle cx="196" cy="366" r="4" fill={ACCENT} />
      <rect x="208" y="362" width="48" height="8" rx="4" fill={BLOCK} />
      <circle cx="292" cy="366" r="4" fill={GREEN} />
      <rect x="304" y="362" width="48" height="8" rx="4" fill={BLOCK} />
    </>
  );
}

function AplikasiArt() {
  return (
    <>
      <rect width="640" height="400" fill={CANVAS} />
      <rect x="212" y="28" width="196" height="344" rx="26" fill={SURFACE} stroke={LINE} />
      <rect x="286" y="44" width="48" height="8" rx="4" fill={BLOCK} />
      <rect x="234" y="72" width="104" height="12" rx="6" fill={INK_SOFT} opacity="0.45" />
      <rect x="234" y="92" width="72" height="8" rx="4" fill={BLOCK} />

      {[124, 186, 248].map((y) => (
        <g key={y}>
          <rect x="234" y={y} width="152" height="48" rx="12" fill={SURFACE} stroke={LINE} />
          <circle cx="260" cy={y + 24} r="14" fill={CANVAS} stroke={LINE} />
          <rect x="284" y={y + 14} width={y === 186 ? 76 : 62} height="9" rx="4.5" fill={BLOCK} />
          <rect x="284" y={y + 30} width="48" height="7" rx="3.5" fill={LINE} />
        </g>
      ))}

      <rect x="234" y="312" width="152" height="36" rx="12" fill={ACCENT} />
      <rect x="288" y="326" width="44" height="8" rx="4" fill={SURFACE} opacity="0.9" />

      <rect x="436" y="112" width="152" height="128" rx="14" fill={SURFACE} stroke={LINE} />
      <rect x="456" y="134" width="60" height="9" rx="4.5" fill={BLOCK} />
      <TextLines x={456} y={158} widths={[112, 96, 104]} height={7} gap={13} />
      <rect x="456" y="212" width="52" height="8" rx="4" fill={GREEN} opacity="0.75" />

      <rect x="52" y="128" width="132" height="96" rx="14" fill={SURFACE} stroke={LINE} />
      <circle cx="84" cy="160" r="14" fill={CANVAS} stroke={LINE} />
      <TextLines x={70} y={186} widths={[96, 72]} height={7} gap={13} />
    </>
  );
}

function RisetArt() {
  return (
    <>
      <rect width="640" height="400" fill={CANVAS} />

      {[64, 268].map((x, index) => (
        <g key={x}>
          <rect x={x} y="56" width="212" height="118" rx="14" fill={SURFACE} stroke={LINE} />
          <circle cx={x + 34} cy="92" r="16" fill={CANVAS} stroke={LINE} />
          <rect x={x + 60} y="84" width="72" height="9" rx="4.5" fill={BLOCK} />
          <rect x={x + 60} y="100" width="52" height="7" rx="3.5" fill={LINE} />
          <TextLines x={x + 24} y={130} widths={[164, 128]} height={7} gap={13} fill={index === 0 ? BLOCK : LINE} />
        </g>
      ))}

      <rect x="480" y="56" width="112" height="118" rx="14" fill={SURFACE} stroke={LINE} />
      <rect x="480" y="56" width="112" height="6" rx="3" fill={ACCENT} />
      <TextLines x={498} y={82} widths={[76, 62, 70]} height={6} gap={14} />

      <rect x="64" y="208" width="292" height="140" rx="14" fill={SURFACE} stroke={LINE} />
      <rect x="64" y="208" width="6" height="140" fill={ACCENT} />
      <TextLines x={92} y={236} widths={[236, 208, 224, 156]} height={8} gap={18} />

      {[ACCENT, CYAN, GREEN].map((color, index) => (
        <g key={color}>
          <rect x="392" y={208 + index * 48} width="92" height="32" rx="16" fill={SURFACE} stroke={LINE} />
          <circle cx="410" cy={224 + index * 48} r="5" fill={color} />
          <rect x={422} y={220 + index * 48} width="40" height="7" rx="3.5" fill={BLOCK} />
        </g>
      ))}

      <rect x="512" y="208" width="80" height="140" rx="14" fill={SURFACE} stroke={LINE} />
      <TextLines x={528} y={236} widths={[48, 48, 34]} height={7} gap={20} />
    </>
  );
}

function LaporanArt() {
  return (
    <>
      <rect width="640" height="400" fill={CANVAS} />
      <rect x="112" y="24" width="416" height="352" rx="12" fill={SURFACE} stroke={LINE} />
      <rect x="148" y="60" width="168" height="14" rx="7" fill={INK_SOFT} opacity="0.45" />
      <rect x="148" y="86" width="228" height="4" rx="2" fill={ACCENT} />
      <TextLines x={148} y={112} widths={[344, 328, 336, 240]} height={8} gap={18} />

      <rect x="148" y="216" width="344" height="124" rx="10" fill={CANVAS} stroke={LINE} />
      <line x1="148" y1="252" x2="492" y2="252" stroke={LINE} />
      <line x1="148" y1="288" x2="492" y2="288" stroke={LINE} />
      <line x1="148" y1="324" x2="492" y2="324" stroke={LINE} />
      <line x1="300" y1="216" x2="300" y2="340" stroke={LINE} />
      {[228, 264, 300, 332].map((y, index) => (
        <rect
          key={y}
          x="166"
          y={y}
          width={index === 0 ? 88 : 96}
          height="8"
          rx="4"
          fill={index === 0 ? BLOCK : LINE}
        />
      ))}
      {[228, 264, 300, 332].map((y, index) => (
        <rect key={`b-${y}`} x="320" y={y} width={index === 1 ? 80 : 64} height="8" rx="4" fill={index === 0 ? BLOCK : LINE} />
      ))}

      <rect x="428" y="368" width="100" height="6" rx="3" fill={BLOCK} />
    </>
  );
}

function AlurArt() {
  return (
    <>
      <rect width="640" height="400" fill={CANVAS} />

      <rect x="56" y="72" width="176" height="72" rx="12" fill={SURFACE} stroke={LINE} />
      <rect x="76" y="98" width="92" height="9" rx="4.5" fill={BLOCK} />
      <rect x="76" y="118" width="64" height="7" rx="3.5" fill={LINE} />

      <rect x="232" y="72" width="176" height="72" rx="12" fill={ACCENT} />
      <rect x="252" y="98" width="104" height="9" rx="4.5" fill={SURFACE} opacity="0.9" />
      <rect x="252" y="118" width="72" height="7" rx="3.5" fill={SURFACE} opacity="0.55" />

      <rect x="408" y="72" width="176" height="72" rx="12" fill={SURFACE} stroke={LINE} />
      <rect x="428" y="98" width="88" height="9" rx="4.5" fill={BLOCK} />
      <rect x="428" y="118" width="60" height="7" rx="3.5" fill={LINE} />

      <path d="M232 108H216" stroke={LINE} strokeWidth="2" />
      <path d="M408 108H392" stroke={LINE} strokeWidth="2" />

      <path d="M320 144V224" stroke={LINE} strokeWidth="2" />

      <rect x="232" y="224" width="176" height="72" rx="12" fill={SURFACE} stroke={LINE} />
      <rect x="252" y="250" width="96" height="9" rx="4.5" fill={BLOCK} />
      <rect x="252" y="270" width="68" height="7" rx="3.5" fill={LINE} />

      <path d="M232 260H120" stroke={LINE} strokeWidth="2" />
      <rect x="56" y="224" width="64" height="72" rx="12" fill={SURFACE} stroke={LINE} />
      <circle cx="88" cy="252" r="10" fill={CYAN} opacity="0.8" />
      <rect x="72" y="272" width="32" height="7" rx="3.5" fill={LINE} />

      <rect x="432" y="224" width="152" height="72" rx="12" fill={SURFACE} stroke={LINE} />
      <circle cx="464" cy="246" r="10" fill={GREEN} opacity="0.8" />
      <rect x="486" y="242" width="72" height="8" rx="4" fill={BLOCK} />
      <TextLines x={448} y={268} widths={[112]} height={7} fill={LINE} />

      <rect x="56" y="336" width="528" height="6" rx="3" fill={BLOCK} />
    </>
  );
}

const ART: Record<CoverVariant, () => ReactElement> = {
  dashboard: DashboardArt,
  aplikasi: AplikasiArt,
  riset: RisetArt,
  laporan: LaporanArt,
  alur: AlurArt,
};

/**
 * `frame` menentukan tampilan bingkai:
 * - `card`   : tanpa sudut membulat, dipakai di dalam kartu proyek.
 * - `figure` : bersudut membulat, dipakai sebagai sampul/galeri halaman detail.
 */
export function ProjectCover({
  variant,
  alt,
  frame = "figure",
  aspectClassName = "aspect-[16/10]",
}: {
  variant: CoverVariant;
  alt: string;
  frame?: "card" | "figure";
  aspectClassName?: string;
}) {
  const Art = ART[variant];
  const frameClass =
    frame === "card" ? "border-b border-line bg-surface" : "overflow-hidden rounded-xl border border-line bg-surface";

  return (
    <div className={`relative w-full ${frameClass} ${aspectClassName}`}>
      <svg
        viewBox="0 0 640 400"
        role="img"
        aria-label={alt}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <Art />
      </svg>
      <span className="absolute right-3 top-3 rounded-full border border-line bg-surface/85 px-2.5 py-[3px] text-[11px] font-medium text-ink-2 backdrop-blur-[2px]">
        Contoh tampilan
      </span>
    </div>
  );
}

/** Dipakai halaman detail sebagai keterangan di bawah ilustrasi. */
export function ProjectCoverCaption({ text, className = "" }: { text: string; className?: string }) {
  return (
    <figcaption className={`flex items-start gap-2 text-[14px] leading-6 text-ink-2 ${className}`}>
      <Icon name="image" className="mt-1 size-4" />
      <span>{text}</span>
    </figcaption>
  );
}
