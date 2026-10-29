
# ---------- Dependencies ----------
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=optional


# ---------- Development ----------
FROM node:22-alpine AS development

WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# ---------- Production Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


# ---------- Production Runtime ----------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
