import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col bg-canvas font-sans text-ink"
        suppressHydrationWarning
      >
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
