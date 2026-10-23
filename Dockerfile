# ---------- Stage 1: Dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Stage 2: Development (Hot Reload) ----------
FROM node:22-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Stage 3: Builder (Compile for Prod) ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If you have environment variables needed at build time, set them here
# ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
RUN npm run build

# ---------- Stage 4: Production Runner ----------
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# Next.js standalone mode copies only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]