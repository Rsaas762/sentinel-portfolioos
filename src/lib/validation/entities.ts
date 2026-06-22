import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_DIFFICULTIES,
  PROJECT_STATUSES,
  SECTION_KINDS,
  SKILL_CATEGORIES,
  CERT_STATUSES,
  MESSAGE_STATUSES,
} from "@/lib/data/types";

/**
 * Checkbox/boolean coercion that is correct for HTML forms.
 * (z.coerce.boolean("false") is `true`, which is wrong — hence this helper.)
 * Unchecked checkboxes omit the field entirely, so `undefined` -> false.
 */
const checkbox = z.preprocess(
  (v) => v === true || v === "true" || v === "on" || v === "1",
  z.boolean(),
);

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://).")
  .max(500)
  .optional()
  .or(z.literal(""));

const slug = z
  .string()
  .trim()
  .min(2, "Slug is required.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes.");

export const projectSectionSchema = z.object({
  kind: z.enum(SECTION_KINDS),
  heading: z.string().trim().min(2, "Heading is required.").max(120),
  body: z.string().trim().min(1, "Body is required.").max(8000),
  sort_order: z.coerce.number().int().min(0).max(99),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(160),
  slug,
  short_description: z.string().trim().min(10, "Add a short description.").max(400),
  category: z.enum(PROJECT_CATEGORIES),
  status: z.enum(PROJECT_STATUSES),
  difficulty: z.enum(PROJECT_DIFFICULTIES),
  // Accept a comma-separated string from the form; normalise to array.
  tech_stack: z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(40)).max(20)),
  github_url: optionalUrl,
  demo_url: optionalUrl,
  featured: checkbox,
  sort_order: z.coerce.number().int().min(0).max(999),
});

export const skillSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(80),
  category: z.enum(SKILL_CATEGORIES),
  proficiency: z.coerce.number().int().min(1).max(5),
  note: z.string().trim().max(120).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(999),
});

export const experienceSchema = z.object({
  role: z.string().trim().min(2, "Role is required.").max(120),
  organization: z.string().trim().min(2, "Organization is required.").max(160),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  start_date: z.string().trim().min(1, "Start date is required."),
  end_date: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().min(5, "Add a short summary.").max(600),
  // Newline-separated highlights -> array.
  highlights: z
    .string()
    .transform((v) =>
      v
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(300)).max(12)),
  sort_order: z.coerce.number().int().min(0).max(999),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(160),
  issuer: z.string().trim().min(2, "Issuer is required.").max(120),
  status: z.enum(CERT_STATUSES),
  issued_on: z.string().trim().optional().or(z.literal("")),
  credential_url: optionalUrl,
  sort_order: z.coerce.number().int().min(0).max(999),
});

export const testimonialSchema = z.object({
  author: z.string().trim().min(2, "Author is required.").max(120),
  role: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(10, "Quote is required.").max(800),
  source_url: optionalUrl,
  approved: checkbox,
  sort_order: z.coerce.number().int().min(0).max(999),
});

export const settingsSchema = z.object({
  hero_kicker: z.string().trim().max(80),
  hero_title: z.string().trim().min(2, "Hero title is required.").max(120),
  hero_subtitle: z.string().trim().max(400),
  hero_cta_label: z.string().trim().min(2).max(40),
  cv_url: optionalUrl,
  contact_email: z.string().trim().email("Enter a valid email.").max(200),
  available_for_work: checkbox,
  ai_assistant_enabled: checkbox,
});

export const messageStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(MESSAGE_STATUSES),
});

export type ProjectFormValues = z.input<typeof projectSchema>;
export type SkillFormValues = z.input<typeof skillSchema>;
export type ExperienceFormValues = z.input<typeof experienceSchema>;
export type CertificationFormValues = z.input<typeof certificationSchema>;
export type TestimonialFormValues = z.input<typeof testimonialSchema>;
export type SettingsFormValues = z.input<typeof settingsSchema>;
