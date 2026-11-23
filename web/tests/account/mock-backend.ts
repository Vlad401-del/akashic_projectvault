// Local test service only. Never used by the application or connected to real Supabase data.
import { createServer } from "node:http";

export const ownerId = "11111111-1111-4111-8111-111111111111";
export const backendUrl = "http://127.0.0.1:3104";
const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
export const accessToken = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: ownerId, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 7200, iss: `${backendUrl}/auth/v1` })}.test-only-signature`;
const user = { id: ownerId, aud: "authenticated", role: "authenticated", email: "mobile-test@example.com", email_confirmed_at: "2026-01-01T00:00:00Z", user_metadata: {}, app_metadata: { provider: "email", providers: ["email"] }, identities: [], created_at: "2026-01-01T00:00:00Z" };
export const session = { access_token: accessToken, refresh_token: "test-only-refresh-token", token_type: "bearer", expires_in: 7200, expires_at: Math.floor(Date.now() / 1000) + 7200, user };

const initialProfile = {
  id: ownerId, username: "mobile-audit", display_name: "Mahasiswa Penguji Dengan Nama Lengkap Panjang",
  headline: "Mahasiswa yang menguji pengalaman penggunaan ponsel", bio: "Data fiktif untuk pengujian lokal.", program: "Sistem Informasi", city: "Malang", skills: ["Figma", "SQL"], contacts: [],
  is_published: true, show_contacts: true, show_skills: true, accent_color: "forest", layout_style: "classic", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
};
const team = { id: "mobile-team", owner_id: ownerId, title: "Tim Pengujian Mobile Dengan Judul Panjang", competition: "Lainnya Kompetisi Kampus 2030", summary: "Tim fiktif untuk menguji halaman edit pada ukuran ponsel dan desktop.", current_members: 1, target_members: 3, weekly_hours: 8, deadline: "2030-12-31", meeting_note: "Pertemuan daring mingguan.", status: "open", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" };
const publishedProject = {
  id: "22222222-2222-4222-8222-222222222222", owner_id: ownerId, slug: "published-audit",
  title: "Uji deployment Akashic 23 Nov 2026 dengan judul panjang", summary: "Proyek fiktif untuk memeriksa semua tombol editor terbit.",
  category: "Pengujian", work_type: "individu", period: "", course: "", role: "Penguji", team_size: null, skills: [], tools: [], status: "published",
  story: { problem: ["Memeriksa tata letak mobile."], contributionChecklist: ["Menjalankan pengujian."], outcomeIntro: "Laporan pengujian.", cover: { variant: "dashboard", src: "/images/projects/dashboard-penjualan.jpg", alt: "Gambar proyek uji" } },
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
};

export default async function setup() {
  let profile = { ...initialProfile };
  let currentTeam = { ...team };
  const initialIntro = { id: "44444444-4444-4444-8444-444444444444", team_id: team.id, sender_id: "55555555-5555-4555-8555-555555555555", sender_name: "Pelamar Slot Terakhir", role: "UI/UX Designer", weekly_hours: "8", bring: "Pengalaman desain untuk pengujian lokal.", learn: "", proof_url: "https://example.com/work", contact: "test@example.com", review: "baru", joined_at: null as string | null, created_at: "2026-11-23T00:00:00Z" };
  let currentIntro = { ...initialIntro };
  let revoked = false;
  let mode = "ok";
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", backendUrl);
    response.setHeader("Content-Type", "application/json");
    response.setHeader("X-Supabase-Api-Version", "2024-01-01");
    const send = (value: unknown, status = 200) => { response.statusCode = status; response.end(JSON.stringify(value)); };
    if (url.pathname === "/__test/reset") { profile = { ...initialProfile }; currentTeam = { ...team }; currentIntro = { ...initialIntro }; revoked = false; mode = "ok"; return send({ ok: true }); }
    if (url.pathname === "/__test/mode") {
      mode = url.searchParams.get("value") ?? "ok";
      if (mode === "team-acceptance") currentTeam = { ...team, target_members: 2 };
      return send({ ok: true });
    }
    if (url.pathname.startsWith("/auth/v1/") && mode === "auth-down") return send({ message: "Test service unavailable" }, 503);
    if (url.pathname === "/auth/v1/token" && mode === "bad-password") return send({ code: "invalid_credentials", message: "Test invalid credentials" }, 400);
    if (url.pathname === "/auth/v1/token" && mode === "rate-limit") return send({ code: "over_request_rate_limit", message: "Test rate limit" }, 429);
    if (url.pathname.startsWith("/rest/v1/") && mode === "data-down") return send({ message: "PRIVATE_TEST_DB_ERROR" }, 503);
    if (url.pathname === "/auth/v1/token") { revoked = false; return send(session); }
    if (url.pathname === "/auth/v1/logout") { revoked = true; response.statusCode = 204; return response.end(); }
    if (url.pathname === "/auth/v1/user") return revoked ? send({ code: "session_not_found", message: "Test session ended" }, 401) : send(user);
    if (url.pathname === "/auth/v1/.well-known/jwks.json") return send({ keys: [] });
    if (url.pathname === "/rest/v1/profiles" && request.method === "PATCH") {
      let body = ""; for await (const chunk of request) body += chunk;
      profile = { ...profile, ...JSON.parse(body) };
      response.statusCode = 204; return response.end();
    }
    if (url.pathname === "/rest/v1/team_posts" && request.method === "PATCH") {
      let body = ""; for await (const chunk of request) body += chunk;
      currentTeam = { ...currentTeam, ...JSON.parse(body) };
      return send(currentTeam);
    }
    // UI integration fixture only; the real PostgreSQL trigger is tested separately.
    if (url.pathname === "/rest/v1/team_intros" && request.method === "PATCH" && mode === "team-acceptance") {
      let body = ""; for await (const chunk of request) body += chunk;
      const update = JSON.parse(body);
      if (update.review === "diterima" && currentIntro.review !== "diterima") {
        if (currentTeam.status !== "open" || currentTeam.current_members >= currentTeam.target_members) return send({ message: "team_full_or_closed" }, 400);
        currentTeam.current_members += 1;
        if (currentTeam.current_members >= currentTeam.target_members) currentTeam.status = "closed";
        currentIntro.joined_at = new Date().toISOString();
      }
      currentIntro = { ...currentIntro, ...update };
      return send(currentIntro);
    }
    let rows: unknown[];
    if (url.pathname === "/rest/v1/profiles" || url.pathname === "/rest/v1/rpc/read_visible_profiles") rows = [profile];
    else if (url.pathname === "/rest/v1/team_posts") rows = [currentTeam];
    else if (url.pathname === "/rest/v1/team_roles") rows = [{ id: "role-a", team_id: team.id, title: "UI/UX Designer", skills: ["Figma", "Riset pengguna"], position: 0 }];
    else if (url.pathname === "/rest/v1/team_intros" && mode === "team-acceptance") rows = url.searchParams.has("sender_id") ? [] : [currentIntro];
    else if (url.pathname === "/rest/v1/projects" && mode === "published-project") rows = [publishedProject];
    else if (["projects", "project_sources", "team_intros", "team_discussions"].some((table) => url.pathname === `/rest/v1/${table}`)) rows = [];
    else return send({ message: "Unimplemented test endpoint" }, 404);
    return send(request.headers.accept?.includes("vnd.pgrst.object") ? rows[0] ?? null : rows);
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(3104, "127.0.0.1", resolve); });
  return async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  };
}
