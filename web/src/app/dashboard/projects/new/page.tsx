import type { Metadata } from "next";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getDemoOwner } from "@/lib/content";

export const metadata: Metadata = {
  title: "Proyek baru",
};

/** Layar editor pertama: proyek baru dengan formulir kosong. */
export default function NewProjectPage() {
  const owner = getDemoOwner();

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke daftar proyek" />
      <ProjectEditor owner={owner} />
    </>
  );
}
