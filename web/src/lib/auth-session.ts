import { cookies } from "next/headers";

import { getStoredSessionUser, type StoredUser } from "@/lib/auth-store";

export const SESSION_COOKIE = "akashic_session";

/** Pengguna yang sedang masuk, dibaca dari cookie sesi; null bila tamu. */
export async function getCurrentUser(): Promise<StoredUser | null> {
  const cookieStore = await cookies();
  return getStoredSessionUser(cookieStore.get(SESSION_COOKIE)?.value);
}