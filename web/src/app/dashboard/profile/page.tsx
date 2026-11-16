import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProfileForm } from "@/components/profile-form";
import { getCloudOwner } from "@/lib/supabase/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Atur profil — Akashic" };
export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  if (!isSupabaseConfigured()) notFound();
  const owner = await getCloudOwner();
  if (!owner) redirect("/login");
  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke dasbor" />
      <main className="mx-auto max-w-[800px] px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-[30px] font-semibold text-ink">Atur profil</h1>
        <p className="mt-3 text-[14px] leading-6 text-ink-2">
          Profil dimulai sebagai privat. Lengkapi identitas dan bukti karya, lalu terbitkan ketika siap.
        </p>
        <ProfileForm profile={owner} />
      </main>
    </>
  );
}
