import { createClient } from "@/lib/supabase/server";
import { isMissingSession, sessionFailureMessage } from "@/lib/auth-availability";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ error: sessionFailureMessage(authError, "Masuk lagi sebelum mengunggah gambar.") }, { status: authError && !isMissingSession(authError) ? 503 : 401 });
  const origin = request.headers.get("origin");
  let sameHost = false;
  try { sameHost = Boolean(origin && new URL(origin).host === request.headers.get("host")); } catch { /* Reject invalid origins. */ }
  if (!sameHost) return Response.json({ error: "Alamat halaman tidak cocok. Muat ulang halaman lalu coba lagi." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 3_300_000) return Response.json({ error: "Ukuran gambar maksimal 3 MB." }, { status: 413 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024) return Response.json({ error: "Pilih gambar berukuran maksimal 3 MB." }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const kind = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png"
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? "jpeg"
      : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" ? "webp" : null;
    if (!kind || file.type !== `image/${kind}`) return Response.json({ error: "Gunakan gambar JPG, PNG, atau WebP asli." }, { status: 400 });
    const path = `${user.id}/${crypto.randomUUID()}.${kind}`;
    const { error } = await supabase.storage.from("project-covers").upload(path, bytes, { contentType: `image/${kind}`, upsert: false });
    if (error) return Response.json({ error: "Gambar belum terunggah. Coba lagi." }, { status: 400 });
    return Response.json({ src: `/api/project-cover/${path}` });
  } catch {
    return Response.json({ error: "Unggahan belum berhasil. Periksa koneksi dan coba lagi." }, { status: 400 });
  }
}
