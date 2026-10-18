"use client";

import { Icon } from "@/components/icons";
import type { ChecklistItem } from "@/lib/editor-form";

/**
 * Checklist sebelum menerbitkan proyek.
 *
 * Dua bagian: syarat isi yang dihitung dari formulir, lalu dua pernyataan yang
 * harus dicentang pemilik. Sesuai spesifikasi, checklist ini adalah pernyataan
 * pengguna, bukan verifikasi platform, dan hal itu ditulis terus terang.
 */
export function PublishChecklist({
  id,
  items,
  consentRights,
  consentNoSensitive,
  onConsentRightsChange,
  onConsentNoSensitiveChange,
  className = "",
}: {
  id?: string;
  items: ChecklistItem[];
  consentRights: boolean;
  consentNoSensitive: boolean;
  onConsentRightsChange: (value: boolean) => void;
  onConsentNoSensitiveChange: (value: boolean) => void;
  className?: string;
}) {
  const done = items.filter((item) => item.ok).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const declarationsReady = consentRights && consentNoSensitive;

  return (
    <section id={id} aria-labelledby="checklist-terbit" className={`rounded-xl border border-line bg-surface ${className}`}>
      <header className="border-b border-line px-5 py-4">
        <h2 id="checklist-terbit" className="text-[15px] font-semibold text-ink">
          Checklist sebelum menerbitkan
        </h2>
        <p className="mt-1 text-[13px] leading-5 text-ink-2">
          {done} dari {total} syarat isi siap.
        </p>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label="Syarat isi yang sudah siap"
        >
          <span className="block h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <div className="px-5 py-4">
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <Icon
                name={item.ok ? "checkCircle" : "alert"}
                className={`mt-px size-4 ${item.ok ? "text-accent" : "text-danger"}`}
              />
              <span className={`text-[14px] leading-6 ${item.ok ? "text-ink-2" : "font-medium text-ink"}`}>
                {item.label}
                <span className="sr-only">{item.ok ? " — sudah siap" : " — belum siap"}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2.5 border-t border-line pt-4">
          <label className="flex items-start gap-2.5 rounded-[10px] border border-line bg-canvas p-3.5 text-[14px] leading-6 text-ink">
            <input
              type="checkbox"
              checked={consentRights}
              onChange={(event) => onConsentRightsChange(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[#2563EB]"
            />
            <span>Saya berhak membagikan karya ini dan sudah memakai data yang boleh ditampilkan.</span>
          </label>

          <label className="flex items-start gap-2.5 rounded-[10px] border border-line bg-canvas p-3.5 text-[14px] leading-6 text-ink">
            <input
              type="checkbox"
              checked={consentNoSensitive}
              onChange={(event) => onConsentNoSensitiveChange(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[#2563EB]"
            />
            <span>Proyek ini tidak memuat data sensitif seperti kontak pribadi orang lain atau berkas rahasia.</span>
          </label>
        </div>

        <p className="mt-4 text-[13px] leading-5 text-ink-2">
          {done === total && !declarationsReady
            ? "Isi sudah lengkap. Centang kedua pernyataan agar tombol Terbitkan aktif."
            : "Checklist ini pernyataan Anda, bukan verifikasi platform. Tanggal terbit tidak dibuat otomatis."}
        </p>
      </div>
    </section>
  );
}
