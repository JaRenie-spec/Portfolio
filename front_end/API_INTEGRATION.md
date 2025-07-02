# Intégration API Front-Back

## Vue d'ensemble

Cette documentation explique comment le front-end Next.js communique avec le back-end Express.js.

## Architecture

### Back-end (Express.js)
- **Port** : 3000
- **Base URL** : `http://localhost:3000/api`
- **Routes disponibles** :
  - `/api/books` - Gestion des livres
  - `/api/authors` - Gestion des auteurs
  - `/api/users` - Gestion des utilisateurs
  - `/api/events` - Gestion des événements
  - `/api/reviews` - Gestion des avis
  - `/api/purchases` - Gestion des achats

### Front-end (Next.js)
- **Port** : 3001 (en développement)
- **Configuration** : Variables d'environnement dans `.env.local`

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `front_end/` :

```env
# Configuration API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Configuration pour le développement
NEXT_PUBLIC_ENV=development

# Configuration Keycloak (si nécessaire)
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=ebook-store
```

### 2. Services API

Le fichier `lib/api.ts` contient tous les services pour communiquer avec le back-end :

```typescript
import { bookService, authorService, userService } from '@/lib/api'

// Exemple d'utilisation
const books = await bookService.getAll()
const book = await bookService.getById('123')
const searchResults = await bookService.search('fantasy')
```

## Utilisation dans les composants

### 1. Hook personnalisé useApi

```typescript
import { useApi } from '@/lib/hooks/useApi'
import { bookService } from '@/lib/api'

function MyComponent() {
  const { data: books, loading, error, execute } = useApi(bookService.getAll)

  useEffect(() => {
    execute()
  }, [execute])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div>
      {books?.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  )
}
```

### 2. Gestion des erreurs

```typescript
// Gestion automatique des erreurs avec useApi
const { data, loading, error, execute } = useApi(apiFunction)

// Gestion manuelle
try {
  const response = await bookService.getAll()
  if (response.success) {
    // Traitement des données
  } else {
    // Gestion de l'erreur
    console.error(response.error)
  }
} catch (error) {
  // Gestion des erreurs réseau
}
```

## Authentification

### 1. Token JWT

Le service API gère automatiquement l'envoi du token d'authentification :

```typescript
// Le token est automatiquement ajouté aux headers
const headers = getDefaultHeaders()
// Inclut : Authorization: Bearer <token>
```

### 2. Stockage du token

```typescript
// Stockage du token
localStorage.setItem('authToken', token)

// Récupération du token
const token = localStorage.getItem('authToken')
```

## Exemples d'utilisation

### 1. Liste des livres

```typescript
// Dans un composant
const { data: books, loading, error } = useApi(bookService.getAll)

// Affichage conditionnel
{loading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{books && <BookList books={books} />}
```

### 2. Recherche de livres

```typescript
const [query, setQuery] = useState('')
const { data: results, execute } = useApi(() => bookService.search(query))

const handleSearch = (searchQuery: string) => {
  setQuery(searchQuery)
  execute()
}
```

### 3. Création d'un livre

```typescript
const { execute: createBook } = useApi(bookService.create)

const handleSubmit = async (bookData: any) => {
  await createBook(bookData)
  // Redirection ou mise à jour de la liste
}
```

## Gestion des erreurs

### 1. Types d'erreurs

- **Erreurs réseau** : Problèmes de connexion
- **Erreurs HTTP** : Codes d'erreur 4xx/5xx
- **Erreurs de validation** : Données invalides
- **Erreurs d'authentification** : Token expiré ou invalide

### 2. Composants d'erreur

```typescript
// Composant d'erreur réutilisable
function ErrorMessage({ error, onRetry }: { error: string, onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Erreur</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry}>Réessayer</Button>
      )}
    </div>
  )
}
```

## Tests

### 1. Test des services API

```typescript
// Test unitaire d'un service
describe('bookService', () => {
  it('should fetch all books', async () => {
    const response = await bookService.getAll()
    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
  })
})
```

### 2. Test des composants

```typescript
// Test d'un composant utilisant l'API
test('renders books list', async () => {
  render(<BookGrid />)

  // Attendre le chargement
  await waitFor(() => {
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  // Vérifier l'affichage des livres
  await waitFor(() => {
    expect(screen.getByText('Book Title')).toBeInTheDocument()
  })
})
```

## Déploiement

### 1. Variables d'environnement de production

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
NEXT_PUBLIC_ENV=production
```

### 2. Configuration Docker

Le `docker-compose.yml` configure automatiquement les variables d'environnement :

```yaml
environment:
  NEXT_PUBLIC_API_URL: http://backend:3000
```

## Dépannage

### 1. Problèmes courants

- **CORS** : Vérifiez que le back-end autorise les requêtes du front-end
- **Variables d'environnement** : Assurez-vous que `NEXT_PUBLIC_API_URL` est correctement définie
- **Authentification** : Vérifiez que le token est valide et non expiré

### 2. Debug

```typescript
// Activation du debug
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Response:', response)
```

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
