"use client";
import { useState } from "react";
import { ProjectCover } from "@/components/project-cover";

export function CoverUpload({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <div className="space-y-3">
    <label className="block text-[14px] font-medium">Gambar sampul proyek <span className="text-danger">*</span>
      <input type="file" accept="image/jpeg,image/png,image/webp" disabled={pending} className="mt-3 block w-full rounded-lg border border-line bg-surface p-2 text-sm text-ink file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-lg file:border-0 file:bg-forest file:px-5 file:py-3 file:font-semibold file:text-cream hover:file:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60" onChange={async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setError("");
        if (file.size > 3 * 1024 * 1024) { setError("Ukuran gambar maksimal 3 MB."); return; }
        setPending(true);
        try {
          const body = new FormData(); body.set("file", file);
          const response = await fetch("/api/project-cover", { method: "POST", body });
          const result = await response.json().catch(() => null);
          if (!result) throw new Error(response.status === 413 ? "Ukuran gambar maksimal 3 MB." : "Server belum dapat menerima gambar. Muat ulang halaman lalu coba lagi.");
          if (!response.ok) throw new Error(result.error || "Gambar belum terunggah.");
          if (typeof result.src !== "string" || !result.src.startsWith("/api/project-cover/")) throw new Error("Alamat gambar belum tersedia. Coba unggah ulang.");
          onChange(result.src);
        } catch (error) { setError(error instanceof Error ? error.message : "Unggahan gagal. Coba lagi."); }
        finally { setPending(false); }
      }} />
    </label>
    <p className="text-[12px] text-ink-2">JPG, PNG, atau WebP, maksimal 3 MB. Gunakan tangkapan layar atau foto hasil karya. Gambar ini tampil pada kartu dan halaman proyek. Wajib sebelum diterbitkan.</p>
    {pending ? <p role="status">Mengunggah gambar…</p> : null}
    {error ? <p role="alert" className="text-danger">{error}</p> : null}
    {value ? <div className="max-w-md"><ProjectCover variant="dashboard" src={value} alt="Pratinjau gambar sampul proyek" /></div> : null}
  </div>;
}
