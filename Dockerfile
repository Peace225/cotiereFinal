FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer TOUTES les dépendances (devDependencies nécessaires pour le build Next.js)
RUN npm ci

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Builder l'application
RUN npm run build

# Supprimer les devDependencies après le build
RUN npm prune --production

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
