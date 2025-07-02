// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types pour les entités
export interface Book {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  rating?: number;
  price: number;
  coverImage?: string;
  genre?: string;
  description?: string;
  publishedAt?: string;
  isbn?: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  books?: Book[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'author' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  author?: Author;
  isOnline?: boolean;
  maxParticipants?: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  book: Book;
  user: User;
  createdAt: string;
}

// Types for creating reviews (what the API expects)
export interface CreateReviewData {
  bookId: string;
  authorId: string;
  rating: number;
  comment: string;
}

export interface Purchase {
  id: string;
  book: Book;
  user: User;
  amount: number;
  purchaseDate: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Types for creating purchases (what the API expects)
export interface CreatePurchaseData {
  bookId: string;
  amount: number;
  paymentMethod?: string;
  paymentDetails?: any;
}

// Configuration des headers par défaut
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Ajouter le token d'authentification si disponible
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Fonction générique pour les appels API
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
}

// Service pour les livres
export const bookService = {
  // Récupérer tous les livres
  getAll: () => apiCall<Book[]>('/books'),

  // Récupérer un livre par ID
  getById: (id: string) => apiCall<Book>(`/books/${id}`),

  // Rechercher des livres
  search: (query: string) => apiCall<Book[]>(`/books/search?q=${encodeURIComponent(query)}`),

  // Créer un nouveau livre
  create: (bookData: Partial<Book>) => apiCall<Book>('/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  }),

  // Mettre à jour un livre
  update: (id: string, bookData: Partial<Book>) => apiCall<Book>(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  }),

  // Supprimer un livre
  delete: (id: string) => apiCall<void>(`/books/${id}`, {
    method: 'DELETE',
  }),
};

// Service pour les auteurs
export const authorService = {
  // Récupérer tous les auteurs
  getAll: () => apiCall<Author[]>('/authors/'),

  // Récupérer un auteur par ID
  getById: (id: string) => apiCall<Author>(`/authors/${id}`),

  // Rechercher des auteurs
  search: (query: string) => apiCall<Author[]>(`/authors/search?q=${encodeURIComponent(query)}`),

  // Mettre à jour un auteur
  update: (id: string, authorData: Partial<Author>) => apiCall<Author>(`/authors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(authorData),
  }),

  // Supprimer un auteur
  delete: (id: string) => apiCall<void>(`/authors/${id}`, {
    method: 'DELETE',
  }),
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: () => apiCall<User>('/users/me'),

  // Mettre à jour le profil
  updateProfile: (userData: Partial<User>) => apiCall<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Récupérer un utilisateur par ID (admin seulement)
  getById: (id: string) => apiCall<User>(`/users/${id}`),

  // Récupérer tous les utilisateurs (admin seulement)
  getAll: () => apiCall<User[]>('/users'),

  // Supprimer un utilisateur
  delete: (id: string) => apiCall<void>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Service pour les événements
export const eventService = {
  // Récupérer tous les événements
  getAll: () => apiCall<Event[]>('/events'),

  // Récupérer un événement par ID
  getById: (id: string) => apiCall<Event>(`/events/${id}`),

  // Créer un nouvel événement
  create: (eventData: Partial<Event>) => apiCall<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),

  // Mettre à jour un événement
  update: (id: string, eventData: Partial<Event>) => apiCall<Event>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),

  // Supprimer un événement
  delete: (id: string) => apiCall<void>(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Service pour les avis
export const reviewService = {
  // Récupérer tous les avis
  getAll: () => apiCall<Review[]>('/reviews'),

  // Récupérer un avis par ID
  getById: (id: string) => apiCall<Review>(`/reviews/${id}`),

  // Récupérer les avis d'un livre
  getByBook: (bookId: string) => apiCall<Review[]>(`/reviews/book/${bookId}`),

  // Créer un nouvel avis
  create: (reviewData: CreateReviewData) => apiCall<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  // Mettre à jour un avis
  update: (id: string, reviewData: Partial<Review>) => apiCall<Review>(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),

  // Supprimer un avis
  delete: (id: string) => apiCall<void>(`/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// Service pour les achats
export const purchaseService = {
  // Récupérer tous les achats (admin seulement)
  getAll: () => apiCall<Purchase[]>('/purchases'),

  // Récupérer un achat par ID
  getById: (id: string) => apiCall<Purchase>(`/purchases/${id}`),

  // Récupérer les achats de l'utilisateur connecté
  getUserPurchases: () => apiCall<Purchase[]>('/purchases/user'),

  // Créer un nouvel achat
  create: (purchaseData: CreatePurchaseData) => apiCall<Purchase>('/purchases', {
    method: 'POST',
    body: JSON.stringify(purchaseData),
  }),

  // Supprimer un achat (admin seulement)
  delete: (id: string) => apiCall<void>(`/purchases/${id}`, {
    method: 'DELETE',
  }),
};

// Service d'authentification
export const authService = {
  // Connexion
  login: (credentials: { email: string; password: string }) => apiCall<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Inscription
  register: (userData: { email: string; password: string; name: string; role?: string }) => apiCall<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Déconnexion
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return Promise.resolve({ success: true });
  },

  // Vérifier le token
  verifyToken: () => apiCall<User>('/auth/verify'),
};

export default apiCall;
