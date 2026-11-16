import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-session";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (!isLocalDemoEditorEnabled()) {
    redirect("/login");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return children;
}
