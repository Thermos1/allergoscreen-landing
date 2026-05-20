// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://www.allergoscreen.kz",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [tailwind({ applyBaseStyles: false })],
  server: { host: "0.0.0.0", port: 4321 },
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "kk", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  security: {
    checkOrigin: false,
  },
  vite: {
    server: { allowedHosts: true },
  },
});
