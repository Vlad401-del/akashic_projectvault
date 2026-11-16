import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getDemoOwner, getOwnedProject } from "@/lib/content";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Editor pemilik membaca draft terbaru setiap kali dibuka. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/projects/[slug]/edit">): Promise<Metadata> {
  const { slug } = await params;
  const project = isSupabaseConfigured()
    ? (await getCloudOwner())?.projects.find((item) => item.slug === slug)
    : getOwnedProject(slug);

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
  const owner = isSupabaseConfigured() ? await getCloudOwner() : getDemoOwner();
  if (!owner) redirect("/login");
  const project = isSupabaseConfigured()
    ? owner.projects.find((item) => item.slug === slug)
    : getOwnedProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke daftar proyek" />
      <ProjectEditor owner={owner} project={project} allowDelete={isSupabaseConfigured()} />
    </>
  );
}
