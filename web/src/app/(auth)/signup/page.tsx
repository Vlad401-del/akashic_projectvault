import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Buat akun" };

export default function SignUpPage() {
  return <><h1 className="text-2xl font-semibold text-ink">Buat akun Akashic</h1><p className="mt-2 text-sm leading-6 text-ink-2">Profil baru dimulai sebagai privat. Kamu dapat menerbitkannya setelah siap.</p><AuthForm mode="signup" /></>;
}
