# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine

# ---------- deps ----------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile=false --prod=false

# ---------- build ----------
FROM node:${NODE_VERSION} AS build
WORKDIR /app
RUN corepack enable

# Astro PUBLIC_* must be available at *build* time (baked into the JS bundle).
ARG PUBLIC_SIPMIND_API_BASE=https://sipmind.net
ARG PUBLIC_SIPMIND_API_KEY=
ARG PUBLIC_SITE_URL=https://www.allergoscreen.kz
ENV PUBLIC_SIPMIND_API_BASE=${PUBLIC_SIPMIND_API_BASE}
ENV PUBLIC_SIPMIND_API_KEY=${PUBLIC_SIPMIND_API_KEY}
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- runtime ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV LEADS_DIR=/data/leads

RUN addgroup -S app && adduser -S app -G app && \
    mkdir -p /data/leads && chown -R app:app /data

COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/package.json ./package.json

USER app
EXPOSE 4321
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
