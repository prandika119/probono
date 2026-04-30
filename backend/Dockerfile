# =============================================================
# Stage 1: Dependencies
# =============================================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# =============================================================
# Stage 2: Builder
# =============================================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Generate Prisma Client
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate
RUN npm run build

# =============================================================
# Stage 3: Runner (Production Image)
# =============================================================
FROM node:22-alpine AS runner

RUN apk add --no-cache dumb-init

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

WORKDIR /app
COPY prisma.config.ts ./prisma.config.ts

# Copy only what is needed for runtime
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Copy package.json (required by NestJS runtime)
COPY --chown=nestjs:nodejs package.json ./
COPY --chown=nestjs:nodejs prisma.config.ts ./prisma.config.ts

# Make uploads folder and set ownership
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs

# Port
EXPOSE 3009

# Use dumb-init to handle signals correctly
# Run migrations first, then start app
ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/main.js"]
