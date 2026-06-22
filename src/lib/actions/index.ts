"use server";

import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";
import { getAdminSession, isReadOnlyAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type ActionResult, DEMO_RESULT } from "@/lib/actions/result";
import {
  projectSchema,
  projectSectionSchema,
  skillSchema,
  experienceSchema,
  certificationSchema,
  testimonialSchema,
  settingsSchema,
  messageStatusSchema,
} from "@/lib/validation/entities";

/** Parse a FormData object with a Zod schema, returning friendly field errors. */
function parseForm<T>(
  schema: ZodType<T>,
  formData: FormData,
): { data: T } | { fieldErrors: Record<string, string> } {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { fieldErrors };
}

type WriteGate =
  | { ok: false; result: ActionResult }
  | { ok: true; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> };

/** Guard: returns the supabase client when writes are allowed, else a result. */
async function requireWrite(): Promise<WriteGate> {
  const session = await getAdminSession();
  if (isReadOnlyAdmin(session)) {
    return { ok: false, result: DEMO_RESULT };
  }
  const supabase = await createSupabaseServerClient();
  return { ok: true, supabase };
}

const PATHS_BY_ENTITY: Record<string, string[]> = {
  projects: ["/", "/projects", "/admin/projects", "/admin"],
  skills: ["/skills", "/admin/skills"],
  experience: ["/experience", "/admin/experience"],
  certifications: ["/certifications", "/admin/certifications"],
  testimonials: ["/about", "/admin/testimonials"],
  site_settings: ["/", "/cv", "/contact", "/admin/settings"],
  contact_messages: ["/admin/messages", "/admin"],
};

function revalidateEntity(entity: keyof typeof PATHS_BY_ENTITY) {
  for (const p of PATHS_BY_ENTITY[entity] ?? []) revalidatePath(p);
}

// ---------------------------------------------------------------------------
// Generic single-table create / update / delete
// ---------------------------------------------------------------------------
async function createRow(
  table: keyof typeof PATHS_BY_ENTITY,
  schema: ZodType,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(schema, formData);
  if ("fieldErrors" in parsed) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }
  const gate = await requireWrite();
  if (!gate.ok) return gate.result;

  const { error } = await gate.supabase.from(table).insert(parsed.data as object);
  if (error) return { status: "error", message: error.message };

  revalidateEntity(table);
  return { status: "ok", message: "Saved." };
}

async function updateRow(
  table: keyof typeof PATHS_BY_ENTITY,
  schema: ZodType,
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(schema, formData);
  if ("fieldErrors" in parsed) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }
  const gate = await requireWrite();
  if (!gate.ok) return gate.result;

  const { error } = await gate.supabase
    .from(table)
    .update(parsed.data as object)
    .eq("id", id);
  if (error) return { status: "error", message: error.message };

  revalidateEntity(table);
  return { status: "ok", message: "Updated." };
}

export async function deleteRow(
  table: keyof typeof PATHS_BY_ENTITY,
  id: string,
): Promise<ActionResult> {
  const gate = await requireWrite();
  if (!gate.ok) return gate.result;

  const { error } = await gate.supabase.from(table).delete().eq("id", id);
  if (error) return { status: "error", message: error.message };

  revalidateEntity(table);
  return { status: "ok", message: "Deleted." };
}

// ---------------------------------------------------------------------------
// Projects (with sections)
// ---------------------------------------------------------------------------
function parseSections(formData: FormData) {
  const raw = formData.get("sections");
  if (typeof raw !== "string" || !raw) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s) => projectSectionSchema.safeParse(s))
    .filter((r) => r.success)
    .map((r) => r.data);
}

export async function saveProject(
  id: string | null,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(projectSchema, formData);
  if ("fieldErrors" in parsed) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }
  const sections = parseSections(formData);

  const gate = await requireWrite();
  if (!gate.ok) return gate.result;
  const supabase = gate.supabase;

  let projectId = id;
  if (id) {
    const { error } = await supabase
      .from("projects")
      .update(parsed.data as object)
      .eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(parsed.data as object)
      .select("id")
      .single();
    if (error) return { status: "error", message: error.message };
    projectId = (data as { id: string }).id;
  }

  if (projectId) {
    // Replace sections wholesale (simple + predictable for this scale).
    await supabase.from("project_sections").delete().eq("project_id", projectId);
    if (sections.length > 0) {
      const rows = sections.map((s) => ({ ...s, project_id: projectId }));
      const { error } = await supabase.from("project_sections").insert(rows);
      if (error) return { status: "error", message: error.message };
    }
  }

  revalidateEntity("projects");
  return { status: "ok", message: "Project saved." };
}

// ---------------------------------------------------------------------------
// Thin per-entity wrappers (bind table + schema)
// ---------------------------------------------------------------------------
export const createSkill = async (_p: ActionResult, fd: FormData) =>
  createRow("skills", skillSchema, fd);
export const updateSkill = async (id: string, _p: ActionResult, fd: FormData) =>
  updateRow("skills", skillSchema, id, fd);

export const createExperience = async (_p: ActionResult, fd: FormData) =>
  createRow("experience", experienceSchema, fd);
export const updateExperience = async (
  id: string,
  _p: ActionResult,
  fd: FormData,
) => updateRow("experience", experienceSchema, id, fd);

export const createCertification = async (_p: ActionResult, fd: FormData) =>
  createRow("certifications", certificationSchema, fd);
export const updateCertification = async (
  id: string,
  _p: ActionResult,
  fd: FormData,
) => updateRow("certifications", certificationSchema, id, fd);

export const createTestimonial = async (_p: ActionResult, fd: FormData) =>
  createRow("testimonials", testimonialSchema, fd);
export const updateTestimonial = async (
  id: string,
  _p: ActionResult,
  fd: FormData,
) => updateRow("testimonials", testimonialSchema, id, fd);

export async function updateSettings(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(settingsSchema, formData);
  if ("fieldErrors" in parsed) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }
  const gate = await requireWrite();
  if (!gate.ok) return gate.result;

  const { error } = await gate.supabase
    .from("site_settings")
    .update(parsed.data as object)
    .eq("id", true);
  if (error) return { status: "error", message: error.message };

  revalidateEntity("site_settings");
  return { status: "ok", message: "Settings saved." };
}

export async function setMessageStatus(
  id: string,
  status: string,
): Promise<ActionResult> {
  const parsed = messageStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { status: "error", message: "Invalid status." };

  const gate = await requireWrite();
  if (!gate.ok) return gate.result;

  const { error } = await gate.supabase
    .from("contact_messages")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) return { status: "error", message: error.message };

  revalidateEntity("contact_messages");
  return { status: "ok" };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  return deleteRow("contact_messages", id);
}
