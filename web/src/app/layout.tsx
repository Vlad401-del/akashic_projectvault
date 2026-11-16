import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Akashic — karya nyata, rekan tim yang tepat",
    template: "%s • Akashic",
  },
  description:
    "Akashic membantu mahasiswa menunjukkan bukti kerja, menemukan rekan tim lomba, dan menjelaskan kontribusi dalam proyek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`h-full antialiased ${fraunces.variable} ${jakarta.variable}`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
