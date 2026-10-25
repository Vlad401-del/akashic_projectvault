import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Masuk" };

export default function LoginPage() {
  return <><h1 className="text-2xl font-semibold text-ink">Masuk ke Akashic</h1><p className="mt-2 text-sm leading-6 text-ink-2">Lanjutkan proyek dan kelola portofoliomu.</p><AuthForm mode="login" /></>;
}
