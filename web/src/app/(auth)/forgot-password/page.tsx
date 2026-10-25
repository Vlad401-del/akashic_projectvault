import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Lupa kata sandi" };

export default function ForgotPasswordPage() {
  return <><h1 className="text-2xl font-semibold text-ink">Pulihkan kata sandi</h1><p className="mt-2 text-sm leading-6 text-ink-2">Kami akan mengirim tautan pemulihan ke email akunmu.</p><AuthForm mode="forgot" /></>;
}
