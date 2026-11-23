"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { createBoundedFetch } from "@/lib/supabase/fetch";
import { isAuthUnavailable } from "@/lib/auth-availability";

export default function CompleteAuthPage() {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const access_token = fragment.get("access_token");
    const refresh_token = fragment.get("refresh_token");
    const recovery = fragment.get("type") === "recovery" || new URLSearchParams(window.location.search).get("next") === "/reset-password";
    const failed = fragment.has("error") || fragment.has("error_code");
    window.history.replaceState(null, "", window.location.pathname);
    if (failed || !access_token || !refresh_token) {
      window.location.replace(`/login?error=${failed ? "expired-link" : "invalid-link"}`);
      return;
    }
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { detectSessionInUrl: false }, global: { fetch: createBoundedFetch() } },
    );
    void client.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      window.location.replace(error ? `/login?error=${isAuthUnavailable(error) ? "auth-unavailable" : "session-failed"}` : recovery ? "/reset-password" : "/dashboard");
    }).catch(() => window.location.replace("/login?error=auth-unavailable"));
  }, []);
  return <main className="mx-auto max-w-lg p-8"><p role="status">Memverifikasi tautan akun…</p></main>;
}
