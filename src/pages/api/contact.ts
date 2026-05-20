import type { APIRoute } from "astro";
import { sendLeadToTelegram, type LeadPayload } from "../../lib/telegram";
import { appendLeadJsonl } from "../../lib/leads-store";
import { checkRateLimit } from "../../lib/rate-limit";

export const prerender = false;

const ALLOWED_SOURCES = new Set(["contact", "callback", "ask"]);

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function trim(v: FormDataEntryValue | null, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  return s.slice(0, max);
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
      },
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400 });
  }

  // Honeypot — silent success
  const honey = trim(form.get("website"), 200);
  if (honey) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const source = trim(form.get("source"), 30) ?? "contact";
  if (!ALLOWED_SOURCES.has(source)) {
    return new Response(JSON.stringify({ error: "bad_source" }), { status: 400 });
  }

  const payload: LeadPayload = {
    source,
    name: trim(form.get("name"), 100),
    phone: trim(form.get("phone"), 50),
    email: trim(form.get("email"), 150),
    topic: trim(form.get("topic"), 100),
    message: trim(form.get("message"), 2000),
    city: trim(form.get("city"), 50),
    locale: trim(form.get("locale"), 5),
    ip,
    ua: request.headers.get("user-agent") ?? undefined,
  };

  // Minimal validation
  if (!payload.phone && !payload.email) {
    return new Response(JSON.stringify({ error: "missing_contact" }), { status: 400 });
  }

  // Fan out: store + notify (do not block response on telegram failure)
  await appendLeadJsonl(payload);
  sendLeadToTelegram(payload).catch((e) =>
    console.error("[contact] tg fanout failed:", e),
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
