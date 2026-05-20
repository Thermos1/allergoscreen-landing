// Server-side proxy to SIPmind widget /config endpoint.
// API key lives in server env (SIPMIND_API_KEY), never reaches the browser.

import type { APIRoute } from "astro";

export const prerender = false;

const SIPMIND_BASE = (process.env.SIPMIND_API_BASE || "https://sipmind.net").replace(/\/$/, "");
const SIPMIND_KEY = process.env.SIPMIND_API_KEY || "";

export const GET: APIRoute = async () => {
  if (!SIPMIND_KEY) {
    return new Response(
      JSON.stringify({ error: "widget_not_configured" }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }
  try {
    const res = await fetch(`${SIPMIND_BASE}/api/v1/widget/config`, {
      headers: { Authorization: `Bearer ${SIPMIND_KEY}` },
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    console.error("[widget/config] proxy error:", err);
    return new Response(
      JSON.stringify({ error: "upstream_error" }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
};
