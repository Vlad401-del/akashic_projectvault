import { isAuthUnavailable } from "@/lib/auth-availability";

/** Only credential rejection is described as an email/password mismatch. */
export function loginErrorMessage(error: { code?: string; status?: number }): string {
  if (error.status === 429 || error.code === "over_request_rate_limit") {
    return "Terlalu banyak percobaan masuk. Tunggu beberapa saat lalu coba lagi.";
  }
  if (isAuthUnavailable(error)) {
    return "Layanan login belum dapat dihubungi. Periksa koneksi dan coba lagi; ini bukan tanda kata sandi salah.";
  }
  if (error.code === "email_not_confirmed") {
    return "Email belum dikonfirmasi. Buka tautan konfirmasi di email, atau gunakan Google dengan alamat email yang sama.";
  }
  if (error.code === "invalid_credentials") return "Email atau kata sandi tidak cocok. Periksa kembali data yang dimasukkan.";
  return "Login belum dapat diproses. Coba lagi nanti atau gunakan metode masuk lain.";
}
