FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat nginx
RUN npm install -g pnpm

# ========== CMS ==========
FROM base AS cms-deps
WORKDIR /app/cms
COPY cms/package.json cms/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS cms-builder
WORKDIR /app/cms
COPY --from=cms-deps /app/cms/node_modules ./node_modules
COPY cms/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ========== WEB ==========
FROM base AS web-deps
WORKDIR /app/web
COPY web/package.json web/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS web-builder
WORKDIR /app/web
COPY --from=web-deps /app/web/node_modules ./node_modules
COPY web/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ========== RUNNER ==========
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# CMS
COPY --from=cms-builder /app/cms/.next/standalone ./cms/
COPY --from=cms-builder /app/cms/.next/static ./cms/.next/static

# WEB
COPY --from=web-builder /app/web/.next/standalone ./web/
COPY --from=web-builder /app/web/.next/static ./web/.next/static
COPY --from=web-builder /app/web/public ./web/public

# nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD sh -c "nginx -g 'daemon off;' & PORT=3001 node /app/cms/server.js & PORT=3000 node /app/web/server.js & wait"