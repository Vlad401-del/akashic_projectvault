"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { Icon } from "@/components/icons";

/**
 * Menampilkan elemen `[data-reveal]` saat masuk layar.
 *
 * Dibuat "fail-open": elemen hanya disembunyikan setelah komponen ini
 * berjalan dan menandai `<html data-reveal-ready>`. Elemen yang sudah terlihat
 * ditandai lebih dulu supaya tidak berkedip. Selain IntersectionObserver ada
 * pemeriksaan posisi saat scroll sebagai cadangan.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const pending = new Set<Element>();
    const isNearView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92;

    for (const el of document.querySelectorAll("[data-reveal]")) {
      if (isNearView(el)) el.setAttribute("data-shown", "");
      else pending.add(el);
    }
    if (pending.size === 0) return;

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const show = (el: Element) => {
      el.setAttribute("data-shown", "");
      pending.delete(el);
      observer?.unobserve(el);
      if (pending.size === 0) cleanup();
    };

    const check = () => {
      frame = 0;
      for (const el of Array.from(pending)) if (isNearView(el)) show(el);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    function cleanup() {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) show(entry.target);
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      pending.forEach((el) => observer?.observe(el));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    root.setAttribute("data-reveal-ready", "");

    return () => {
      cleanup();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}

/**
 * Sorotan lembut yang mengikuti kursor di dalam elemen induknya.
 * Posisi diperbarui lewat variabel CSS dalam requestAnimationFrame, tanpa
 * render ulang React.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        el.style.setProperty("--x", `${event.clientX - rect.left}px`);
        el.style.setProperty("--y", `${event.clientY - rect.top}px`);
        el.style.opacity = "1";
      });
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(420px circle at var(--x, 50%) var(--y, 30%), rgba(242,181,68,0.16), transparent 65%)",
      }}
    />
  );
}

export type PathStep = { title: string; body: string };
export type PathData = {
  id: string;
  label: string;
  intro: string;
  steps: PathStep[];
  cta: { label: string; href: string };
};

/** Dua jalur (mencari tim / membuka tim) sebagai tab yang dapat dipakai keyboard. */
export function PathTabs({ paths }: { paths: PathData[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = paths[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (active + (event.key === "ArrowRight" ? 1 : paths.length - 1)) % paths.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          role="tablist"
          aria-label="Pilih jalurmu"
          className="inline-flex rounded-full border border-ink/15 bg-surface p-1"
        >
          {paths.map((path, index) => {
            const selected = index === active;
            return (
              <button
                key={path.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${path.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onKeyDown}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-300 ${
                  selected ? "bg-ink text-cream" : "text-ink-2 hover:text-ink"
                }`}
              >
                {path.label}
              </button>
            );
          })}
        </div>

        <p key={`intro-${current.id}`} className="fade-up mt-6 max-w-[30rem] text-[17px] leading-[1.7] text-ink-2">
          {current.intro}
        </p>

        <Link
          href={current.cta.href}
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-cream transition-colors hover:bg-forest-deep"
        >
          {current.cta.label}
          <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <ol
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="border-t border-ink/15"
      >
        {current.steps.map((step, index) => (
          <li
            key={`${current.id}-${step.title}`}
            className="fade-up group grid grid-cols-[72px_minmax(0,1fr)] gap-5 border-b border-ink/15 py-7 sm:grid-cols-[110px_minmax(0,1fr)]"
            style={{ ["--d" as string]: `${index * 90}ms` }}
          >
            <span
              aria-hidden="true"
              className="outline-type font-display text-[52px] font-semibold leading-none text-ink/50 transition-colors duration-500 group-hover:text-forest sm:text-[72px]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="pt-1">
              <h3 className="text-[24px] font-semibold leading-tight text-ink">{step.title}</h3>
              <p className="mt-2 max-w-[34rem] text-[15px] leading-[1.7] text-ink-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
