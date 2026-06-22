import { describe, expect, it } from "vitest";
import { getRepo, isDemoMode } from "@/lib/data";
import { DemoRepo } from "@/lib/data/demo/repo";

describe("data layer provider selection", () => {
  it("uses the demo provider when Supabase env vars are absent", () => {
    expect(isDemoMode()).toBe(true);
    expect(getRepo()).toBeInstanceOf(DemoRepo);
  });
});

describe("demo provider reads", () => {
  const repo = new DemoRepo();

  it("returns all six demo projects", async () => {
    const projects = await repo.listProjects();
    expect(projects).toHaveLength(6);
  });

  it("returns only featured projects from listFeaturedProjects", async () => {
    const featured = await repo.listFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("returns a project with case-study sections by slug", async () => {
    const project = await repo.getProjectBySlug("sentinel-helpdesk-ai");
    expect(project).not.toBeNull();
    expect(project?.sections?.length).toBeGreaterThanOrEqual(6);
    const kinds = project?.sections?.map((s) => s.kind) ?? [];
    expect(kinds).toContain("security");
    expect(kinds).toContain("learned");
  });

  it("returns null for an unknown slug", async () => {
    expect(await repo.getProjectBySlug("does-not-exist")).toBeNull();
  });

  it("covers all six skill categories", async () => {
    const skills = await repo.listSkills();
    const categories = new Set(skills.map((s) => s.category));
    expect(categories.size).toBe(6);
  });

  it("acknowledges a contact message without persisting in demo mode", async () => {
    const result = await repo.createMessage({
      name: "Test",
      email: "test@example.com",
      subject: "Hi",
      message: "Hello there",
      ip_hash: null,
    });
    expect(result.ok).toBe(true);
    expect(result.demo).toBe(true);
  });
});
