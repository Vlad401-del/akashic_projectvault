import type { Metadata } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../../public/fonts/fraunces-latin-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/fraunces-latin-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans-latin.woff2",
  weight: "200 800",
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
  icons: { icon: { url: "/images/akashic-logo.png", type: "image/png" }, apple: "/images/akashic-logo.png" },
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
