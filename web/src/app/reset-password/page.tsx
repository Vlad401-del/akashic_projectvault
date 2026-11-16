import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { RecoveryForm } from "@/components/auth/recovery-form";

export const metadata: Metadata = { title: "Kata sandi baru — Akashic" };

export default function ResetPasswordPage() {
  return <AuthShell mode="login"><RecoveryForm mode="update" /></AuthShell>;
}
