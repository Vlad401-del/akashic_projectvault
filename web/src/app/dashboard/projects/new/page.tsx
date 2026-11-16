import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getDemoOwner } from "@/lib/content";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Proyek baru",
};

/** Layar editor pertama: proyek baru dengan formulir kosong. */
export default async function NewProjectPage() {
  const owner = isSupabaseConfigured() ? await getCloudOwner() : getDemoOwner();
  if (!owner) redirect("/login");

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke daftar proyek" />
      <ProjectEditor owner={owner} />
    </>
  );
}
