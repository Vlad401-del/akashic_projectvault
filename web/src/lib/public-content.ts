import { getPublicProfile, listPublicProfiles } from "@/lib/content";
import type { Profile } from "@/lib/fixtures/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCloudPublicProfile, listCloudPublicProfiles } from "@/lib/supabase/content";

export type PublicProfileResult = { profile: Profile; demo: boolean };

export async function getVisibleProfile(username: string): Promise<PublicProfileResult | null> {
  if (isSupabaseConfigured()) {
    const cloud = await getCloudPublicProfile(username);
    if (cloud) return { profile: cloud, demo: false };
  }
  const demo = getPublicProfile(username);
  return demo ? { profile: demo, demo: true } : null;
}

export async function listVisibleProfiles(): Promise<{ cloud: Profile[]; demo: Profile[] }> {
  const cloud = isSupabaseConfigured() ? await listCloudPublicProfiles() : [];
  const cloudNames = new Set(cloud.map((profile) => profile.username));
  return { cloud, demo: listPublicProfiles().filter((profile) => !cloudNames.has(profile.username)) };
}
