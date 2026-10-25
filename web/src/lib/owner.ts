import { getDemoOwner } from "@/lib/content";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import type { Profile } from "@/lib/fixtures/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCloudOwner } from "@/lib/supabase/content";

export async function getCurrentOwner(): Promise<Profile | null> {
  if (isSupabaseConfigured()) return getCloudOwner();
  return isLocalDemoEditorEnabled() ? getDemoOwner() : null;
}
