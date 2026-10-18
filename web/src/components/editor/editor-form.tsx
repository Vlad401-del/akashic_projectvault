"use client";

import { useId, type ReactNode } from "react";

import { Field, SelectInput, TextArea, TextInput } from "@/components/editor/field";
import { Icon, type IconName } from "@/components/icons";
import type { EditorErrors, EditorForm as EditorFormValue, EditorSource } from "@/lib/editor-form";
import type { CoverVariant, WorkType } from "@/lib/fixtures/types";

/** Judul bagian formulir dengan ikon dan penjelasan singkat. */
function Section({
  icon,
  title,
  description,
  first = false,
  children,
}: {
  icon: IconName;
  title: string;
  description: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={first ? "" : "mt-10 border-t border-line pt-10"}>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2">
          <Icon name={icon} className="size-[18px]" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-1 text-[14px] leading-6 text-ink-2">{description}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

const COVER_OPTIONS: { value: CoverVariant; label: string }[] = [
  { value: "dashboard", label: "Contoh tampilan dasbor" },
  { value: "aplikasi", label: "Contoh tampilan aplikasi" },
  { value: "riset", label: "Contoh catatan riset" },
  { value: "laporan", label: "Contoh halaman laporan" },
  { value: "alur", label: "Contoh bagan alur" },
];

/**
 * Formulir editor proyek.
 *
 * Dikelompokkan menjadi tiga bagian seperti desain: Identitas proyek, Cerita
 * proyek, dan Bukti karya. Komponen ini hanya menampilkan isian dan
 * meneruskan perubahan ke pemanggil; seluruh state ada di ProjectEditor.
 */
export function EditorForm({
  form,
  errors,
  onChange,
  onSourceChange,
  onAddSource,
  onRemoveSource,
}: {
  form: EditorFormValue;
  errors: EditorErrors;
  onChange: (patch: Partial<EditorFormValue>) => void;
  onSourceChange: (index: number, patch: Partial<EditorSource>) => void;
  onAddSource: () => void;
  onRemoveSource: (index: number) => void;
}) {
  const uid = useId();
  const id = (name: string) => `${name}-${uid}`;

  return (
    <div>
      <Section
        first
        icon="pencil"
        title="Identitas proyek"
        description="Bagian yang pertama dibaca pengunjung: judul, ringkasan, dan konteks tugas."
      >
        <Field
          label="Judul proyek"
          required
          htmlFor={id("judul")}
          error={errors.title}
          hint="Nama tugas seperti yang Anda sebut sehari-hari."
        >
          <TextInput
            id={id("judul")}
            value={form.title}
            invalid={Boolean(errors.title)}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Misalnya: Dashboard Penjualan Ritel"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Ringkasan"
          required
          htmlFor={id("ringkasan")}
          error={errors.summary}
          hint="Dua kalimat: tugas ini tentang apa, dan bagian apa yang Anda kerjakan."
        >
          <TextArea
            id={id("ringkasan")}
            value={form.summary}
            invalid={Boolean(errors.summary)}
            rows={3}
            onChange={(event) => onChange({ summary: event.target.value })}
            placeholder="Tugas kelompok mata kuliah Visualisasi Data untuk merapikan laporan penjualan mingguan. Saya mengerjakan pembersihan data dan halaman ringkasan."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Kategori"
            htmlFor={id("kategori")}
            hint="Satu frasa, misalnya Visualisasi Data."
          >
            <TextInput
              id={id("kategori")}
              value={form.category}
              onChange={(event) => onChange({ category: event.target.value })}
              placeholder="Visualisasi Data"
              autoComplete="off"
            />
          </Field>

          <Field
            label="Mata kuliah"
            htmlFor={id("mata-kuliah")}
            hint="Isi bila tugas berasal dari perkuliahan."
          >
            <TextInput
              id={id("mata-kuliah")}
              value={form.course}
              onChange={(event) => onChange({ course: event.target.value })}
              placeholder="Visualisasi Data"
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Jenis tugas" htmlFor={id("jenis")} hint="Menentukan bagian kontribusi di halaman publik.">
            <SelectInput
              id={id("jenis")}
              value={form.workType}
              onChange={(event) => onChange({ workType: event.target.value as WorkType })}
            >
              <option value="individu">Tugas individu</option>
              <option value="kelompok">Tugas kelompok</option>
            </SelectInput>
          </Field>

          {form.workType === "kelompok" ? (
            <Field label="Jumlah anggota" htmlFor={id("anggota")} hint="Termasuk Anda sendiri.">
              <TextInput
                id={id("anggota")}
                type="number"
                min={2}
                max={12}
                value={form.teamSize}
                onChange={(event) => onChange({ teamSize: event.target.value })}
                placeholder="4"
              />
            </Field>
          ) : null}
        </div>

        <Field label="Periode" htmlFor={id("periode")} hint="Misalnya: Februari – Mei 2026.">
          <TextInput
            id={id("periode")}
            value={form.period}
            onChange={(event) => onChange({ period: event.target.value })}
            placeholder="Februari – Mei 2026"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Peran saya"
          htmlFor={id("peran")}
          hint="Satu frasa, misalnya: Analisis data dan desain dasbor."
        >
          <TextInput
            id={id("peran")}
            value={form.role}
            onChange={(event) => onChange({ role: event.target.value })}
            placeholder="Analisis data dan desain dasbor"
            autoComplete="off"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Keterampilan" htmlFor={id("keterampilan")} hint="Pisahkan dengan koma.">
            <TextInput
              id={id("keterampilan")}
              value={form.skills}
              onChange={(event) => onChange({ skills: event.target.value })}
              placeholder="Pembersihan data, Visualisasi data"
              autoComplete="off"
            />
          </Field>

          <Field label="Alat" htmlFor={id("alat")} hint="Pisahkan dengan koma.">
            <TextInput
              id={id("alat")}
              value={form.tools}
              onChange={(event) => onChange({ tools: event.target.value })}
              placeholder="Google Sheets, Tableau Public"
              autoComplete="off"
            />
          </Field>
        </div>
      </Section>

      <Section
        icon="route"
        title="Cerita proyek"
        description="Urutan masalah, proses, kontribusi pribadi, dan hasil. Bagian ini yang paling banyak dibaca perekrut."
      >
        <Field
          label="Masalah"
          htmlFor={id("masalah")}
          hint="Pisahkan paragraf dengan satu baris kosong."
        >
          <TextArea
            id={id("masalah")}
            value={form.problem}
            rows={5}
            onChange={(event) => onChange({ problem: event.target.value })}
            placeholder="Data penjualan tersimpan dalam tiga berkas terpisah sehingga laporan mingguan disusun manual."
          />
        </Field>

        <Field
          label="Pertanyaan yang saya jawab"
          htmlFor={id("pertanyaan")}
          hint="Satu pertanyaan per baris."
        >
          <TextArea
            id={id("pertanyaan")}
            value={form.questions}
            rows={4}
            onChange={(event) => onChange({ questions: event.target.value })}
            placeholder={"Bagaimana tren penjualan dari bulan ke bulan?\nCabang mana yang perlu diperhatikan?"}
          />
        </Field>

        <Field label="Pengantar bagian Proses" htmlFor={id("proses-intro")} hint="Dua sampai tiga kalimat.">
          <TextArea
            id={id("proses-intro")}
            value={form.processIntro}
            rows={3}
            onChange={(event) => onChange({ processIntro: event.target.value })}
          />
        </Field>

        <Field
          label="Langkah proses"
          htmlFor={id("langkah")}
          hint="Satu langkah per baris, dipisah tanda pisah panjang: Judul langkah — penjelasan."
        >
          <TextArea
            id={id("langkah")}
            value={form.processSteps}
            rows={6}
            onChange={(event) => onChange({ processSteps: event.target.value })}
            placeholder={"Memetakan pertanyaan pemilik toko — Kami menuliskan pertanyaan yang paling sering muncul.\nMenggabungkan data dengan kueri — Saya menulis kueri SQL untuk menggabungkan transaksi."}
          />
        </Field>

        <Field
          label="Catatan pada bagian Proses"
          htmlFor={id("proses-catatan")}
          hint="Aturan, asumsi, atau keputusan teknis yang perlu pembaca ketahui."
        >
          <TextArea
            id={id("proses-catatan")}
            value={form.processNote}
            rows={2}
            onChange={(event) => onChange({ processNote: event.target.value })}
          />
        </Field>

        <Field
          label="Pengantar bagian Kontribusi"
          htmlFor={id("kontribusi-intro")}
          hint="Ingatkan pembaca bahwa bagian ini hanya pekerjaan Anda sendiri."
        >
          <TextArea
            id={id("kontribusi-intro")}
            value={form.contributionIntro}
            rows={3}
            onChange={(event) => onChange({ contributionIntro: event.target.value })}
          />
        </Field>

        <Field
          label="Kontribusi saya"
          htmlFor={id("kontribusi-daftar")}
          hint="Satu pekerjaan per baris. Bagian mana yang benar-benar Anda kerjakan sendiri?"
        >
          <TextArea
            id={id("kontribusi-daftar")}
            value={form.contributionChecklist}
            rows={5}
            onChange={(event) => onChange({ contributionChecklist: event.target.value })}
            placeholder={"Menulis kueri penggabungan transaksi.\nMenyusun halaman ringkasan penjualan per kategori."}
          />
        </Field>

        <Field
          label="Keputusan desain yang saya ambil"
          htmlFor={id("keputusan")}
          hint="Satu keputusan beserta alasannya, bukan daftar panjang."
        >
          <TextArea
            id={id("keputusan")}
            value={form.designDecision}
            rows={3}
            onChange={(event) => onChange({ designDecision: event.target.value })}
          />
        </Field>

        <Field
          label="Dikerjakan anggota lain"
          htmlFor={id("anggota-lain")}
          hint="Satu anggota per baris: Nama — bagian yang dikerjakan. Kosongkan untuk tugas individu."
        >
          <TextArea
            id={id("anggota-lain")}
            value={form.teammates}
            rows={3}
            onChange={(event) => onChange({ teammates: event.target.value })}
            placeholder="Raka Aditya — Halaman perbandingan cabang"
          />
        </Field>

        <Field label="Pengantar bagian Hasil" htmlFor={id("hasil-intro")} hint="Sebutkan keluaran tugasnya.">
          <TextArea
            id={id("hasil-intro")}
            value={form.outcomeIntro}
            rows={3}
            onChange={(event) => onChange({ outcomeIntro: event.target.value })}
          />
        </Field>

        <Field
          label="Catatan hasil"
          htmlFor={id("hasil-catatan")}
          hint="Hal yang belum selesai atau perlu diperiksa lagi."
        >
          <TextArea
            id={id("hasil-catatan")}
            value={form.outcomeNote}
            rows={2}
            onChange={(event) => onChange({ outcomeNote: event.target.value })}
          />
        </Field>

        <Field
          label="Kartu pendukung pada bagian Hasil"
          htmlFor={id("hasil-kartu")}
          hint={"Satu kartu per baris: Judul kartu — penjelasan. Contoh: Keterbatasan — Data hanya mencakup tiga cabang."}
        >
          <TextArea
            id={id("hasil-kartu")}
            value={form.outcomeCards}
            rows={4}
            onChange={(event) => onChange({ outcomeCards: event.target.value })}
          />
        </Field>
      </Section>

      <Section
        icon="image"
        title="Bukti karya"
        description="Tautan dan keterangan gambar yang membuktikan proyek ini benar ada."
      >
        <p className="flex items-start gap-2 rounded-[10px] border border-line bg-canvas px-4 py-3 text-[13px] leading-5 text-ink-2">
          <Icon name="info" className="mt-0.5 size-4" />
          <span>
            Unggah gambar baru masuk tahap berikutnya. Untuk sekarang sampul memakai ilustrasi contoh
            yang dapat Anda pilih, dan bukti karya ditambahkan sebagai tautan.
          </span>
        </p>

        <Field label="Jenis sampul" htmlFor={id("sampul-jenis")} hint="Sampul tidak memuat angka atau metrik.">
          <SelectInput
            id={id("sampul-jenis")}
            value={form.coverVariant}
            onChange={(event) => onChange({ coverVariant: event.target.value as CoverVariant })}
          >
            {COVER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field
          label="Keterangan sampul"
          htmlFor={id("sampul-keterangan")}
          hint="Dipakai sebagai teks alternatif gambar untuk pembaca layar."
        >
          <TextInput
            id={id("sampul-keterangan")}
            value={form.coverAlt}
            onChange={(event) => onChange({ coverAlt: event.target.value })}
            placeholder="Contoh tampilan halaman ringkasan penjualan per kategori."
            autoComplete="off"
          />
        </Field>

        <Field
          label="Keterangan di bawah sampul"
          htmlFor={id("sampul-catatan")}
          hint="Menjelaskan apa yang dilihat pembaca pada gambar."
        >
          <TextInput
            id={id("sampul-catatan")}
            value={form.coverCaption}
            onChange={(event) => onChange({ coverCaption: event.target.value })}
            placeholder="Halaman Ringkasan. Tampilan contoh dasbor."
            autoComplete="off"
          />
        </Field>

        <div>
          <h3 className="text-[14px] font-medium text-ink">Tautan bukti karya</h3>
          <p className="mt-1 text-[13px] leading-5 text-ink-2">
            Hanya tautan http/https yang diterima. Isi label singkat, misalnya Lihat dashboard.
          </p>

          <ul className="mt-4 space-y-3">
            {form.sources.map((source, index) => {
              const rowError = errors.sources?.[index];

              return (
                <li key={index} className="rounded-[10px] border border-line bg-canvas p-4">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)_auto] sm:items-start">
                    <div>
                      <label htmlFor={id(`tautan-label-${index}`)} className="text-[13px] font-medium text-ink">
                        Label
                      </label>
                      <TextInput
                        id={id(`tautan-label-${index}`)}
                        value={source.label}
                        invalid={Boolean(rowError)}
                        onChange={(event) => onSourceChange(index, { label: event.target.value })}
                        placeholder="Lihat dashboard"
                        className="mt-1.5"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label htmlFor={id(`tautan-url-${index}`)} className="text-[13px] font-medium text-ink">
                        Alamat
                      </label>
                      <TextInput
                        id={id(`tautan-url-${index}`)}
                        value={source.url}
                        invalid={Boolean(rowError)}
                        onChange={(event) => onSourceChange(index, { url: event.target.value })}
                        placeholder="https://example.com/demo/dashboard"
                        className="mt-1.5"
                        autoComplete="off"
                        inputMode="url"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveSource(index)}
                      disabled={form.sources.length <= 1}
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-surface px-3.5 text-[14px] font-medium text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-45 sm:mt-[26px]"
                    >
                      <Icon name="trash" className="size-4" />
                      Hapus
                    </button>
                  </div>

                  {rowError ? (
                    <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-danger">
                      <Icon name="alert" className="mt-px size-4" />
                      <span>{rowError}</span>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={onAddSource}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-dashed border-line-strong bg-surface px-3.5 text-[14px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Icon name="plus" className="size-4" />
            Tambah tautan
          </button>
        </div>
      </Section>
    </div>
  );
}
