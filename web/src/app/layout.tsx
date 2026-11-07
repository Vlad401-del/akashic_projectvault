import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Akashic — studi kasus proyek mahasiswa",
    template: "%s • Akashic",
  },
  description:
    "Akashic membantu mahasiswa mengubah tugas kuliah menjadi studi kasus proyek yang bisa dibaca calon perekrut.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
