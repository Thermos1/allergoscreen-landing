// Server-side proxy to SIPmind widget /chat endpoint.
// Holds the SIPmind API key server-side; browser only sees same-origin requests.

import type { APIRoute } from "astro";

export const prerender = false;

const SIPMIND_BASE = (process.env.SIPMIND_API_BASE || "https://sipmind.net").replace(/\/$/, "");
const SIPMIND_KEY = process.env.SIPMIND_API_KEY || "";

export const POST: APIRoute = async ({ request }) => {
  if (!SIPMIND_KEY) {
    return new Response(
      JSON.stringify({
        reply:
          "Виджет временно недоступен (конфигурация). Позвоните в колл-центр или напишите в WhatsApp.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }
  // Pass through the body verbatim — message, history, session_id.
  let body: string;
  try {
    body = await request.text();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400 });
  }
  try {
    const res = await fetch(`${SIPMIND_BASE}/api/v1/widget/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${SIPMIND_KEY}`,
      },
      body,
      signal: AbortSignal.timeout(30000),
    });
    const respBody = await res.text();
    return new Response(respBody, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    console.error("[widget/chat] proxy error:", err);
    return new Response(
      JSON.stringify({
        reply:
          "Извините, ассистент сейчас недоступен. Попробуйте через минуту или позвоните в колл-центр.",
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
};
