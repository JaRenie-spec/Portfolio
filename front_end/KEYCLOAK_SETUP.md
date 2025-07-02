# Configuration Keycloak pour l'Authentification

## Vue d'ensemble

Ce document explique comment configurer Keycloak pour l'authentification de l'application frontend.

## Prérequis

- Keycloak installé et configuré (via Docker Compose)
- Realm `ebook-store` créé
- Client `frontend-client` configuré

## Configuration Keycloak

### 1. Créer le Realm

1. Connectez-vous à l'interface d'administration Keycloak (http://localhost:8080)
2. Créez un nouveau realm nommé `ebook-store`

### 2. Configurer le Client

1. Dans le realm `ebook-store`, allez dans **Clients**
2. Cliquez sur **Create client**
3. Configurez le client :
   - **Client ID**: `frontend-client`
   - **Client Protocol**: `openid-connect`
   - **Root URL**: `http://localhost:3001`

4. Dans l'onglet **Settings** :
   - **Access Type**: `public`
   - **Valid Redirect URIs**:
     - `http://localhost:3001/*`
     - `http://localhost:3001/auth/callback`
   - **Web Origins**: `http://localhost:3001`
   - **Admin URL**: `http://localhost:3001`

5. Dans l'onglet **Credentials** :
   - Notez le **Client Secret** (optionnel pour public client)

### 3. Configurer les Rôles

1. Allez dans **Realm Roles**
2. Créez les rôles suivants :
   - `user` - Utilisateur standard
   - `author` - Auteur
   - `admin` - Administrateur

### 4. Configurer les Utilisateurs

1. Allez dans **Users**
2. Créez des utilisateurs de test :
   - **Username**: `user1`
   - **Email**: `user1@example.com`
   - **First Name**: `John`
   - **Last Name**: `Doe`
   - **Email Verified**: `ON`
   - **Enabled**: `ON`

3. Dans l'onglet **Credentials** :
   - **Password**: `password123`
   - **Temporary**: `OFF`

4. Dans l'onglet **Role Mappings** :
   - Assignez le rôle `user` à l'utilisateur

## Configuration Frontend

### 1. Variables d'Environnement

Créez un fichier `.env.local` dans le dossier `front_end/` :

```env
# Configuration API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Configuration pour le développement
NEXT_PUBLIC_ENV=development

# Configuration Keycloak
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=ebook-store
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-client
```

### 2. Installation des Dépendances

```bash
cd front_end
npm install @radix-ui/react-dropdown-menu
```

## Utilisation

### 1. Hook d'Authentification

```typescript
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bonjour {user?.preferred_username} !</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={login}>Connexion</button>
      )}
    </div>
  )
}
```

### 2. Protection des Routes

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

### 3. Service Keycloak

```typescript
import { keycloakService } from '@/lib/keycloak'

// Connexion
keycloakService.login()

// Déconnexion
keycloakService.logout()

// Vérifier l'authentification
const isAuth = keycloakService.isAuthenticated()

// Obtenir l'utilisateur
const user = keycloakService.getCurrentUser()

// Obtenir le token
const token = keycloakService.getAccessToken()
```

## Flux d'Authentification

1. **Connexion** : L'utilisateur clique sur "Connexion"
2. **Redirection** : L'application redirige vers Keycloak
3. **Authentification** : L'utilisateur s'authentifie sur Keycloak
4. **Callback** : Keycloak redirige vers `/auth/callback` avec un code
5. **Échange** : L'application échange le code contre un token
6. **Stockage** : Le token est stocké dans localStorage
7. **Redirection** : L'utilisateur est redirigé vers la page demandée

## Gestion des Tokens

- **Access Token** : Stocké dans localStorage, utilisé pour les appels API
- **Refresh Token** : Stocké dans localStorage, utilisé pour renouveler l'access token
- **Expiration** : Vérification automatique de l'expiration du token
- **Rafraîchissement** : Renouvellement automatique du token expiré

## Sécurité

- **HTTPS** : Utilisez HTTPS en production
- **CORS** : Configurez correctement les origines autorisées
- **Tokens** : Stockage sécurisé des tokens
- **Validation** : Validation des tokens côté serveur

## Dépannage

### Erreurs Courantes

1. **"Invalid redirect URI"**
   - Vérifiez les URIs de redirection dans la configuration du client Keycloak

2. **"Client not found"**
   - Vérifiez que le Client ID correspond à celui configuré

3. **"Realm not found"**
   - Vérifiez que le realm existe et est correctement configuré

4. **"Token expired"**
   - Le token a expiré, l'application devrait le rafraîchir automatiquement

### Logs

Activez les logs de débogage dans la console du navigateur pour diagnostiquer les problèmes d'authentification.

## Production

Pour la production, assurez-vous de :

1. Utiliser HTTPS
2. Configurer les domaines corrects dans Keycloak
3. Utiliser des secrets sécurisés
4. Configurer les timeouts appropriés
5. Mettre en place une surveillance des erreurs d'authentification
