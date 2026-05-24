// 301-redirects from old allergoscreen.kz URL structure to new routes.
// Critical at DNS-cutover moment: Google has indexed old URLs over 5+ years.
// Without these, old backlinks would 404 and we'd lose ranking. With 301s,
// link equity passes to the new pages.

import { defineMiddleware } from "astro:middleware";

// path-prefix → new canonical path (RU default; KK gets prefixed below)
const REDIRECTS: Record<string, string> = {
  // Old WP-style homepage
  "/ru/homepage": "/",
  "/ru/homepage/": "/",
  // Old legal docs (RU)
  "/ru/agreement": "/consent",
  "/ru/agreement/": "/consent",
  "/ru/contract-medserv": "/offer",
  "/ru/contract-medserv/": "/offer",
  // Russian-language landing pages (some sites had these URLs)
  "/перечень-аллергенов": "/services",
  "/перечень-аллергенов/": "/services",
  "/прайс-листы": "/services",
  "/прайс-листы/": "/services",
  "/осмс": "/osms",
  "/осмс/": "/osms",
  "/контакты": "/locations",
  "/контакты/": "/locations",
  "/тарификатор": "/osms",
  "/тарификатор/": "/osms",
  "/руководство-по-качеству": "/quality",
  "/quality-guide": "/quality",
  "/quality-guide/": "/quality",
  // Kazakh equivalents (Cyrillic + encoded)
  "/медициналық-қызмет-көрсетуге-арналг": "/kk/offer",
  "/медициналық-қызмет-көрсетуге-арналг/": "/kk/offer",
  "/ерікті-келісім": "/kk/consent",
  "/ерікті-келісім/": "/kk/consent",
  "/талдауға-дайындық": "/kk/preparation",
  "/талдауға-дайындық/": "/kk/preparation",
};

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  // decode URL-encoded path for matching (browsers send punycode-like %D1%80...)
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // malformed encoding — fall through with raw path
  }
  const target = REDIRECTS[path] ?? REDIRECTS[decoded];
  if (target) {
    return context.redirect(target, 301);
  }
  return next();
});
