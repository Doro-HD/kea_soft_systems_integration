FROM node:22-alpine AS base

FROM base AS builder

WORKDIR /app

RUN apk add --no-cache gcompat
RUN apk add pnpm

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build


FROM builder AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

USER hono
EXPOSE 3000

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

CMD ["node", "/app/dist/index.js"]
