import type { Metadata } from "next";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getCurrentOwner } from "@/lib/owner";

export const metadata: Metadata = {
  title: "Proyek baru",
};

/** Layar editor pertama: proyek baru dengan formulir kosong. */
export default async function NewProjectPage() {
  const owner = await getCurrentOwner();
  if (!owner) return null;

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke daftar proyek" />
      <ProjectEditor owner={owner} />
    </>
  );
}
