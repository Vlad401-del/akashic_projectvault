import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(_request: Request, { params }: { params: Promise<{ owner: string; file: string }> }) {
  const { owner, file } = await params;
  if (!/^[a-f0-9-]{36}$/.test(owner) || !/^[a-f0-9-]{36}\.(png|jpeg|webp)$/.test(file)) return new Response(null, { status: 404 });
  if (!isSupabaseConfigured()) return new Response(null, { status: 404 });
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("project-covers").download(`${owner}/${file}`);
  if (error || !data) return new Response(null, { status: 404 });
  return new Response(data, { headers: { "Content-Type": data.type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox" } });
}
