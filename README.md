# eBook Store – Documentation Technique

## 1. Présentation Générale

Ce projet est une application web complète de gestion de livres, auteurs, événements, avis et achats, composée de :
- **Un back-end Express.js** (API REST sécurisée, base PostgreSQL, Prisma ORM, Keycloak pour l'authentification)
- **Un front-end Next.js** (React, pages dynamiques, composants réutilisables, intégration API)
- **Une orchestration Docker** pour faciliter le développement local et la production

---

## 2. Architecture Technique

```
[ Utilisateur ]
      │
      ▼
[ Front-end Next.js (port 3001) ]
      │   (fetch HTTP, JWT)
      ▼
[ Back-end Express.js (port 3000) ]
      │   (Prisma ORM)
      ▼
[ PostgreSQL ]

[ Keycloak (port 8080) ]
   │
   └─> Authentification, gestion des rôles
```

- **Communication** : Le front consomme l'API REST du back via `NEXT_PUBLIC_API_URL`.
- **Sécurité** : Authentification JWT (Keycloak), CORS, validation des entrées.
- **Développement** : Tout est orchestré via Docker Compose.

---

## 3. Fonctionnement du Back-end

- **Stack** : Express.js, TypeScript, Prisma ORM, PostgreSQL, Keycloak
- **Entrée principale** : `back_end/src/app.ts` et `server.ts`
- **Routes principales** (toutes préfixées par `/api/`):
  - `/api/books` : gestion des livres
  - `/api/authors` : gestion des auteurs
  - `/api/users` : gestion des utilisateurs
  - `/api/events` : gestion des événements
  - `/api/reviews` : gestion des avis
  - `/api/purchases` : gestion des achats
- **Sécurité** :
  - Authentification via Keycloak (JWT)
  - Middleware de protection des routes (`protect`)
  - Contrôle des rôles (`requireRole`)
- **Base de données** :
  - Modélisée avec Prisma (`back_end/prisma/schema.prisma`)
  - Migrations et seed via Prisma CLI
- **Documentation API** : Swagger UI disponible sur `/api-docs`
- **Démarrage** :
  - En local : `npm run dev` (nécessite PostgreSQL et Keycloak)
  - Avec Docker : tout est automatisé via `docker-compose.yml`

---

## 4. Fonctionnement du Front-end

- **Stack** : Next.js (React), TypeScript, composants modulaires
- **Pages principales** :
  - `/books` : catalogue de livres
  - `/search` : recherche avancée
  - `/writers` : liste des auteurs
  - `/events` : événements
  - `/user` : profil utilisateur
- **Composants réutilisables** :
  - Grilles (`BookGrid`, `AuthorGrid`, ...)
  - Cartes (`BookCard`, `AuthorCard`, ...)
  - Formulaires (`ReviewForm`, `PurchaseForm`, ...)
  - UI (`Card`, `Badge`, `Input`, `ErrorMessage`, ...)
- **Services API** :
  - Centralisés dans `front_end/lib/api.ts`
  - Un service par ressource (livres, auteurs, achats, etc.)
  - Gestion automatique du token JWT
- **Hooks personnalisés** :
  - `useApi` pour gérer loading, error, data
- **Démarrage** :
  - En local : `npm run dev` (port 3001)
  - Avec Docker : service `frontend` dans `docker-compose.yml`

---

## 5. Communication Front/Back (Cycle de vie d'une requête)

1. L'utilisateur interagit avec le front (ex : recherche de livre)
2. Le front appelle un service API (ex : `bookService.search()`)
3. Le service API construit la requête HTTP vers le back (`fetch` avec JWT)
4. Le back vérifie le JWT, traite la requête, interroge la base via Prisma
5. Le back renvoie la réponse JSON au front
6. Le front met à jour l'UI selon la réponse (succès, erreur, loading)

---

## 6. Développement local

### Prérequis
- Docker & Docker Compose
- Node.js (si tu veux lancer hors Docker)

### Lancer tout le projet
```bash
docker-compose up --build
```
- Front accessible sur [http://localhost:3001](http://localhost:3001)
- Back sur [http://localhost:3000/api](http://localhost:3000/api)
- Keycloak sur [http://localhost:8080](http://localhost:8080)

### Variables d'environnement
- Front : `front_end/.env.local`
- Back : `back_end/.env`

### Commandes utiles
- **Back**
  - `npm run dev` : dev avec hot reload
  - `npx prisma migrate dev` : migrations
  - `npx prisma studio` : interface DB
- **Front**
  - `npm run dev` : dev Next.js

---

## 7. Déploiement

- Adapter les variables d'environnement (API URL, DB, Keycloak)
- Utiliser des images Docker pour chaque service
- Orchestration possible sur un VPS, un cloud, ou via un PaaS

---

## 8. Ressources utiles
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [Keycloak](https://www.keycloak.org/)
- [Swagger UI](http://localhost:3000/api-docs)

---

**Pour toute question, consulte les fichiers `COMPLETE_INTEGRATION.md` et `API_INTEGRATION.md` dans `front_end/` pour des exemples détaillés d'intégration.**
