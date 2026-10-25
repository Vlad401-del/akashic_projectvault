import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProfileForm } from "@/components/profile-form";
import { getCurrentOwner } from "@/lib/owner";

export const metadata = { title: "Atur profil" };
export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const owner = await getCurrentOwner();
  if (!owner) return null;
  return (
    <>
      <OwnerTopBar owner={owner} backHref="/dashboard" backLabel="Kembali ke proyek" />
      <div className="mx-auto max-w-[800px] px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-3xl font-semibold text-ink">Atur profil</h1>
        <p className="mt-3 text-sm leading-6 text-ink-2">Profil dimulai sebagai privat. Tinjau isinya sebelum menerbitkan.</p>
        <ProfileForm profile={owner} />
      </div>
    </>
  );
}
