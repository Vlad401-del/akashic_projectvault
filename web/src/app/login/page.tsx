import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke Akashic untuk melanjutkan studi kasus proyek dan pencarian tim Anda.",
};

export default async function LoginPage({
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
    <AuthShell mode="login">
      <LoginForm next={next} />
    </AuthShell>
  );
}