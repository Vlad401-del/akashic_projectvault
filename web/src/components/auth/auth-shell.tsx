import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { Icon } from "@/components/icons";
import { PrismMark, SpectrumRule, Wordmark } from "@/components/site-brand";

const COMPETITIONS = ["GEMASTIK", "PKM", "Hackathon", "Business Case", "UI/UX", "Data Science"];

/**
 * Bingkai halaman autentikasi: panel merek hijau hutan di kiri dan area
 * formulir krem di kanan. Panel kiri membawa DNA "studio lomba" (serif besar,
 * garis tipis, marquee nama lomba) supaya halaman masuk terasa bagian dari
 * produk, bukan tempelan generik.
 */
export function AuthShell({ mode, children }: { mode: "login" | "register"; children: ReactNode }) {
  const isLogin = mode === "login";

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* ---------- Panel merek ---------- */}
      <aside className="on-dark relative isolate hidden overflow-hidden bg-forest text-cream lg:flex lg:flex-col">
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 text-cream/[0.06]" />
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -right-16 top-24 size-64 rounded-[36px] bg-sun/15"
          style={{ "--tilt": "12deg" } as CSSProperties}
        />
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -left-10 bottom-40 size-40 rounded-full bg-coral/20"
          style={{ "--tilt": "-8deg", "--d": "1.2s" } as CSSProperties}
        />

        <div className="relative flex items-center justify-between px-10 pt-10 xl:px-14">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-[6px] text-[20px] text-cream">
            <PrismMark className="size-7" />
            <Wordmark />
          </Link>
          <span className="eyebrow text-cream/60">Ruang rekam karya</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-10 py-14 xl:px-14">
          <p className="eyebrow text-sun">{isLogin ? "Selamat datang kembali" : "Mulai dari sini"}</p>

          <p className="mt-5 font-display text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] xl:text-[54px]">
            <span className="line-mask">
              <span>{isLogin ? "Karya dulu," : "Rekam karya,"}</span>
            </span>
            <span className="line-mask">
              <span style={{ "--d": "120ms" } as CSSProperties} className="italic text-sun">
                {isLogin ? "baru cari tim." : "lalu temukan tim."}
              </span>
            </span>
          </p>

          <SpectrumRule className="mt-7" />

          <p className="mt-6 max-w-[30rem] text-[15px] leading-7 text-cream/75">
            {isLogin
              ? "Masuk untuk melanjutkan studi kasus proyekmu, meninjau perkenalan tim, dan menjaga bukti karya tetap rapi dalam satu ruang."
              : "Satu akun untuk mengubah tugas kuliah menjadi studi kasus yang bisa dibaca calon perekrut, lalu mencari rekan lomba dari bukti kerja nyata."}
          </p>

          <div className="mt-9 max-w-[26rem] border-l-4 border-sun bg-cream px-5 py-4 text-ink">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent">Di dalam Akashic</p>
            <p className="mt-2 text-[15px] leading-6">
              Ceritakan kontribusimu pada proyek, sertakan bukti kerja, lalu temukan tim yang mencari keahlianmu.
            </p>
          </div>
        </div>

        <div className="relative border-t border-cream/10 py-5">
          <div className="marquee overflow-hidden" aria-hidden="true">
            <div className="marquee-track items-center gap-3 px-5">
              {[...COMPETITIONS, ...COMPETITIONS].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="whitespace-nowrap rounded-full border border-cream/20 px-4 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-cream/70 uppercase"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Area formulir ---------- */}
      <div className="relative flex flex-col bg-canvas">
        <div
          aria-hidden="true"
          className="hatch pointer-events-none absolute inset-x-0 top-0 h-24 text-ink/[0.05]"
        />

        <div className="relative flex items-center justify-between px-5 pt-6 sm:px-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 rounded-[6px] text-[18px] text-ink">
            <PrismMark className="size-6" />
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded text-[13px] font-semibold text-ink-2 hover:text-ink"
          >
            <Icon name="arrowLeft" className="size-4" />
            Kembali
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        <p className="relative px-5 pb-6 text-center text-[12px] leading-5 text-ink-2 sm:px-8">
          Akun Anda melindungi ruang karya: hanya Anda yang dapat mengelola studi kasus dan meninjau
          perkenalan tim.
        </p>
      </div>
    </div>
  );
}
