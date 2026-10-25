import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getCurrentOwner } from "@/lib/owner";

/**
 * Rute ini dibuat saat build dari proyek yang sudah ada, lalu diperbarui
 * setelah editor menyimpan (`revalidatePath` di `src/lib/project-actions.ts`).
 *
 * Sengaja tidak memakai `force-dynamic`: pada rute yang dialirkan, `notFound()`
 * berjalan setelah respons mulai dikirim sehingga permintaan pertama membalas
 * 200. Dengan dibuat saat build, slug yang tidak dikenal benar-benar membalas
 * HTTP 404.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/projects/[slug]/edit">): Promise<Metadata> {
  const { slug } = await params;
  const owner = await getCurrentOwner();
  const project = owner?.projects.find((item) => item.slug === slug);

  return { title: project ? `Editor: ${project.title}` : "Proyek tidak ditemukan" };
}

/**
 * Layar editor kedua dan ketiga: proyek draft dan proyek yang sudah terbit.
 *
 * Keduanya memakai komponen yang sama; status awal proyek menentukan nama
 * tombol simpan dan penanda status di bagian atas.
 */
export default async function EditProjectPage({ params }: PageProps<"/dashboard/projects/[slug]/edit">) {
  const { slug } = await params;
  const owner = await getCurrentOwner();
  const project = owner?.projects.find((item) => item.slug === slug);

  if (!owner || !project) {
    notFound();
  }

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke daftar proyek" />
      <ProjectEditor owner={owner} project={project} />
    </>
  );
}
