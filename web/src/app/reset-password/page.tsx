import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-session";

import { AuthShell } from "@/components/auth/auth-shell";
import { RecoveryForm } from "@/components/auth/recovery-form";

export const metadata: Metadata = { title: "Kata sandi baru — Akashic" };

export default async function ResetPasswordPage() {
  if (!await getCurrentUser()) redirect("/forgot-password");
  return <AuthShell mode="login"><RecoveryForm mode="update" /></AuthShell>;
}
