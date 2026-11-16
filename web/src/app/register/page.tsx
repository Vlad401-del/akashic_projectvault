import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Akashic untuk merekam karya mahasiswa dan mencari rekan lomba dari bukti kerja nyata.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    const { next } = await searchParams;
    redirect(next && next.startsWith("/") ? next : "/dashboard");
  }

  const { next } = await searchParams;

  return (
    <AuthShell mode="register">
      <RegisterForm next={next} />
    </AuthShell>
  );
}