// Append a lead to a JSONL file on the persistent volume.
// On Coolify: mount `/data` as a persistent volume so leads survive redeploys.

import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { LeadPayload } from "./telegram";

const LEADS_DIR = process.env.LEADS_DIR || "/data/leads";

function todayFile(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return join(LEADS_DIR, `leads-${yyyy}-${mm}-${dd}.jsonl`);
}

export async function appendLeadJsonl(payload: LeadPayload): Promise<void> {
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    const line =
      JSON.stringify({ ...payload, t: new Date().toISOString() }) + "\n";
    await appendFile(todayFile(), line, "utf8");
  } catch (err) {
    console.error("[leads-store] append failed:", err);
  }
}
