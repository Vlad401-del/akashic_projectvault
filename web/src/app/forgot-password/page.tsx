import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { RecoveryForm } from "@/components/auth/recovery-form";

export const metadata: Metadata = { title: "Pulihkan kata sandi — Akashic" };

export default function ForgotPasswordPage() {
  return <AuthShell mode="login"><RecoveryForm mode="request" /></AuthShell>;
}
