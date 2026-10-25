import type {
  ContactLink,
  CoverVariant,
  OutcomeCard,
  ProcessStep,
  Profile,
  Project,
  SourceLink,
  Teammate,
} from "@/lib/fixtures/types";
import type { Json, Tables } from "@/lib/supabase/database.types";
import { isSafeExternalUrl } from "@/lib/url";

type ProfileRow = Tables<"profiles">;
type ProjectRow = Tables<"projects">;
type SourceRow = Tables<"project_sources">;

function object(value: Json | undefined): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function string(value: Json | undefined): string {
  return typeof value === "string" ? value : "";
}

function optionalString(value: Json | undefined): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function strings(value: Json | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function pairs(value: Json | undefined): ProcessStep[] {
  return Array.isArray(value)
    ? value.map((item) => object(item)).map((item) => ({ title: string(item.title), body: string(item.body) }))
    : [];
}

function teammates(value: Json | undefined): Teammate[] {
  return Array.isArray(value)
    ? value.map((item) => object(item)).map((item) => ({ name: string(item.name), task: string(item.task) }))
    : [];
}

function coverVariant(value: Json | undefined): CoverVariant {
  return value === "dashboard" || value === "aplikasi" || value === "riset" || value === "laporan" || value === "alur"
    ? value
    : "dashboard";
}

function contacts(value: Json): ContactLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const item = object(entry);
    const kind = item.kind;
    const url = string(item.url);
    if ((kind === "email" || kind === "linkedin" || kind === "cv" || kind === "situs") && isSafeExternalUrl(url)) {
      return [{ kind, label: string(item.label), url }];
    }
    return [];
  });
}

export function profileFromRow(row: ProfileRow, projects: Project[]): Profile {
  return {
    username: row.username,
    displayName: row.display_name,
    headline: row.headline,
    bio: row.bio,
    program: row.program,
    city: row.city,
    skills: row.skills,
    contacts: contacts(row.contacts),
    isPublished: row.is_published,
    projects,
  };
}

export function projectFromRow(row: ProjectRow, sourceRows: SourceRow[]): Project {
  const story = object(row.story);
  const cover = object(story.cover);
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    workType: row.work_type === "kelompok" ? "kelompok" : "individu",
    period: row.period,
    course: row.course,
    role: row.role,
    teamSize: row.team_size,
    skills: row.skills,
    tools: row.tools,
    problem: strings(story.problem),
    questions: strings(story.questions),
    processIntro: string(story.processIntro),
    processSteps: pairs(story.processSteps),
    processNote: optionalString(story.processNote),
    contributionIntro: string(story.contributionIntro),
    contributionChecklist: strings(story.contributionChecklist),
    designDecision: optionalString(story.designDecision),
    teammates: teammates(story.teammates),
    outcomeIntro: string(story.outcomeIntro),
    outcomeNote: optionalString(story.outcomeNote),
    outcomeCards: pairs(story.outcomeCards) as OutcomeCard[],
    cover: { variant: coverVariant(cover.variant), alt: string(cover.alt) || "Ilustrasi contoh sampul proyek.", ...(optionalString(cover.caption) ? { caption: string(cover.caption) } : {}) },
    gallery: [],
    sources: sourceRows.sort((a, b) => a.position - b.position).map(({ label, url }): SourceLink => ({ label, url })),
    status: row.status === "published" ? "published" : "draft",
  };
}

export function projectStory(project: Project): Json {
  return {
    problem: project.problem,
    questions: project.questions,
    processIntro: project.processIntro,
    processSteps: project.processSteps,
    processNote: project.processNote,
    contributionIntro: project.contributionIntro,
    contributionChecklist: project.contributionChecklist,
    designDecision: project.designDecision,
    teammates: project.teammates,
    outcomeIntro: project.outcomeIntro,
    outcomeNote: project.outcomeNote,
    outcomeCards: project.outcomeCards,
    cover: project.cover,
  };
}
