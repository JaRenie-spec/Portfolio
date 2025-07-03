# Utilise une image Node officielle
FROM node:20-slim

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installe les dépendances
RUN npm install

# Copie le reste du code source
COPY . .

# Expose le port utilisé par Next.js
EXPOSE 3000

# Commande de démarrage (mode dev)
CMD ["npm", "run", "dev"]
