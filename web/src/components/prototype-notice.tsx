import type { ReactNode } from "react";

import { Icon } from "@/components/icons";

/**
 * Pemberitahuan bahwa isi halaman masih data contoh.
 *
 * Teksnya menyebutkan dengan jelas bahwa nama, kontak, dan proyek bersifat
 * fiktif supaya pembaca tidak menyangka ini portofolio sungguhan.
 */
export function PrototypeNotice({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[13px] leading-5 text-ink-2 ${className}`}
    >
      <Icon name="info" className="mt-0.5 size-4" />
      <span>{children}</span>
    </p>
  );
}
