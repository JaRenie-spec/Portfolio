# Dockerfile

# 1) Build stage
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2) Production runtime
FROM node:20
WORKDIR /app

# Installer netcat-openbsd pour la boucle d'attente
RUN apt-get update \
 && apt-get install -y netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]
