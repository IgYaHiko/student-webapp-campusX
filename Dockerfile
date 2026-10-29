
# ---------- Dependencies ----------
FROM node:22-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=optional

# Explicitly install Linux ARM64 GNU native bindings
RUN npm install --no-save --package-lock=false --include=optional \
    lightningcss-linux-arm64-gnu@1.32.0 \
    @tailwindcss/oxide-linux-arm64-gnu@4.3.3


# ---------- Development ----------
FROM node:22-bookworm-slim AS development

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# ---------- Production Build ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ---------- Production Runtime ----------
FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
