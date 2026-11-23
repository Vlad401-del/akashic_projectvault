import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { createBoundedFetch } from "@/lib/supabase/fetch";

export async function updateSession(request: NextRequest) {
  // The callback verifies the OAuth code/OTP itself. Refreshing an old session
  // first adds a second network round trip and can delay account recovery.
  // A password-login POST also validates its own credentials in the server action.
  const signingIn = request.method === "POST" && request.nextUrl.pathname === "/login";
  if (!isSupabaseConfigured() || request.nextUrl.pathname === "/auth/callback" || signingIn) {
    return NextResponse.next({ request });
  }

  const { url, key } = supabaseConfig();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, key, {
    global: { fetch: createBoundedFetch() },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // Validates the JWT and refreshes expired cookies before a Server Component reads them.
  await supabase.auth.getClaims();
  return response;
}
