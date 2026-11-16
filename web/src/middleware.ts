/**
 * Middleware Next.js — penjaga rute terproteksi.
 *
 * Rute `/dashboard/*` hanya boleh diakses oleh pengguna yang sudah masuk.
 * Pengunjung tanpa sesi diarahkan ke halaman masuk dengan parameter `next`
 * agar setelah login mereka kembali ke halaman yang dimaksud.
 */
import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth-session";

/** Rute yang membutuhkan sesi login. */
const PROTECTED_PREFIXES = ["/dashboard"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    // Cookie ada — biarkan Next.js menangani validasi penuh di server component.
    return NextResponse.next();
  }

  // Belum ada cookie sesi → arahkan ke halaman masuk.
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
