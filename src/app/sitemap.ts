import type { MetadataRoute } from "next";
import { getRepo } from "@/lib/data";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sentinel-portfolioos.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getRepo().listProjects();

  const staticRoutes = [
    "",
    "/projects",
    "/skills",
    "/about",
    "/experience",
    "/certifications",
    "/contact",
    "/cv",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
