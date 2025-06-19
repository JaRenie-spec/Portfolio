# 1) Builder
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build          # compile le TypeScript en dist/

# 2) Runtime
FROM node:20
WORKDIR /app

# Installer netcat pour la boucle d’attente
RUN apt-get update \
 && apt-get install -y netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "\
    until nc -z postgres 5432; do \
      echo '⏳ Waiting for Postgres…' && sleep 1; \
    done && \
    echo '✅ Postgres ready, migration…' && \
    npx prisma migrate dev --name init && \
    echo '🚀 Starting backend' && \
    node dist/server.js \
"]
