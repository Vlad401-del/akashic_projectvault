"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase/config";
import { createBoundedFetch } from "@/lib/supabase/fetch";

export function GoogleSignIn() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function startGoogleLogin() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const { url, key } = supabaseConfig();
      // Starting OAuth only needs a PKCE verifier, not a refresh of an old session.
      const supabase = createBrowserClient(url, key, { isSingleton: false, auth: { autoRefreshToken: false }, global: { fetch: createBoundedFetch() } });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "openid email profile",
          queryParams: { prompt: "select_account" },
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) throw new Error("oauth_start_failed");
      window.location.assign(data.url);
    } catch {
      setError("Login Google belum dapat dimulai. Periksa koneksi dan coba lagi.");
      setPending(false);
    }
  }
  return <div className="mt-6 border-t border-line pt-6">
    <p className="mb-3 text-center text-sm text-ink-2">Atau lanjutkan dengan akun Google</p>
    <button type="button" disabled={pending} onClick={() => void startGoogleLogin()} aria-busy={pending} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-line-strong bg-white px-5 py-3 font-semibold text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" className="size-5 shrink-0">
        <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24.82v7.42h10.53c-.45 2.4-1.83 4.44-3.9 5.8v4.82h6.32c3.7-3.34 5.84-8.26 5.84-14.12Z" />
        <path fill="#34A853" d="M24.82 43.5c5.28 0 9.7-1.75 12.94-4.92l-6.32-4.82c-1.75 1.18-4 1.9-6.62 1.9-5.1 0-9.42-3.44-10.97-8.07H7.33v4.98A19.53 19.53 0 0 0 24.82 43.5Z" />
        <path fill="#FBBC05" d="M13.85 27.59a11.7 11.7 0 0 1 0-7.18v-4.98H7.33a19.5 19.5 0 0 0 0 17.14l6.52-4.98Z" />
        <path fill="#EA4335" d="M24.82 12.34c2.88 0 5.45.99 7.48 2.94l5.61-5.61A18.82 18.82 0 0 0 24.82 4.5 19.53 19.53 0 0 0 7.33 15.43l6.52 4.98c1.55-4.63 5.87-8.07 10.97-8.07Z" />
      </svg>
      {pending ? "Menghubungkan ke Google…" : "Masuk dengan Google"}
    </button>
    <p className="mt-2 text-xs leading-5 text-ink-2">Google membagikan identitas, email, dan profil dasar. Akashic tidak meminta akses Gmail atau Drive.</p>
    {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
  </div>;
}
