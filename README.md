# CÔTIÈRE Platform — Next.js 14 (App Router)

## Structure du projet

```
cotiere-platform/
│
├── app/                        # APPLICATION PRINCIPALE (Next.js App Router)
│   ├── (admin)/                # ► ADMIN — Pages du panneau d'administration
│   │   └── admin/
│   │       ├── dashboard/      #   Vue d'ensemble & réservations
│   │       ├── hebergement/    #   Gestion chambres & réservations hôtel
│   │       ├── evenements/     #   Gestion événements
│   │       ├── excursions/     #   Gestion excursions & tourisme
│   │       ├── studio/         #   Gestion Studio+
│   │       ├── musique/        #   Gestion musique
│   │       ├── market/         #   Gestion CÔTIÈRE Market
│   │       ├── location/       #   Gestion location équipements
│   │       ├── clients/        #   Liste des clients
│   │       ├── paiements/      #   Suivi des paiements
│   │       ├── reservations/   #   Toutes les réservations
│   │       ├── statistiques/   #   Statistiques & rapports
│   │       └── ...
│   │
│   ├── (frontend)/             # ► FRONTEND — Pages visibles par les clients
│   │   ├── page.tsx            #   Page d'accueil
│   │   ├── services/           #   Pages des services
│   │   │   ├── hebergement/    #   Hébergement
│   │   │   ├── evenements/     #   Événements
│   │   │   ├── tourisme/       #   Tourisme & voyages
│   │   │   ├── studio/         #   Studio+
│   │   │   ├── music/          #   Musique
│   │   │   ├── market/         #   Market
│   │   │   ├── location/       #   Location
│   │   │   └── ...
│   │   ├── connexion/          #   Page de connexion
│   │   ├── inscription/        #   Page d'inscription
│   │   └── mon-espace/         #   Espace client
│   │
│   └── api/                    # ► BACKEND — API Routes (serveur)
│       ├── auth/               #   Authentification (login, register, reset)
│       ├── events/             #   API événements & réservations
│       ├── excursions/         #   API excursions
│       ├── studio/             #   API studio
│       ├── music/              #   API musique
│       ├── equipment/          #   API location équipements
│       ├── market/             #   API market
│       ├── rooms/              #   API chambres
│       ├── payments/           #   API paiements
│       ├── reviews/            #   API avis
│       └── admin/              #   API admin (dashboard, clients, devis...)
│
├── components/                 # ► COMPOSANTS RÉUTILISABLES
│   ├── admin/                  #   Composants UI admin
│   │   ├── AdminNavbar.tsx
│   │   ├── ExportButton.tsx
│   │   ├── DevisButton.tsx
│   │   ├── ImageUploader.tsx
│   │   └── ...
│   ├── frontend/               #   Composants UI frontend
│   │   ├── layout/             #   Navbar, Footer
│   │   ├── home/               #   Sections page d'accueil
│   │   ├── events/             #   Formulaires événements
│   │   ├── excursions/         #   Formulaires excursions
│   │   └── ...
│   └── ui/                     #   Composants UI génériques
│
├── lib/                        # ► UTILITAIRES & SERVICES
│   ├── prisma.ts               #   Client base de données
│   ├── auth.ts                 #   Configuration authentification
│   ├── email.ts                #   Service d'envoi d'emails
│   ├── pdf.ts                  #   Génération de PDF
│   ├── validations.ts          #   Schémas de validation
│   └── utils.ts                #   Fonctions utilitaires
│
├── database/                   # ► BASE DE DONNÉES
│   └── backup_20260502.sql     #   Backup PostgreSQL
│
├── prisma/                     # ► SCHÉMA & MIGRATIONS
│   ├── schema.prisma           #   Modèles de données
│   ├── migrations/             #   Historique des migrations
│   └── seed-admin.ts           #   Script création compte admin
│
├── public/                     # ► ASSETS STATIQUES
│   ├── Images/                 #   Images du site
│   └── uploads/                #   Fichiers uploadés
│
├── docs/                       # ► DOCUMENTATION
├── scripts/                    # ► SCRIPTS UTILITAIRES
│
├── .env                        # Variables d'environnement (non commité)
├── Dockerfile                  # Configuration Docker
├── railway.toml                # Configuration déploiement Railway
├── start.bat                   # Démarrage rapide (Windows)
└── package.json                # Dépendances du projet
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Ou double-cliquer sur start.bat (lance ngrok + serveur)
```

## Accès

| Rôle  | URL | Email | Mot de passe |
|-------|-----|-------|--------------|
| Admin | `/admin/dashboard` | `admin@cotiere.ci` | `Cotiere2025!` |
| Client | `/connexion` | — | — |

## Technologies

- **Framework** : Next.js 14 (App Router)
- **Base de données** : PostgreSQL + Prisma ORM
- **Auth** : NextAuth.js
- **UI** : Tailwind CSS + Lucide Icons
- **PDF** : jsPDF
- **Tunnel** : ngrok (`size-matador-savior.ngrok-free.dev`)
