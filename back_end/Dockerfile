# Utilise une image Node
FROM node:20

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste (code source, fichiers Prisma, etc.)
COPY . .

# Par défaut ne fait rien (défini dans docker-compose)
CMD ["sh"]
