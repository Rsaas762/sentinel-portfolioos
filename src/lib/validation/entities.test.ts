import { describe, expect, it } from "vitest";
import {
  projectSchema,
  skillSchema,
  certificationSchema,
  settingsSchema,
} from "@/lib/validation/entities";
import { contactSchema } from "@/lib/validation/contact";

describe("project schema", () => {
  it("accepts a valid project and normalises tech_stack + featured", () => {
    const parsed = projectSchema.parse({
      title: "My Project",
      slug: "my-project",
      short_description: "A solid description of the project.",
      category: "cybersecurity",
      status: "live",
      difficulty: "advanced",
      tech_stack: "Next.js, TypeScript ,  Zod",
      github_url: "",
      demo_url: "",
      featured: "true",
      sort_order: "2",
    });
    expect(parsed.tech_stack).toEqual(["Next.js", "TypeScript", "Zod"]);
    expect(parsed.featured).toBe(true);
    expect(parsed.sort_order).toBe(2);
  });

  it("treats an unchecked featured checkbox (absent) as false", () => {
    const parsed = projectSchema.parse({
      title: "My Project",
      slug: "my-project",
      short_description: "A solid description of the project.",
      category: "frontend",
      status: "completed",
      difficulty: "beginner",
      tech_stack: "React",
      sort_order: "0",
    });
    expect(parsed.featured).toBe(false);
  });

  it("rejects an invalid slug", () => {
    const result = projectSchema.safeParse({
      title: "X Project",
      slug: "Not A Slug!",
      short_description: "A solid description of the project.",
      category: "frontend",
      status: "live",
      difficulty: "beginner",
      tech_stack: "React",
      sort_order: "0",
    });
    expect(result.success).toBe(false);
  });
});

describe("skill schema", () => {
  it("rejects proficiency out of range", () => {
    expect(
      skillSchema.safeParse({
        name: "Rust",
        category: "backend",
        proficiency: "9",
        sort_order: "0",
      }).success,
    ).toBe(false);
  });
});

describe("certification schema", () => {
  it("rejects an invalid credential URL", () => {
    expect(
      certificationSchema.safeParse({
        name: "Security+",
        issuer: "CompTIA",
        status: "earned",
        credential_url: "not-a-url",
        sort_order: "0",
      }).success,
    ).toBe(false);
  });
});

describe("settings schema", () => {
  it("requires a valid contact email", () => {
    expect(
      settingsSchema.safeParse({
        hero_kicker: "",
        hero_title: "Hello",
        hero_subtitle: "",
        hero_cta_label: "Go",
        contact_email: "nope",
        available_for_work: "true",
        ai_assistant_enabled: "false",
      }).success,
    ).toBe(false);
  });
});

describe("contact schema", () => {
  it("accepts a valid message", () => {
    expect(
      contactSchema.safeParse({
        name: "Jordan",
        email: "jordan@example.com",
        message: "Hello, I'd like to talk about a role.",
      }).success,
    ).toBe(true);
  });

  it("rejects a short message and a bad email", () => {
    expect(
      contactSchema.safeParse({ name: "Jo", email: "x", message: "hi" })
        .success,
    ).toBe(false);
  });
});
