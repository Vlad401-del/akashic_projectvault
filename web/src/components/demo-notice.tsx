import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

/** Batasan demo tetap terlihat, sementara penjelasan teknis bisa dibuka bila perlu. */
export function DemoNotice({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <details className={`group rounded-[10px] border border-line bg-surface text-[13px] text-ink-2 ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 font-medium leading-5 marker:hidden [&::-webkit-details-marker]:hidden">
        <Icon name="info" className="size-4 shrink-0" />
        <span>{isLocalDemoEditorEnabled() ? "Demo lokal · Data contoh · Tanpa login" : "Demo publik · Data contoh"}</span>
        <span aria-hidden="true" className="ml-auto text-ink-2 group-open:hidden">Detail</span>
        <span aria-hidden="true" className="ml-auto hidden text-ink-2 group-open:inline">Tutup</span>
      </summary>
      <p className="border-t border-line px-4 py-3 leading-5">{children}</p>
    </details>
  );
}
