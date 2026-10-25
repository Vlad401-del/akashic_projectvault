import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Atur kata sandi baru" };

export default function ResetPasswordPage() {
  return <><h1 className="text-2xl font-semibold text-ink">Atur kata sandi baru</h1><p className="mt-2 text-sm leading-6 text-ink-2">Gunakan minimal delapan karakter.</p><AuthForm mode="reset" /></>;
}
