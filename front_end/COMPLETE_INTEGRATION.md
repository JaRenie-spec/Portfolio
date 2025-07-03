# Intégration Complète Front-Back

## Vue d'ensemble

Cette documentation détaille toutes les liaisons créées entre le front-end Next.js et le back-end Express.js pour l'application eBook Store.

## Architecture des Services API

### 1. Service API Principal (`lib/api.ts`)

**Fonctionnalités :**
- Configuration centralisée de l'URL de l'API
- Gestion automatique des headers d'authentification
- Types TypeScript pour toutes les entités
- Services spécialisés pour chaque module

**Services disponibles :**
- `bookService` - Gestion des livres
- `authorService` - Gestion des auteurs
- `userService` - Gestion des utilisateurs
- `eventService` - Gestion des événements
- `reviewService` - Gestion des avis
- `purchaseService` - Gestion des achats
- `authService` - Authentification

### 2. Hook personnalisé (`lib/hooks/useApi.ts`)

**Fonctionnalités :**
- Gestion des états de chargement, erreur et données
- Réutilisable pour tous les appels API
- Fonction de réinitialisation
- Gestion automatique des erreurs

## Composants Créés

### 1. Composants de Grille

#### `AuthorGrid` (`components/app/AuthorGrid/AuthorGrid.tsx`)
- **Fonction** : Affichage de la liste des auteurs
- **API** : `authorService.getAll()`
- **Fonctionnalités** :
  - Chargement avec skeleton
  - Gestion d'erreur
  - Affichage conditionnel
  - Pagination

#### `EventGrid` (`components/app/EventGrid/EventGrid.tsx`)
- **Fonction** : Affichage de la liste des événements
- **API** : `eventService.getAll()`
- **Fonctionnalités** :
  - Affichage des événements passés/futurs
  - Badges pour événements en ligne
  - Informations détaillées (lieu, participants, etc.)

### 2. Composants de Carte

#### `AuthorCard` (`components/app/AuthorCard/AuthorCard.tsx`)
- **Fonction** : Affichage d'un auteur individuel
- **Données** : Nom, bio, avatar, nombre de livres
- **Actions** : Voir profil, voir livres

#### `EventCard` (`components/app/EventCard/EventCard.tsx`)
- **Fonction** : Affichage d'un événement individuel
- **Données** : Titre, description, date, lieu, auteur
- **Actions** : Voir détails, s'inscrire

#### `ReviewCard` (`components/app/ReviewCard/ReviewCard.tsx`)
- **Fonction** : Affichage d'un avis individuel
- **Données** : Note, commentaire, utilisateur, livre
- **Fonctionnalités** : Système d'étoiles, date de création

#### `PurchaseCard` (`components/app/PurchaseCard/PurchaseCard.tsx`)
- **Fonction** : Affichage d'un achat individuel
- **Données** : Livre, montant, date, statut
- **Actions** : Voir livre, télécharger (si terminé)

### 3. Composants de Liste

#### `ReviewList` (`components/app/ReviewList/ReviewList.tsx`)
- **Fonction** : Affichage de la liste des avis
- **API** : `reviewService.getAll()` ou `reviewService.getByBook()`
- **Fonctionnalités** :
  - Filtrage par livre
  - Limitation du nombre d'avis
  - États de chargement et d'erreur

#### `PurchaseList` (`components/app/PurchaseList/PurchaseList.tsx`)
- **Fonction** : Affichage de l'historique des achats
- **API** : `purchaseService.getUserPurchases()`
- **Fonctionnalités** :
  - Affichage des achats de l'utilisateur connecté
  - Statuts des achats (en cours, terminé, annulé)

### 4. Composants de Formulaire

#### `ReviewForm` (`components/app/ReviewForm/ReviewForm.tsx`)
- **Fonction** : Formulaire pour ajouter un avis
- **API** : `reviewService.create()`
- **Fonctionnalités** :
  - Système de notation avec étoiles
  - Validation des champs
  - Gestion des erreurs

#### `PurchaseForm` (`components/app/PurchaseForm/PurchaseForm.tsx`)
- **Fonction** : Formulaire de paiement
- **API** : `purchaseService.create()`
- **Fonctionnalités** :
  - Méthodes de paiement multiples
  - Validation des cartes bancaires
  - Résumé de l'achat

### 5. Composants UI Réutilisables

#### `ErrorMessage` (`components/ui/ErrorMessage.tsx`)
- **Fonction** : Affichage d'erreurs standardisées
- **Fonctionnalités** :
  - Titre et description personnalisables
  - Bouton de retry
  - Détails de l'erreur (développement)

#### `LoadingSpinner` (`components/ui/LoadingSpinner.tsx`)
- **Fonction** : Indicateur de chargement
- **Fonctionnalités** :
  - Tailles multiples (sm, md, lg)
  - Texte personnalisable

#### `ErrorBoundary` (`components/ui/ErrorBoundary.tsx`)
- **Fonction** : Gestion d'erreurs globales React
- **Fonctionnalités** :
  - Capture des erreurs de composants
  - Interface de récupération
  - Mode debug en développement

## Pages Créées/Modifiées

### 1. Page des Livres (`app/books/page.tsx`)
- **Modifications** : Intégration de `BookGrid` avec API
- **Fonctionnalités** : Recherche, filtres, pagination

### 2. Page de Recherche (`app/search/page.tsx`)
- **Fonction** : Recherche de livres et auteurs
- **API** : `bookService.search()`, `authorService.search()`
- **Fonctionnalités** :
  - Recherche en temps réel
  - Paramètres d'URL
  - Affichage des résultats

### 3. Page des Auteurs (`app/writers/page.tsx`)
- **Modifications** : Intégration de `AuthorGrid` avec API
- **Fonctionnalités** : Recherche, filtres, pagination

### 4. Page des Événements (`app/events/page.tsx`)
- **Fonction** : Affichage de tous les événements
- **API** : `eventService.getAll()`
- **Fonctionnalités** : Filtres, tri, pagination

### 5. Page de Profil Utilisateur (`app/user/page.tsx`)
- **Fonction** : Profil utilisateur complet
- **API** : `userService.getProfile()`, `purchaseService.getUserPurchases()`
- **Fonctionnalités** :
  - Informations personnelles
  - Historique des achats
  - Statistiques utilisateur
  - Onglets multiples

## Configuration

### 1. Variables d'Environnement (`env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=ebook-store
```

### 2. Configuration Next.js (`next.config.ts`)
- Variables d'environnement
- Rewrites pour les appels API
- Configuration webpack pour Docker

## Gestion des Erreurs

### 1. Niveaux d'Erreur
- **Erreurs réseau** : Problèmes de connexion
- **Erreurs HTTP** : Codes 4xx/5xx
- **Erreurs de validation** : Données invalides
- **Erreurs d'authentification** : Token expiré

### 2. Composants d'Erreur
- `ErrorMessage` : Erreurs standardisées
- `ErrorBoundary` : Erreurs React globales
- Gestion dans chaque composant avec `useApi`

## Authentification

### 1. Gestion des Tokens
- Stockage automatique dans localStorage
- Ajout automatique aux headers
- Vérification de validité

### 2. Services d'Auth
- `authService.login()` : Connexion
- `authService.register()` : Inscription
- `authService.logout()` : Déconnexion
- `authService.verifyToken()` : Vérification

## Fonctionnalités par Module

### 1. Livres
- ✅ Liste des livres
- ✅ Recherche de livres
- ✅ Détails d'un livre
- ✅ Création de livre (auteurs/admins)
- ✅ Modification de livre
- ✅ Suppression de livre

### 2. Auteurs
- ✅ Liste des auteurs
- ✅ Recherche d'auteurs
- ✅ Profil d'auteur
- ✅ Modification de profil
- ✅ Suppression d'auteur

### 3. Utilisateurs
- ✅ Profil utilisateur
- ✅ Modification de profil
- ✅ Gestion des rôles
- ✅ Statistiques utilisateur

### 4. Événements
- ✅ Liste des événements
- ✅ Détails d'événement
- ✅ Création d'événement
- ✅ Modification d'événement
- ✅ Suppression d'événement

### 5. Avis
- ✅ Liste des avis
- ✅ Avis par livre
- ✅ Création d'avis
- ✅ Modification d'avis
- ✅ Suppression d'avis

### 6. Achats
- ✅ Historique des achats
- ✅ Création d'achat
- ✅ Statuts d'achat
- ✅ Téléchargement de livres

## Tests et Validation

### 1. Validation des Données
- Validation côté client avec TypeScript
- Validation côté serveur avec Zod
- Messages d'erreur personnalisés

### 2. Gestion des États
- États de chargement
- États d'erreur
- États de succès
- États vides

## Déploiement

### 1. Configuration Docker
- Variables d'environnement automatiques
- Communication inter-conteneurs
- Configuration de production

### 2. Variables de Production
```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
NEXT_PUBLIC_ENV=production
```

## Prochaines Étapes

### 1. Fonctionnalités à Ajouter
- [ ] Système de notifications
- [ ] Panier d'achat
- [ ] Système de favoris
- [ ] Notifications push
- [ ] Mode hors ligne

### 2. Optimisations
- [ ] Mise en cache des données
- [ ] Pagination infinie
- [ ] Recherche avancée
- [ ] Filtres complexes

### 3. Sécurité
- [ ] Validation côté client renforcée
- [ ] Protection CSRF
- [ ] Rate limiting
- [ ] Audit des actions

## Ressources

- [Documentation API Backend](../back_end/src/routes/README.md)
- [Guide d'utilisation des hooks](./API_INTEGRATION.md)
- [Configuration Docker](../back_end/docker-compose.yml)
- [Types TypeScript](./lib/api.ts)
