# Système de Proxy (Rewrite) Next.js – Explication

## Pourquoi un proxy est nécessaire ?

- **Dans Docker**, le front (Next.js) et le back (Express) communiquent via des noms de service Docker (`backend`).
- **Mais le navigateur** (Chrome, Firefox, etc.) ne connaît pas ces noms : il ne peut accéder qu'à des adresses comme `localhost` ou une IP locale.
- **Si le front fait un fetch vers `http://backend:3000/api` côté client**, le navigateur échoue avec `ERR_NAME_NOT_RESOLVED`.

---

## Le rôle du proxy Next.js

### 1. Configuration du proxy dans `next.config.ts`

```js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/api/:path*', // côté Docker
      },
    ];
  },
  // ...autres options
}
```

- **Ce que ça fait :**
  Toute requête HTTP faite vers `/api/quelquechose` sur le front (port 3001) est automatiquement redirigée (proxyfiée) par Next.js vers `http://backend:3000/api/quelquechose` dans le réseau Docker.

---

### 2. Variable d'environnement côté front

```env
NEXT_PUBLIC_API_URL=/api
```
- **Dans le code front**, tous les fetchs vers l'API utilisent `/api` comme base URL.
- **Exemple :**
  ```js
  fetch('/api/books')
  ```
  - Si c'est exécuté côté serveur (SSR), Next.js fait la requête dans Docker vers le back.
  - Si c'est exécuté côté client (navigateur), la requête va vers le serveur Next.js (port 3001), qui la proxy vers le back.

---

### 3. Ce qui se passe lors d'un appel API

1. **Le navigateur** fait une requête vers `http://localhost:3001/api/books`.
2. **Next.js** (dans Docker) reçoit la requête sur le port 3001.
3. **La règle de rewrite** la redirige vers `http://backend:3000/api/books` (dans le réseau Docker).
4. **Le back** répond, Next.js renvoie la réponse au navigateur.

---

## Avantages de ce système

- **Aucune fuite de nom Docker** (`backend`) côté navigateur.
- **Sécurité** : le navigateur ne peut pas accéder directement au back, tout passe par le front.
- **Même code front** fonctionne en local, en Docker, en prod (il suffit d'adapter la règle de rewrite).
- **Pas de CORS à gérer** entre front et back (tout est sur le même domaine côté navigateur).

---

## Schéma

```
[ Navigateur ]
    |
    |  (fetch /api/books)
    v
[ Next.js (port 3001) ]
    |
    |  (proxy /api/books → http://backend:3000/api/books)
    v
[ Express.js (port 3000) ]
```

---

**En bref :**
- Le proxy Next.js permet au front de parler au back via `/api` sans jamais exposer le nom Docker au navigateur.
- C'est la solution la plus propre pour les architectures Dockerisées avec Next.js !
