import { isAuthRetryableFetchError, isAuthSessionMissingError } from "@supabase/supabase-js";

/** Only explicit session rejection permits a redirect to login. */
export function isMissingSession(error: unknown): boolean {
  if (isAuthSessionMissingError(error)) return true;
  if (!error || typeof error !== "object") return false;
  const { code } = error as { code?: string };
  return ["session_not_found", "refresh_token_not_found", "refresh_token_already_used", "bad_jwt", "user_not_found", "user_banned"].includes(code ?? "");
}

export function isAuthUnavailable(error: unknown): boolean {
  if (isAuthRetryableFetchError(error)) return true;
  if (!error || typeof error !== "object") return false;
  const { status, code } = error as { status?: number; code?: string };
  return status === 0 || status === 408 || status === 429 || (status ?? 0) >= 500 || code === "request_timeout";
}

export class AuthUnavailableError extends Error {
  constructor() {
    super("Layanan akun sementara tidak dapat dihubungi. Coba lagi setelah koneksi pulih.");
    this.name = "AuthUnavailableError";
  }
}

export function sessionFailureMessage(error: unknown, missingMessage: string): string {
  return error && !isMissingSession(error)
    ? "Layanan akun belum dapat dihubungi. Coba lagi setelah koneksi pulih; sesi belum dapat diperiksa."
    : missingMessage;
}
