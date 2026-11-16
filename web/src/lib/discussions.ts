import type { DiscussionMessage } from "@/lib/fixtures/types";
import { readStoredDiscussions } from "@/lib/team-store";

export function getTeamDiscussion(teamId: string): DiscussionMessage[] {
  return readStoredDiscussions()
    .filter((message) => message.teamId === teamId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

export function getDiscussionCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const message of readStoredDiscussions()) {
    counts.set(message.teamId, (counts.get(message.teamId) ?? 0) + 1);
  }
  return counts;
}
