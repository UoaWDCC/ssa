FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat nginx
# Matches "packageManager" in the root package.json; pnpm 10 tries to
# self-manage down to 9 mid-install and fails on arm64.
RUN npm install -g pnpm@9.0.0

# ========== DEPS ==========
# Install all workspace deps in one stage using the root lockfile
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/
COPY cms/package.json ./cms/
RUN pnpm install --frozen-lockfile

# ========== CMS ==========
FROM base AS cms-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/
COPY cms/package.json ./cms/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/cms/node_modules ./cms/node_modules
COPY cms/ ./cms/
WORKDIR /app/cms
ENV NEXT_TELEMETRY_DISABLED=1
# nginx gives /_next to the web app; see cms/next.config.mjs.
ENV CMS_ASSET_PREFIX=/cms-assets
RUN pnpm build

# ========== WEB ==========
FROM base AS web-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/
COPY cms/package.json ./cms/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY web/ ./web/
WORKDIR /app/web
ENV NEXT_TELEMETRY_DISABLED=1
# Inlined into the browser bundle at build time, so it cannot be a runtime var.
ARG NEXT_PUBLIC_CMS_URL=https://ssa-prod.fly.dev
ENV NEXT_PUBLIC_CMS_URL=$NEXT_PUBLIC_CMS_URL
RUN pnpm build

# ========== RUNNER ==========
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next's standalone server binds to $HOSTNAME, which Docker sets to the
# container id, leaving nginx's proxy_pass to localhost refused.
ENV HOSTNAME=0.0.0.0

# standalone output is relative to the workspace root, so it contains
# <app>/server.js plus a node_modules. Separate roots keep the two
# node_modules apart — the CMS is on Next 15, web on Next 16.

# CMS -> /app/cms-runtime/cms/server.js
COPY --from=cms-builder /app/cms/.next/standalone/ ./cms-runtime/
COPY --from=cms-builder /app/cms/.next/static ./cms-runtime/cms/.next/static

# WEB -> /app/web-runtime/web/server.js
COPY --from=web-builder /app/web/.next/standalone/ ./web-runtime/
COPY --from=web-builder /app/web/.next/static ./web-runtime/web/.next/static
COPY --from=web-builder /app/web/public ./web-runtime/web/public

# nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD sh -c "PORT=3001 node /app/cms-runtime/cms/server.js & PORT=3000 node /app/web-runtime/web/server.js & nginx -g 'daemon off;'"
