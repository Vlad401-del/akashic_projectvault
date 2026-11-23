"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/icons";
import { createTeamPostAction, updateTeamPostAction } from "@/lib/team-actions";
import {
  ACTIVE_DROPDOWN_CATS,
  extractCategory,
  extractDetail,
} from "@/lib/competition-category";
import {
  emptyTeamForm,
  hasTeamErrors,
  validateTeamForm,
  type TeamErrors,
  type TeamPostForm,
} from "@/lib/team-form";

/** Daftar peran lomba mahasiswa yang umum. "Lainnya" memunculkan input teks bebas. */
const ROLE_OPTIONS = [
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "Data Analyst",
  "AI/ML Engineer",
  "Product Manager",
  "Researcher",
  "Graphic Designer",
  "Video Editor",
  "Content Writer",
  "QA / Tester",
  "IoT / Hardware Engineer",
  "Lainnya",
] as const;

/** Keahlian awal yang bisa dipilih; pengguna bisa tambah keahlian baru. */
const SKILL_SUGGESTIONS = [
  "Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing",
  "React", "Next.js", "Vue", "TypeScript", "JavaScript", "HTML/CSS",
  "Node.js", "Python", "Django", "FastAPI", "Express",
  "Flutter", "React Native", "Swift", "Kotlin",
  "SQL", "PostgreSQL", "MySQL", "MongoDB",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
  "Data Visualization", "Tableau", "Power BI",
  "Product Roadmap", "Agile/Scrum", "User Story Mapping",
  "Copywriting", "SEO", "Social Media", "Video Editing", "Premiere Pro",
  "Arduino", "Raspberry Pi", "IoT", "Embedded Systems",
  "Git", "Docker", "CI/CD", "Linux",
  "Canva", "Illustrator", "Photoshop",
  "Presentation", "Public Speaking", "Market Research",
] as const;

/** Komponen multi-select keahlian: pilih dari daftar + tambah keahlian baru. */
function SkillPicker({
  inputId,
  value,
  onChange,
  readOnly,
}: {
  inputId: string;
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}) {
  const selected = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    const next = selected.includes(trimmed)
      ? selected.filter((s) => s !== trimmed)
      : [...selected, trimmed];
    onChange(next.join(", "));
  }

  function addCustom() {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) {
      const next = [...selected, trimmed];
      onChange(next.join(", "));
    }
    setQuery("");
  }

  const filtered = SKILL_SUGGESTIONS.filter(
    (s) => !selected.includes(s) && s.toLowerCase().includes(query.toLowerCase()),
  );

  if (readOnly) {
    return (
      <div className="mt-1 flex flex-wrap gap-1.5">
        {selected.map((s) => (
          <span key={s} className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-[12px] text-ink">
            {s}
          </span>
        ))}
        {selected.length === 0 && <span className="text-[13px] text-ink-2">—</span>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Chip keahlian yang sudah dipilih */}
      {selected.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[12px] font-medium text-accent hover:bg-accent/20"
            >
              {s}
              <Icon name="x" className="size-2.5" />
            </button>
          ))}
        </div>
      )}

      {/* Input pencarian / tambah */}
      <div className="flex gap-1.5">
        <input
          id={inputId}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addCustom(); }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={selected.length ? "Tambah keahlian lain…" : "Cari atau tambah keahlian…"}
          className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
        />
        {query.trim() && !SKILL_SUGGESTIONS.includes(query.trim() as typeof SKILL_SUGGESTIONS[number]) && (
          <button
            type="button"
            onClick={addCustom}
            className="rounded-md border border-line bg-canvas px-2.5 py-1.5 text-[12px] font-medium text-accent hover:border-accent"
          >
            Tambah
          </button>
        )}
      </div>

      {/* Dropdown saran */}
      {open && (filtered.length > 0 || (query.trim() && !selected.includes(query.trim()))) && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-line bg-canvas shadow-lg">
          {filtered.slice(0, 20).map((s) => (
            <button
              key={s}
              type="button"
              // onMouseDown + preventDefault cegah blur sebelum klik terdaftar (mouse).
              // onClick menangani sentuhan dan keyboard (Enter/Space pada elemen button).
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { toggle(s); setQuery(""); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink hover:bg-surface focus:bg-surface focus:outline-none"
            >
              <span className="size-3.5 rounded border border-line flex-shrink-0" />
              {s}
            </button>
          ))}
          {query.trim() && !SKILL_SUGGESTIONS.includes(query.trim() as typeof SKILL_SUGGESTIONS[number]) && !selected.includes(query.trim()) && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={addCustom}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium text-accent hover:bg-surface focus:bg-surface focus:outline-none"
            >
              <Icon name="plus" className="size-3.5" />
              Tambahkan &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function TeamPostFormComponent({ initialForm, editingTeamId }: { initialForm?: TeamPostForm; editingTeamId?: string } = {}) {
  const router = useRouter();
  const [form, setForm] = useState<TeamPostForm>(() => {
    if (!initialForm) return emptyTeamForm();
    return initialForm.competition.trim() && !extractCategory(initialForm.competition)
      ? { ...initialForm, competition: `Lainnya ${initialForm.competition}` }
      : initialForm;
  });
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

    const clientErrors = validateTeamForm(form, Boolean(editingTeamId));
    if (hasTeamErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }

    startTransition(async () => {
      const result = editingTeamId
        ? await updateTeamPostAction(editingTeamId, form)
        : await createTeamPostAction(form, "open");
      if (result.ok) {
        router.push(`/tim/${result.id}`);
      } else {
        setErrors(result.errors);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="team-post-form space-y-8" noValidate>
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
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.title ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.title}</p>
            ) : null}
          </div>

          {/* Kategori kompetisi -- dropdown wajib */}
          <div>
            <label htmlFor="team-comp-category" className="block text-[14px] font-semibold text-ink">
              Kategori lomba <span className="text-rose-500">*</span>
            </label>
            <select
              id="team-comp-category"
              value={extractCategory(form.competition)}
              onChange={(e) => {
                const cat = e.target.value;
                const detail = extractDetail(form.competition);
                handleChange("competition", cat ? (detail ? `${cat} ${detail}` : cat) : detail);
              }}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Pilih kategori lomba…</option>
              {ACTIVE_DROPDOWN_CATS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.competition ? (
              <p className="mt-1 text-[13px] font-medium text-rose-600">{errors.competition}</p>
            ) : null}
          </div>

          {/* Detail kompetisi -- teks bebas */}
          <div>
            <label htmlFor="team-comp" className="block text-[14px] font-semibold text-ink">
              Detail kompetisi <span className="text-[13px] font-normal text-ink-2">(Opsional)</span>
            </label>
            <input
              id="team-comp"
              type="text"
              value={extractDetail(form.competition)}
              onChange={(e) => {
                const cat = extractCategory(form.competition);
                handleChange("competition", cat ? (e.target.value ? `${cat} ${e.target.value}` : cat) : e.target.value);
              }}
              placeholder="Mis: 2027 Kategori UX Design, PKM-KC 2027"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="mt-1 text-[12px] text-ink-2">Tambah tahun atau sub-kategori agar tim mudah ditemukan.</p>
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
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] placeholder:text-ink-2/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
          {!editingTeamId ? <button
            type="button"
            onClick={addRole}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-[13px] font-medium text-ink hover:border-line-strong"
          >
            <Icon name="plus" className="size-3.5" />
            Tambah peran
          </button> : null}
        </div>

        {editingTeamId ? <p className="mt-3 text-[13px] text-ink-2">Peran yang sudah terbit tetap sama agar pengajuan pelamar tidak kehilangan kaitannya. Untuk kebutuhan peran baru, tutup pencarian ini lalu buat posting baru.</p> : null}

        <div className="mt-6 space-y-4">
          {form.roles.map((role, idx) => (
            <div key={idx} className="rounded-lg border border-line bg-canvas p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-ink">Peran #{idx + 1}</span>
                {form.roles.length > 1 && !editingTeamId ? (
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
                  <label htmlFor={`team-role-title-${idx}`} className="block text-[13px] font-medium text-ink">
                    Nama peran <span className="text-rose-500">*</span>
                  </label>
                  {editingTeamId ? (
                    <input
                      id={`team-role-title-${idx}`}
                      type="text"
                      value={role.title}
                      readOnly
                      className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink opacity-70"
                    />
                  ) : (
                    <>
                      {/* Nilai dropdown: nama peran kalau ada di daftar, "__lainnya__"
                          kalau teks bebas sedang diisi, atau "" kalau belum dipilih. */}
                      <select
                        id={`team-role-title-${idx}`}
                        value={
                          role.title === "" || role.title === "__lainnya__"
                            ? role.title
                            : ROLE_OPTIONS.slice(0, -1).includes(role.title as typeof ROLE_OPTIONS[number])
                            ? role.title
                            : "__lainnya__"
                        }
                        onChange={(e) => {
                          if (e.target.value === "__lainnya__") {
                            handleRoleChange(idx, "title", "__lainnya__");
                          } else {
                            handleRoleChange(idx, "title", e.target.value);
                          }
                        }}
                        className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                      >
                        <option value="">Pilih peran…</option>
                        {ROLE_OPTIONS.slice(0, -1).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                        <option value="__lainnya__">Lainnya</option>
                      </select>
                      {/* Input teks bebas muncul kalau pilih "Lainnya" */}
                      {(role.title === "__lainnya__" || (!ROLE_OPTIONS.slice(0, -1).includes(role.title as typeof ROLE_OPTIONS[number]) && role.title !== "")) && (
                        <input
                          type="text"
                          aria-label={`Nama peran khusus ${idx + 1}`}
                          value={role.title === "__lainnya__" ? "" : role.title}
                          onChange={(e) => handleRoleChange(idx, "title", e.target.value || "__lainnya__")}
                          placeholder="Nama peran khusus…"
                          className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] text-ink placeholder:text-ink-2/60 focus:border-accent focus:outline-none"
                          autoFocus
                        />
                      )}
                    </>
                  )}
                  {errors.roles?.[idx] ? (
                    <p className="mt-1 text-[12px] font-medium text-rose-600">{errors.roles[idx]}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`team-role-skills-${idx}`} className="block text-[13px] font-medium text-ink">
                    Keahlian yang diharapkan <span className="text-rose-500">*</span>
                  </label>
                  <SkillPicker
                    inputId={`team-role-skills-${idx}`}
                    value={role.skills}
                    onChange={(val) => handleRoleChange(idx, "skills", val)}
                    readOnly={Boolean(editingTeamId)}
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
              Anggota saat ini <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-current"
              type="number"
              min={1}
              value={form.currentMembers}
              onChange={(e) => handleChange("currentMembers", e.target.value)}
              placeholder="Contoh: 1"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none"
            />
            {errors.currentMembers ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.currentMembers}</p> : null}
            {editingTeamId ? <p className="mt-1 text-[12px] text-ink-2">Termasuk anggota yang sudah mengonfirmasi bergabung. Jika sama dengan target, pencarian otomatis ditutup.</p> : null}
          </div>

          <div>
            <label htmlFor="team-target" className="block text-[14px] font-semibold text-ink">
              Total anggota dituju <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-target"
              type="number"
              min={1}
              value={form.targetMembers}
              onChange={(e) => handleChange("targetMembers", e.target.value)}
              placeholder="Contoh: 3"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none"
            />
            {errors.targetMembers ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.targetMembers}</p> : null}
          </div>

          <div>
            <label htmlFor="team-hours" className="block text-[14px] font-semibold text-ink">
              Jam komitmen / minggu <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-hours"
              type="number"
              min={1}
              max={40}
              value={form.weeklyHours}
              onChange={(e) => handleChange("weeklyHours", e.target.value)}
              placeholder="Contoh: 8"
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none"
            />
            {errors.weeklyHours ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.weeklyHours}</p> : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="team-deadline" className="block text-[14px] font-semibold text-ink">
              Tenggat pendaftaran / seleksi <span className="text-rose-500">*</span>
            </label>
            <input
              id="team-deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none"
            />
            {errors.deadline ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.deadline}</p> : null}
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
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-base text-ink sm:text-[14px] focus:border-accent focus:outline-none"
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
          {isPending ? "Menyimpan..." : editingTeamId ? "Simpan Perubahan" : "Terbitkan Pencarian Tim"}
        </button>
      </div>
    </form>
  );
}
