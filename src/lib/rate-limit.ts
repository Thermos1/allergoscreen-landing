// Simple in-memory token bucket per IP. Single-instance — for low-volume landing.
// If we ever scale beyond one node, swap with Redis-backed sliding window.

interface Bucket {
  tokens: number;
  resetAt: number;
}

const LIMIT = 5; // 5 submissions
const WINDOW_MS = 60 * 60 * 1000; // per hour
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(ip);

  if (!existing || existing.resetAt < now) {
    const bucket: Bucket = { tokens: LIMIT - 1, resetAt: now + WINDOW_MS };
    buckets.set(ip, bucket);
    return { ok: true, remaining: bucket.tokens, resetAt: bucket.resetAt };
  }

  if (existing.tokens <= 0) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.tokens -= 1;
  return { ok: true, remaining: existing.tokens, resetAt: existing.resetAt };
}

// Periodic cleanup of expired buckets so the map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [ip, bucket] of buckets) {
        if (bucket.resetAt < now) buckets.delete(ip);
      }
    },
    10 * 60 * 1000,
  );
}
