import { lookup } from "node:dns/promises";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("Konfigurasi Supabase belum lengkap. Periksa .env.local tanpa membagikan isinya.");
  process.exitCode = 1;
} else {
  const host = new URL(url).hostname;
  try {
    await lookup(host);
    console.log("DNS Supabase: berhasil.");
  } catch (error) {
    console.error(`DNS Supabase: gagal (${error.code ?? "unknown"}).`);
    process.exitCode = 1;
  }
  try {
    const start = Date.now();
    const response = await fetch(new URL("/auth/v1/health", url), {
      headers: { apikey: key }, signal: AbortSignal.timeout(8_000),
    });
    console.log(`Layanan autentikasi: HTTP ${response.status}, ${Date.now() - start} ms.`);
    if (!response.ok) process.exitCode = 1;
    await response.body?.cancel();
  } catch (error) {
    console.error(`Koneksi autentikasi: gagal (${error.cause?.code ?? error.name ?? "unknown"}).`);
    process.exitCode = 1;
  }
}
