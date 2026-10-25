import { notFound } from "next/navigation";

import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (!isLocalDemoEditorEnabled()) {
    notFound();
  }

  return children;
}
