FROM node:20 AS builder
WORKDIR /app
# Installe les dépendances
COPY package*.json ./
RUN npm install
# Copie le code et build (TypeScript)
COPY . .
RUN npm run build   # tu dois avoir un script "build" dans package.json pour compiler TS
# Image finale
FROM node:20
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
# Lance l'application compilée
CMD ["node", "dist/app.js"]
