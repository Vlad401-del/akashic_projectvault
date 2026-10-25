"use client";

import { useActionState } from "react";

import type { Profile } from "@/lib/fixtures/types";
import { updateProfileAction, type ProfileActionState } from "@/lib/profile-actions";

const inputClass = "mt-2 w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ProfileActionState, FormData>(updateProfileAction, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">Username
          <input name="username" defaultValue={profile.username} required minLength={3} maxLength={30} pattern="[a-z0-9][a-z0-9_-]{2,29}" className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-ink">Nama tampilan
          <input name="display_name" defaultValue={profile.displayName} required maxLength={80} className={inputClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">Headline
        <input name="headline" defaultValue={profile.headline} maxLength={180} placeholder="Contoh: Mahasiswa SI yang meneliti pengalaman pengguna" className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-ink">Bio
        <textarea name="bio" defaultValue={profile.bio} maxLength={2000} rows={4} className={inputClass} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">Program studi / kampus
          <input name="program" defaultValue={profile.program} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-ink">Kota
          <input name="city" defaultValue={profile.city} className={inputClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">Keterampilan (pisahkan dengan koma)
        <input name="skills" defaultValue={profile.skills.join(", ")} className={inputClass} />
      </label>
      <label className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4 text-sm leading-6 text-ink">
        <input name="is_published" type="checkbox" defaultChecked={profile.isPublished} className="mt-1 size-4 accent-accent" />
        <span>Terbitkan profil. Profil dan proyek yang berstatus terbit dapat dibuka siapa saja melalui tautan publik.</span>
      </label>
      {state.error ? <p role="alert" className="text-sm text-red-700">{state.error}</p> : null}
      {state.message ? <p role="status" className="text-sm text-green-700">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center rounded-[10px] bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60">
        {pending ? "Menyimpan..." : "Simpan profil"}
      </button>
    </form>
  );
}
