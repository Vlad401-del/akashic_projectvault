import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { getAccountState } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke Akashic untuk melanjutkan studi kasus proyek dan pencarian tim Anda.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const initialMessage = error === "auth-unavailable"
    ? "Koneksi ke layanan login terganggu. Coba masuk lagi setelah koneksi pulih."
    : error === "session-failed"
    ? "Sesi login belum berhasil dibuat. Mulai ulang proses masuk dari halaman ini."
    : error === "oauth-failed"
    ? "Login Google dibatalkan atau belum berhasil. Coba lagi atau gunakan email dan kata sandi."
    : error === "browser-mismatch"
    ? "Bukti permintaan login atau pemulihan tidak ditemukan di browser ini. Mulai ulang dari browser serta alamat situs yang sama."
    : error === "expired-link"
    ? "Tautan konfirmasi atau pemulihan sudah kedaluwarsa atau pernah digunakan. Minta tautan baru melalui Lupa kata sandi."
    : error === "invalid-link"
      ? "Tautan tidak valid. Buka tautan lengkap dari email Akashic atau minta tautan pemulihan baru."
      : undefined;
  const state = await getAccountState();
  if (state.status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <AuthShell mode="login">
      <LoginForm initialMessage={initialMessage ?? (state.status === "unavailable" ? "Layanan akun sementara tidak dapat dihubungi. Sesi sebelumnya belum dapat diperiksa; coba lagi setelah koneksi pulih." : undefined)} />
      {process.env.GOOGLE_AUTH_ENABLED === "true" ? <GoogleSignIn /> : null}
    </AuthShell>
  );
}
