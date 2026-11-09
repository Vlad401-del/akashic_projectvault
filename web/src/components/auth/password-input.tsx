"use client";

import { useState, type InputHTMLAttributes } from "react";

import { Icon } from "@/components/icons";

const FIELD_BASE =
  "w-full rounded-[10px] border border-line bg-surface px-3.5 py-2.5 pr-11 text-[15px] leading-6 text-ink placeholder:text-ink-2/60";

/** Isian kata sandi dengan tombol lihat/sembunyikan. */
export function PasswordInput({
  invalid = false,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`${FIELD_BASE} ${invalid ? "border-danger" : ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-ink-2 transition-colors hover:bg-canvas hover:text-ink"
      >
        <Icon name={visible ? "eyeOff" : "eye"} className="size-[18px]" />
      </button>
    </div>
  );
}