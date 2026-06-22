import type {
  CertStatus,
  ProjectCategory,
  ProjectDifficulty,
  ProjectStatus,
  SkillCategory,
} from "@/lib/data/types";

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  cybersecurity: "Cybersecurity",
  full_stack: "Full-Stack",
  frontend: "Frontend",
  backend: "Backend",
  infrastructure: "Infrastructure",
  compliance: "Compliance",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  in_progress: "In progress",
  completed: "Completed",
  archived: "Archived",
};

export const PROJECT_DIFFICULTY_LABELS: Record<ProjectDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  cybersecurity: "Cybersecurity",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  tools: "Tools",
  operating_systems: "Operating Systems",
};

export const CERT_STATUS_LABELS: Record<CertStatus, string> = {
  earned: "Earned",
  in_progress: "In progress",
  planned: "Planned",
};

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "muted";

export const STATUS_BADGE_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  live: "success",
  in_progress: "warning",
  completed: "default",
  archived: "muted",
};

export const CERT_BADGE_VARIANT: Record<CertStatus, BadgeVariant> = {
  earned: "success",
  in_progress: "warning",
  planned: "muted",
};
