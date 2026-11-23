import { NextResponse, type NextRequest } from "next/server";
import { isAuthApiError, type EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { isAuthUnavailable } from "@/lib/auth-availability";

const OTP_TYPES = new Set<EmailOtpType>(["signup", "recovery", "invite", "magiclink", "email", "email_change"]);

export async function GET(request: NextRequest) {
  // Next's internal URL may use localhost even when the browser uses 127.0.0.1.
  // Preserve the exact loopback host so PKCE/session cookies remain on one origin.
  const base = new URL(request.url);
  const host = request.headers.get("host");
  if (process.env.NODE_ENV === "development" && host && /^(localhost|127\.0\.0\.1):\d+$/.test(host)) base.host = host;
  const code = request.nextUrl.searchParams.get("code");
  if (request.nextUrl.searchParams.has("error")) return NextResponse.redirect(new URL("/login?error=oauth-failed", base));
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();
  let error: Error | null = null;

  if (code) {
    const hasVerifier = request.cookies.getAll().some(({ name }) => name.includes("-auth-token-code-verifier"));
    if (!hasVerifier) return NextResponse.redirect(new URL("/login?error=browser-mismatch", base));
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else {
    // Legacy email links may carry tokens in the fragment, invisible to the server.
    // The browser completes this flow and immediately clears the fragment.
    const destination = new URL("/auth/complete", base);
    if (request.nextUrl.searchParams.get("next") === "/reset-password") destination.searchParams.set("next", "/reset-password");
    return NextResponse.redirect(destination);
  }

  if (error) {
    const expired = isAuthApiError(error) && ["otp_expired", "flow_state_expired", "flow_state_not_found"].includes(error.code ?? "");
    const reason = isAuthUnavailable(error) ? "auth-unavailable" : expired ? "expired-link" : "session-failed";
    return NextResponse.redirect(new URL(`/login?error=${reason}`, base));
  }
  const next = request.nextUrl.searchParams.get("next");
  const destination = next === "/reset-password" || type === "recovery" ? "/reset-password" : "/dashboard";
  return NextResponse.redirect(new URL(destination, base));
}
