import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cache } from "react";
import { AuthUnavailableError, isMissingSession } from "@/lib/auth-availability";

export type CurrentUser = { id: string; email: string; name: string };
type AccountState = { status: "authenticated"; user: CurrentUser } | { status: "signed-out" | "unavailable"; user: null };

/** Identitas akun yang diverifikasi Supabase untuk setiap permintaan. */
export const getAccountState = cache(async (): Promise<AccountState> => {
  if (!isSupabaseConfigured()) return { status: "signed-out", user: null };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { status: isMissingSession(error) ? "signed-out" : "unavailable", user: null };
  if (!data.user) return { status: "signed-out", user: null };
  const { data: profile } = await supabase.from("profiles")
    .select("display_name").eq("id", data.user.id).maybeSingle();
  return { status: "authenticated", user: {
    id: data.user.id,
    email: data.user.email ?? "",
    name: profile?.display_name || "Pengguna Akashic",
  } };
});

/** Protected content must never treat a transport failure as a missing session. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const state = await getAccountState();
  if (state.status === "unavailable") throw new AuthUnavailableError();
  return state.user;
}

/** Public navigation is optional; this does not grant access to protected data. */
export async function getOptionalCurrentUser(): Promise<CurrentUser | null> {
  return (await getAccountState()).user;
}
