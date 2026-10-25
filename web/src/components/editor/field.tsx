import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { Icon } from "@/components/icons";

/**
 * Isian dasar editor proyek.
 *
 * Semua isian memakai gaya yang sama supaya formulir panjang tetap terbaca:
 * label di atas, keterangan singkat di bawah label, lalu kotak isian. Pesan
 * kesalahan selalu berupa teks, bukan hanya warna, agar tetap jelas bagi
 * pembaca layar dan pengguna yang tidak membedakan warna.
 */
const FIELD_BASE =
  "w-full rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[15px] leading-6 text-ink placeholder:text-ink-2/60";
const FIELD_INVALID = "border-danger";

export function Field({
  label,
  hint,
  required = false,
  publishRequired = false,
  error,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  required?: boolean;
  publishRequired?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex flex-wrap items-baseline gap-x-1.5 text-[14px] font-medium text-ink">
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        ) : publishRequired ? (
          <span className="text-[13px] font-normal text-ink-2">(untuk terbit)</span>
        ) : (
          <span className="text-[13px] font-normal text-ink-2">(opsional)</span>
        )}
      </label>

      {hint ? <p className="mt-1 text-[13px] leading-5 text-ink-2">{hint}</p> : null}

      <div className="mt-2">{children}</div>

      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-5 text-danger">
          <Icon name="alert" className="mt-px size-4" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Isian teks satu baris. */
export function TextInput({
  invalid = false,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={`${FIELD_BASE} ${invalid ? FIELD_INVALID : ""} ${className}`}
    />
  );
}

/** Area teks; dipakai untuk seluruh narasi studi kasus. */
export function TextArea({
  invalid = false,
  className = "",
  rows = 5,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`${FIELD_BASE} min-h-[7rem] resize-y ${invalid ? FIELD_INVALID : ""} ${className}`}
    />
  );
}

/** Pilihan sederhana (jenis tugas, jenis sampul). */
export function SelectInput({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${FIELD_BASE} cursor-pointer ${className}`}>
      {children}
    </select>
  );
}
