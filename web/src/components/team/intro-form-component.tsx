"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Icon } from "@/components/icons";
import type { TeamRole } from "@/lib/fixtures/types";
import { sendTeamIntroAction } from "@/lib/team-actions";
import {
  emptyIntroForm,
  hasIntroErrors,
  validateIntroForm,
  type IntroErrors,
  type IntroForm,
} from "@/lib/team-form";

export function IntroFormComponent({
  teamId,
  teamTitle,
  roles,
  ownerDisplayName,
}: {
  teamId: string;
  teamTitle: string;
  roles: TeamRole[];
  ownerDisplayName: string;
}) {
  const [form, setForm] = useState<IntroForm>(() =>
    emptyIntroForm(roles[0]?.title ?? ""),
  );
  const [errors, setErrors] = useState<IntroErrors>({});
  const [isPending, startTransition] = useTransition();
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const roleTitles = roles.map((r) => r.title);

  function handleChange<K extends keyof IntroForm>(field: K, value: IntroForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof IntroErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof IntroErrors]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientErrors = validateIntroForm(form, roleTitles);
    if (hasIntroErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }

    startTransition(async () => {
      const result = await sendTeamIntroAction(teamId, form);
      if (result.ok) {
        setSubmittedAt(result.sentAt);
      } else {
        setErrors(result.errors);
      }
    });
  }

  if (submittedAt) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Icon name="checkCircle" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold text-emerald-950">
              Perkenalan Terkirim!
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-emerald-900">
              Perkenalan Anda untuk peran <strong>&ldquo;{form.role}&rdquo;</strong> di tim{" "}
              <strong>&ldquo;{teamTitle}&rdquo;</strong> telah tercatat di area pemilik{" "}
              <strong>{ownerDisplayName}</strong>.
            </p>
            <p className="mt-2 text-[13px] text-emerald-800">
              Karena aplikasi ini saat ini berjalan di mode prototipe lokal, perkenalan disimpan di{" "}
              <code className="rounded bg-emerald-100 px-1 py-0.5 font-mono text-[12px]">
                web/.data/team-requests.json
              </code>{" "}
              dan dapat ditinjau langsung di Dasbor pemilik.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedAt(null);
                  setForm(emptyIntroForm(roles[0]?.title ?? ""));
                }}
                className="rounded-lg border border-emerald-600 bg-white px-4 py-2 text-[14px] font-medium text-emerald-900 transition-colors hover:bg-emerald-50"
              >
                Kirim perkenalan lain
              </button>
              <Link
                href="/tim"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-emerald-900"
              >
                Kembali ke papan tim
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div className="border-b border-line pb-4">
        <h3 className="text-[20px] font-semibold text-ink">
          Ajukan Diri / Kirim Perkenalan
        </h3>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
          Tanpa &ldquo;DM kosong&rdquo;. Tunjukkan peran yang Anda minati, jam komitmen, dan bukti karya nyata Anda agar kolaborasi langsung jelas sejak awal.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {/* Pilihan Peran */}
        <div>
          <label className="block text-[14px] font-semibold text-ink">
            Peran yang diminati <span className="text-rose-500">*</span>
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {roles.map((r) => {
              const checked = form.role === r.title;
              return (
                <label
                  key={r.title}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                    checked
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-line bg-canvas hover:border-line-strong"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.title}
                    checked={checked}
                    onChange={() => handleChange("role", r.title)}
                    className="mt-0.5 size-4 text-accent"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-ink">{r.title}</p>
                    {r.skills.length > 0 ? (
                      <p className="mt-0.5 text-[12px] text-ink-2">
                        {r.skills.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>
          {errors.role ? (
            <p className="mt-1.5 text-[13px] font-medium text-rose-600">{errors.role}</p>
          ) : null}
        </div>

        {/* Nama Pengirim & Jam Komitmen */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="intro-name" className="block text-[14px] font-semibold text-ink">
              Nama atau panggilan Anda
            </label>
            <input
              id="intro-name"
              type="text"
              value={form.senderName}
              onChange={(e) => handleChange("senderName", e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink transition-colors placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="intro-hours" className="block text-[14px] font-semibold text-ink">
              Komitmen jam per minggu <span className="text-rose-500">*</span>
            </label>
            <input
              id="intro-hours"
              type="number"
              min={1}
              max={40}
              value={form.weeklyHours}
              onChange={(e) => handleChange("weeklyHours", e.target.value)}
              placeholder="Contoh: 8"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink transition-colors placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.weeklyHours ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.weeklyHours}</p>
            ) : (
              <p className="mt-1 text-[12px] text-ink-2">Kisaran 1-40 jam/minggu yang realistis bagi Anda.</p>
            )}
          </div>
        </div>

        {/* Apa yang saya bawa (Proof of work) */}
        <div>
          <label htmlFor="intro-bring" className="block text-[14px] font-semibold text-ink">
            Apa yang saya bawa ke tim <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="intro-bring"
            rows={3}
            value={form.bring}
            onChange={(e) => handleChange("bring", e.target.value)}
            placeholder="Jelaskan keahlian atau pengalaman konkret yang relevan dengan peran ini. Misalnya: Pernah membuat dashboard React untuk lomba Gemastik sebelumnya dan paham alur Git kerja kelompok."
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink transition-colors placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.bring ? (
            <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.bring}</p>
          ) : null}
        </div>

        {/* Tautan bukti karya */}
        <div>
          <label htmlFor="intro-proof" className="block text-[14px] font-semibold text-ink">
            Tautan bukti karya / portofolio (Opsional)
          </label>
          <input
            id="intro-proof"
            type="url"
            value={form.proofUrl}
            onChange={(e) => handleChange("proofUrl", e.target.value)}
            placeholder="https://... (Profil Akashic, repo GitHub, atau prototipe Figma)"
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink transition-colors placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {errors.proofUrl ? (
            <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.proofUrl}</p>
          ) : (
            <p className="mt-1 text-[12px] text-ink-2">
              Tautan yang membuktikan pengalaman Anda agar calon tim lebih yakin.
            </p>
          )}
        </div>

        {/* Apa yang ingin dipelajari */}
        <div>
          <label htmlFor="intro-learn" className="block text-[14px] font-semibold text-ink">
            Apa yang ingin dipelajari (Opsional)
          </label>
          <input
            id="intro-learn"
            type="text"
            value={form.learn}
            onChange={(e) => handleChange("learn", e.target.value)}
            placeholder="Misalnya: Ingin mendalami optimasi kueri atau belajar komunikasi pitch kompetisi."
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink transition-colors placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? (
            "Mengirim..."
          ) : (
            <>
              Kirim Perkenalan
              <Icon name="arrowRight" className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
