import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const OTP_TYPES = new Set<EmailOtpType>(["signup", "recovery", "invite", "magiclink", "email", "email_change"]);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();
  let error: Error | null = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else {
    return NextResponse.redirect(new URL("/login?error=invalid-link", request.url));
  }

  if (error) return NextResponse.redirect(new URL("/login?error=expired-link", request.url));
  const next = request.nextUrl.searchParams.get("next");
  const destination = next === "/reset-password" || type === "recovery" ? "/reset-password" : "/dashboard";
  return NextResponse.redirect(new URL(destination, request.url));
}
