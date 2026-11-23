import { notFound, redirect } from "next/navigation";

import { getAccountState } from "@/lib/auth-session";
import { ServiceUnavailable } from "@/components/service-unavailable";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (isSupabaseConfigured()) {
    const state = await getAccountState();
    if (state.status === "unavailable") return <ServiceUnavailable />;
    if (state.status === "signed-out") redirect("/login");
    return children;
  }
  if (!isLocalDemoEditorEnabled()) {
    notFound();
  }

  return children;
}
