import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-session";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (isSupabaseConfigured()) {
    if (!await getCurrentUser()) redirect("/login");
    return children;
  }
  if (!isLocalDemoEditorEnabled()) {
    notFound();
  }

  return children;
}
