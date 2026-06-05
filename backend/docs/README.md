# Documentation CÔTIÈRE Platform

## Guide de démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- ngrok (pour l'accès externe)

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
# Copier .env.example en .env et remplir les valeurs

# 3. Initialiser la base de données
npx prisma migrate dev

# 4. Créer le compte admin
npx tsx prisma/seed-admin.ts

# 5. Démarrer le serveur
npm run dev
```

### Démarrage rapide (Windows)
Double-cliquer sur `start.bat` — lance ngrok + serveur automatiquement.

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth |
| `NEXTAUTH_URL` | URL publique du site |
| `RESEND_API_KEY` | Clé API Resend (emails) |
| `CLOUDINARY_*` | Config upload images |

## Déploiement

### Railway
Le fichier `railway.toml` est configuré pour Railway.
Ajouter les variables d'environnement dans le dashboard Railway.

### Docker
```bash
docker build -t cotiere-platform .
docker run -p 3000:3000 cotiere-platform
```

## Architecture

Voir `README.md` à la racine pour la structure complète du projet.
