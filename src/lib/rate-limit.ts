import "server-only";
import { createHash } from "crypto";

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * NOTE: state lives in the process, so on serverless/multi-instance hosting
 * (e.g. Vercel) each instance has its own counter. This is a sensible baseline
 * for a low-traffic portfolio. For stronger guarantees, swap this for a shared
 * store such as Upstash Redis — see SECURITY.md.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return { allowed: true, remaining: limit - timestamps.length };
}

/**
 * Hash an IP with a server-only salt so we can rate-limit / detect abuse
 * without storing raw IP addresses (data minimisation).
 */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "sentinel-portfolioos-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
