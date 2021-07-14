FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY yarn.lock yarn.lock
COPY package.json package.json
COPY apps/app/package.json apps/app/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/mongodb2/package.json packages/mongodb2/package.json
COPY packages/context-api/package.json packages/context-api/package.json
COPY packages/pd-cli/package.json packages/pd-cli/package.json
RUN yarn install --frozen-lockfile


# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/app/node_modules ./apps/app/node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
RUN ls ./node_modules
WORKDIR /app/apps/app
RUN yarn build
WORKDIR /app
RUN yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS app
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/apps/app/public ./apps/app/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/app/.next ./apps/app/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/app/node_modules ./app/node_modules
COPY --from=builder /app/apps/api/node_modules ./api/node_modules

COPY . .
# RUN rm app/next.config.js


USER nextjs

EXPOSE 3000
