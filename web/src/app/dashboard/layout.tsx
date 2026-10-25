import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCloudOwner } from "@/lib/supabase/content";

/** The production dashboard requires a verified Supabase session. */
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (isSupabaseConfigured()) {
    const owner = await getCloudOwner();
    if (!owner) redirect("/login");
    return children;
  }

  if (!isLocalDemoEditorEnabled()) {
    notFound();
  }

  return children;
}
