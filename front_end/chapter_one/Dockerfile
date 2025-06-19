# 1) Builder
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build               # build Next.js en .next/

# 2) Runtime
FROM node:20
WORKDIR /app

# (pas besoin de netcat ici)
COPY --from=builder /app ./

CMD ["npm", "run", "dev"]     # next start lancera le build optimisé
