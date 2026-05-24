// XML sitemap — exposes all canonical URLs with hreflang alternates for Google.
// Critical for migration: tells Google «these are all our pages» so it doesn't
// rely solely on internal link crawling and doesn't drop pages from index.

import type { APIRoute } from "astro";

export const prerender = false;

const SITE = (process.env.PUBLIC_SITE_URL || "https://www.allergoscreen.kz").replace(/\/$/, "");

// All canonical paths + which locales they exist in.
// Legal pages (offer/consent/preparation) exist in ru + kk only.
// All other content pages exist in all 3 locales.
const PAGES: { path: string; locales: ("ru" | "kk" | "en")[]; priority: number; changefreq: string }[] = [
  { path: "/", locales: ["ru", "kk", "en"], priority: 1.0, changefreq: "weekly" },
  { path: "/services", locales: ["ru", "kk", "en"], priority: 0.9, changefreq: "monthly" },
  { path: "/locations", locales: ["ru", "kk", "en"], priority: 0.9, changefreq: "monthly" },
  { path: "/about", locales: ["ru", "kk", "en"], priority: 0.8, changefreq: "monthly" },
  { path: "/osms", locales: ["ru", "kk", "en"], priority: 0.8, changefreq: "monthly" },
  { path: "/preparation", locales: ["ru", "kk"], priority: 0.7, changefreq: "yearly" },
  { path: "/offer", locales: ["ru", "kk"], priority: 0.4, changefreq: "yearly" },
  { path: "/consent", locales: ["ru", "kk"], priority: 0.4, changefreq: "yearly" },
  { path: "/privacy", locales: ["ru"], priority: 0.3, changefreq: "yearly" },
  { path: "/complaints", locales: ["ru"], priority: 0.3, changefreq: "yearly" },
  { path: "/quality", locales: ["ru"], priority: 0.3, changefreq: "yearly" },
];

function localizedUrl(path: string, locale: string): string {
  if (locale === "ru") return `${SITE}${path}`;
  if (path === "/") return `${SITE}/${locale}/`;
  return `${SITE}/${locale}${path}`;
}

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  for (const page of PAGES) {
    for (const locale of page.locales) {
      const loc = localizedUrl(page.path, locale);
      // Alternate links for the same page in other locales (hreflang)
      const alternates = page.locales
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt}" href="${localizedUrl(page.path, alt)}" />`,
        )
        .join("\n");
      urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
${alternates}
  </url>`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
