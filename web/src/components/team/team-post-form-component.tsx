"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/icons";
import { createTeamPostAction } from "@/lib/team-actions";
import {
  emptyTeamForm,
  hasTeamErrors,
  validateTeamForm,
  type TeamErrors,
  type TeamPostForm,
} from "@/lib/team-form";

export function TeamPostFormComponent() {
  const router = useRouter();
  const [form, setForm] = useState<TeamPostForm>(() => emptyTeamForm());
  const [errors, setErrors] = useState<TeamErrors>({});
  const [isPending, startTransition] = useTransition();

  function handleChange<K extends keyof TeamPostForm>(field: K, value: TeamPostForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof TeamErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof TeamErrors]: undefined }));
    }
  }

  function handleRoleChange(index: number, key: "title" | "skills", value: string) {
    setForm((prev) => {
      const nextRoles = [...prev.roles];
      nextRoles[index] = { ...nextRoles[index], [key]: value };
      return { ...prev, roles: nextRoles };
    });
    if (errors.roles?.[index]) {
      setErrors((prev) => {
        const nextRoleErrors = { ...prev.roles };
        delete nextRoleErrors[index];
        return { ...prev, roles: nextRoleErrors };
      });
    }
  }

  function addRole() {
    setForm((prev) => ({
      ...prev,
      roles: [...prev.roles, { title: "", skills: "" }],
    }));
  }

  function removeRole(index: number) {
    if (form.roles.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientErrors = validateTeamForm(form);
    if (hasTeamErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }

    startTransition(async () => {
      const result = await createTeamPostAction(form, "open");
      if (result.ok) {
        router.push(`/tim/${result.id}`);
      } else {
        setErrors(result.errors);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Bagian 1: Identitas Tim & Konteks Lomba */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-[18px] font-semibold text-ink">1. Identitas Pencarian Tim</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Jelaskan ide dan kompetisi yang ingin diikuti agar calon rekan tim langsung memahami tujuannya.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="team-title" className="block text-[14px] font-semibold text-ink">
              Nama tim atau judul ide <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Misalnya: Tim GEMASTIK 2027 — Analitik Komplain Asrama"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.title ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.title}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="team-comp" className="block text-[14px] font-semibold text-ink">
              Kompetisi atau konteks kegiatan <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-comp"
              type="text"
              value={form.competition}
              onChange={(e) => handleChange("competition", e.target.value)}
              placeholder="Misalnya: GEMASTIK 2027 (Kategori UX Design), PKM-KC, Hackathon Web3"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.competition ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.competition}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="team-summary" className="block text-[14px] font-semibold text-ink">
              Ide singkat proyek & sasaran tim <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="team-summary"
              rows={4}
              value={form.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Masalah apa yang ingin dipecahkan? Apa target keluaran tim di akhir kompetisi?"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.summary ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.summary}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Bagian 2: Peran yang Dibutuhkan */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-ink">2. Peran yang Dibutuhkan</h2>
            <p className="mt-1 text-[14px] text-ink-2">
              Bagi tanggung jawab secara spesifik agar tidak tumpang tindih.
            </p>
          </div>
          <button
            type="button"
            onClick={addRole}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-[13px] font-medium text-ink hover:border-line-strong"
          >
            <Icon name="plus" className="size-3.5" />
            Tambah peran
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {form.roles.map((role, idx) => (
            <div key={idx} className="rounded-lg border border-line bg-canvas p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-ink">Peran #{idx + 1}</span>
                {form.roles.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRole(idx)}
                    className="text-[12px] font-medium text-rose-600 hover:underline"
                  >
                    Hapus
                  </button>
                ) : null}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-ink">
                    Nama peran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => handleRoleChange(idx, "title", e.target.value)}
                    placeholder="Mis. Desainer UI/UX, Backend Dev"
                    className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                  />
                  {errors.roles?.[idx] ? (
                    <p className="mt-1 text-[12px] font-medium text-rose-600">{errors.roles[idx]}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-ink">
                    Keahlian yang diharapkan (dipisah koma)
                  </label>
                  <input
                    type="text"
                    value={role.skills}
                    onChange={(e) => handleRoleChange(idx, "skills", e.target.value)}
                    placeholder="Mis. Figma, User Research, Wireframing"
                    className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian 3: Komitmen & Ritme Kerja */}
      <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-[18px] font-semibold text-ink">3. Komitmen & Ritme Tim</h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Jelaskan ekspektasi waktu dan ritme koordinasi agar anggota yang mendaftar siap berkomitmen.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="team-current" className="block text-[14px] font-semibold text-ink">
              Anggota saat ini
            </label>
            <input
              id="team-current"
              type="number"
              min={1}
              value={form.currentMembers}
              onChange={(e) => handleChange("currentMembers", e.target.value)}
              placeholder="Contoh: 1"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="team-target" className="block text-[14px] font-semibold text-ink">
              Total anggota dituju
            </label>
            <input
              id="team-target"
              type="number"
              min={1}
              value={form.targetMembers}
              onChange={(e) => handleChange("targetMembers", e.target.value)}
              placeholder="Contoh: 3"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="team-hours" className="block text-[14px] font-semibold text-ink">
              Jam komitmen / minggu
            </label>
            <input
              id="team-hours"
              type="number"
              min={1}
              max={40}
              value={form.weeklyHours}
              onChange={(e) => handleChange("weeklyHours", e.target.value)}
              placeholder="Contoh: 8"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="team-deadline" className="block text-[14px] font-semibold text-ink">
              Tenggat pendaftaran / seleksi
            </label>
            <input
              id="team-deadline"
              type="text"
              value={form.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              placeholder="Contoh: 20 Desember 2026"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="team-meeting" className="block text-[14px] font-semibold text-ink">
              Ritme pertemuan & komunikasi
            </label>
            <input
              id="team-meeting"
              type="text"
              value={form.meetingNote}
              onChange={(e) => handleChange("meetingNote", e.target.value)}
              placeholder="Contoh: Pertemuan daring tiap Rabu malam, progres via GitHub"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Tombol Simpan */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-line-strong"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? "Menerbitkan..." : "Terbitkan Pencarian Tim"}
        </button>
      </div>
    </form>
  );
}
