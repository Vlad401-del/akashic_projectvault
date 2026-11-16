import type { IncomingIntro, TeamPostWithOwner } from "@/lib/teams";
import type { TeamPost } from "@/lib/fixtures/types";
import type { DiscussionMessage } from "@/lib/fixtures/types";
import { createClient } from "@/lib/supabase/server";

export async function listCloudTeamPosts(): Promise<TeamPostWithOwner[]> {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("team_posts")
    .select("*").order("created_at", { ascending: false });
  if (error) throw new Error("Papan tim belum dapat dibaca.");
  if (!posts?.length) return [];

  const ids = posts.map((post) => post.id);
  const ownerIds = [...new Set(posts.map((post) => post.owner_id))];
  const [rolesResult, ownersResult, discussionsResult] = await Promise.all([
    supabase.from("team_roles").select("*").in("team_id", ids).order("position"),
    supabase.from("profiles").select("id,username,display_name,headline").in("id", ownerIds),
    supabase.from("team_discussions").select("team_id").in("team_id", ids),
  ]);
  if (rolesResult.error || ownersResult.error || discussionsResult.error) throw new Error("Rincian tim belum dapat dibaca.");
  const owners = new Map((ownersResult.data ?? []).map((owner) => [owner.id, owner]));
  const discussionCounts = new Map<string, number>();
  for (const row of discussionsResult.data ?? []) {
    discussionCounts.set(row.team_id, (discussionCounts.get(row.team_id) ?? 0) + 1);
  }
  return posts.map((post) => {
    const owner = owners.get(post.owner_id);
    const team: TeamPost = {
      id: post.id,
      title: post.title,
      competition: post.competition,
      summary: post.summary,
      ownerUsername: owner?.username ?? "",
      roles: (rolesResult.data ?? []).filter((role) => role.team_id === post.id)
        .map((role) => ({ title: role.title, skills: role.skills })),
      currentMembers: post.current_members,
      targetMembers: post.target_members,
      weeklyHours: post.weekly_hours,
      deadline: post.deadline,
      meetingNote: post.meeting_note,
      status: post.status === "closed" ? "closed" : "open",
    };
    return {
      team,
      ownerId: post.owner_id,
      owner: {
        username: owner?.username ?? "",
        displayName: owner?.display_name ?? "Pengguna Akashic",
        headline: owner?.headline ?? "",
      },
      discussionCount: discussionCounts.get(post.id) ?? 0,
    };
  });
}

export async function getCloudTeamDiscussion(teamId: string): Promise<DiscussionMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_discussions")
    .select("*").eq("team_id", teamId).order("created_at");
  if (error) throw new Error("Diskusi tim belum dapat dibaca.");
  return (data ?? []).map((row) => ({
    id: row.id,
    teamId: row.team_id,
    authorName: row.author_name,
    body: row.body,
    replyToId: row.reply_to_id,
    createdAt: row.created_at,
  }));
}

export async function getCloudTeamPost(id: string): Promise<TeamPostWithOwner | null> {
  return (await listCloudTeamPosts()).find((item) => item.team.id === id) ?? null;
}

export async function listCloudOwnedTeamPosts(ownerId: string): Promise<TeamPostWithOwner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("username").eq("id", ownerId).single();
  if (error || !data) throw new Error("Profil akun belum tersedia.");
  return (await listCloudTeamPosts()).filter((item) => item.team.ownerUsername === data.username);
}

export async function listCloudIncomingIntros(ownerId: string): Promise<IncomingIntro[]> {
  const supabase = await createClient();
  const { data: teams, error } = await supabase.from("team_posts")
    .select("id,title").eq("owner_id", ownerId);
  if (error) throw new Error("Tim milik akun belum dapat dibaca.");
  if (!teams?.length) return [];
  const { data: rows, error: introError } = await supabase.from("team_intros")
    .select("*").in("team_id", teams.map((team) => team.id)).order("created_at", { ascending: false });
  if (introError) throw new Error("Perkenalan masuk belum dapat dibaca.");
  const titles = new Map(teams.map((team) => [team.id, team.title]));
  return (rows ?? []).map((row) => ({
    teamId: row.team_id,
    teamTitle: titles.get(row.team_id) ?? row.team_id,
    intro: {
      senderName: row.sender_name,
      role: row.role,
      weeklyHours: row.weekly_hours,
      bring: row.bring,
      learn: row.learn,
      proofUrl: row.proof_url,
      contact: row.contact,
    },
    sentAt: row.created_at,
    review: row.review === "diskusi" || row.review === "diterima" || row.review === "ditolak"
      ? row.review : "baru",
    joinedAt: row.joined_at,
  }));
}

export type SentIntro = {
  teamId: string;
  teamTitle: string;
  role: string;
  review: "baru" | "diskusi" | "diterima" | "ditolak";
  joinedAt: string | null;
  sentAt: string;
  teamVisible: boolean;
  teamOpen: boolean;
};

export async function listCloudSentIntros(senderId: string): Promise<SentIntro[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase.from("team_intros")
    .select("team_id,role,review,created_at,joined_at")
    .eq("sender_id", senderId)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Pengajuan Anda belum dapat dibaca.");
  if (!rows?.length) return [];
  const { data: teams, error: teamError } = await supabase.from("team_posts")
    .select("id,title,status")
    .in("id", [...new Set(rows.map((row) => row.team_id))]);
  if (teamError) throw new Error("Rincian pengajuan belum dapat dibaca.");
  const titles = new Map((teams ?? []).map((team) => [team.id, team]));
  return rows.map((row) => ({
    teamId: row.team_id,
    teamTitle: titles.get(row.team_id)?.title ?? "Pencarian tidak tersedia",
    role: row.role,
    review: row.review === "diskusi" || row.review === "diterima" || row.review === "ditolak" ? row.review : "baru",
    joinedAt: row.joined_at,
    sentAt: row.created_at,
    teamVisible: titles.has(row.team_id),
    teamOpen: titles.get(row.team_id)?.status === "open",
  }));
}
