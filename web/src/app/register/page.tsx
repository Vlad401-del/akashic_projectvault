import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { getOptionalCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Akashic untuk merekam karya mahasiswa dan mencari rekan lomba dari bukti kerja nyata.",
};

export default async function RegisterPage() {
  const user = await getOptionalCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell mode="register">
      <RegisterForm />
      {process.env.GOOGLE_AUTH_ENABLED === "true" ? <GoogleSignIn /> : null}
    </AuthShell>
  );
}
