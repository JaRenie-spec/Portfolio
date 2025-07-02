# Intégration Keycloak - Frontend

## 🎯 Objectif

Ce document explique comment le bouton de connexion dans la Navbar a été lié à Keycloak pour l'authentification.

## 📁 Fichiers Créés/Modifiés

### 1. Service Keycloak (`lib/keycloak.ts`)
- **Fonction** : Gestion complète de l'authentification Keycloak
- **Fonctionnalités** :
  - Connexion/déconnexion
  - Gestion des tokens (access + refresh)
  - Récupération des informations utilisateur
  - Stockage sécurisé dans localStorage

### 2. Hook d'Authentification (`lib/hooks/useAuth.ts`)
- **Fonction** : Hook React pour gérer l'état d'authentification
- **Fonctionnalités** :
  - État de connexion
  - Gestion du loading
  - Fonctions login/logout
  - Gestion automatique du callback Keycloak

### 3. Composant Navbar Modifié (`components/app/Navbar/Navbar.tsx`)
- **Modifications** :
  - Intégration du hook `useAuth`
  - Bouton de connexion dynamique
  - Menu utilisateur avec dropdown
  - Affichage des informations utilisateur

### 4. Composant Dropdown Menu (`components/ui/dropdown-menu.tsx`)
- **Fonction** : Menu déroulant pour l'utilisateur connecté
- **Fonctionnalités** :
  - Avatar utilisateur
  - Informations personnelles
  - Liens vers profil et paramètres
  - Bouton de déconnexion

### 5. Page de Callback (`app/auth/callback/page.tsx`)
- **Fonction** : Gestion du retour de Keycloak après authentification
- **Fonctionnalités** :
  - Traitement du code d'autorisation
  - Échange contre un token
  - Redirection vers la page demandée
  - Gestion des erreurs

### 6. Composant de Protection (`components/auth/ProtectedRoute.tsx`)
- **Fonction** : Protection des routes nécessitant une authentification
- **Fonctionnalités** :
  - Vérification de l'authentification
  - Redirection vers la connexion si nécessaire
  - Interface de fallback personnalisable

## 🔧 Configuration Requise

### Variables d'Environnement
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=ebook-store
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-client
```

### Dépendances
```bash
npm install @radix-ui/react-dropdown-menu
```

## 🚀 Utilisation

### 1. Dans un Composant
```typescript
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Déconnexion</button>
      ) : (
        <button onClick={login}>Connexion</button>
      )}
    </div>
  )
}
```

### 2. Protection d'une Route
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  )
}
```

### 3. Service Direct
```typescript
import { keycloakService } from '@/lib/keycloak'

// Connexion
keycloakService.login()

// Vérifier l'authentification
const isAuth = keycloakService.isAuthenticated()

// Obtenir l'utilisateur
const user = keycloakService.getCurrentUser()
```

## 🔄 Flux d'Authentification

1. **Clic sur "Connexion"** → Redirection vers Keycloak
2. **Authentification Keycloak** → Saisie des identifiants
3. **Callback** → Retour vers `/auth/callback` avec un code
4. **Échange Token** → Code échangé contre access + refresh tokens
5. **Stockage** → Tokens stockés dans localStorage
6. **Redirection** → Utilisateur redirigé vers la page demandée

## 🎨 Interface Utilisateur

### État Non Connecté
- Bouton "Connexion" avec icône utilisateur
- Clic redirige vers Keycloak

### État Connecté
- Avatar avec initiales de l'utilisateur
- Nom d'utilisateur affiché
- Menu dropdown avec :
  - Informations utilisateur (nom, email)
  - Lien vers le profil
  - Lien vers les paramètres
  - Bouton de déconnexion

## 🔒 Sécurité

- **Tokens JWT** : Validation côté serveur
- **Refresh Token** : Renouvellement automatique
- **Expiration** : Vérification automatique
- **Stockage** : localStorage sécurisé
- **CORS** : Configuration appropriée

## 🐛 Dépannage

### Erreurs Courantes
1. **"Invalid redirect URI"** → Vérifier la configuration Keycloak
2. **"Client not found"** → Vérifier le Client ID
3. **"Token expired"** → Le refresh devrait être automatique

### Logs de Débogage
Activez la console du navigateur pour voir les logs d'authentification.

## 📚 Documentation Complète

Voir le fichier `KEYCLOAK_SETUP.md` pour la configuration complète de Keycloak.
