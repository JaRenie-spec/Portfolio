// lib/api.ts

// Configuration de l'URL de base de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Structure standard des réponses de l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Entités du domaine
export interface Author {
  id: string;
  pseudo: string;
  bio?: string;
  avatar?: string;
  email?: string;
  books?: Book[];
}

export interface Book {
  id: string;
  title: string;
  author: Author;
  rating?: number;
  price: number;
  coverImage?: string;
	fileUrl?: string,
  genre?: string;
  description?: string;
  publishedAt?: string;
  isbn?: string;
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
  dateEvent: string;
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

export interface CreatePurchaseData {
  bookId: string;
  amount: number;
  paymentMethod?: string;
  paymentDetails?: any;
}

// Construction des headers par défaut, avec token JWT si présent
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Fonction générique pour appeler l'API et gérer les erreurs sans throw non capturé
export async function apiCall<T>(
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
      // On capture le JSON d'erreur et on return un success: false
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
      };
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

// Services pour chaque ressource

export const bookService = {
  getAll: () => apiCall<Book[]>('/books'),
  getById: (id: string) => apiCall<Book>(`/books/${id}`),
  search: (query: string) => apiCall<Book[]>(`/books/search?q=${encodeURIComponent(query)}`),
  create: (bookData: Partial<Book>) =>
    apiCall<Book>('/books', { method: 'POST', body: JSON.stringify(bookData) }),
  update: (id: string, bookData: Partial<Book>) =>
    apiCall<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(bookData) }),
  delete: (id: string) => apiCall<void>(`/books/${id}`, { method: 'DELETE' }),
};

export const authorService = {
  getAll: () => apiCall<Author[]>('/authors'),
  getById: (id: string) => apiCall<Author>(`/authors/${id}`),
  search: (query: string) => apiCall<Author[]>(`/authors/search?q=${encodeURIComponent(query)}`),
  update: (id: string, authorData: Partial<Author>) =>
    apiCall<Author>(`/authors/${id}`, { method: 'PUT', body: JSON.stringify(authorData) }),
  delete: (id: string) => apiCall<void>(`/authors/${id}`, { method: 'DELETE' }),
};

export const userService = {
  getProfile: () => apiCall<User>('/users/me'),
  updateProfile: (userData: Partial<User>) =>
    apiCall<User>('/users/me', { method: 'PUT', body: JSON.stringify(userData) }),
  getById: (id: string) => apiCall<User>(`/users/${id}`),
  getAll: () => apiCall<User[]>('/users'),
  delete: (id: string) => apiCall<void>(`/users/${id}`, { method: 'DELETE' }),
};

export const eventService = {
  getAll: () => apiCall<Event[]>('/events'),
  getById: (id: string) => apiCall<Event>(`/events/${id}`),
  create: (data: Partial<Event>) =>
    apiCall<Event>('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Event>) =>
    apiCall<Event>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall<void>(`/events/${id}`, { method: 'DELETE' }),
};

export const reviewService = {
  getAll: () => apiCall<Review[]>('/reviews'),
  getById: (id: string) => apiCall<Review>(`/reviews/${id}`),
  getByBook: (bookId: string) => apiCall<Review[]>(`/reviews/book/${bookId}`),
  create: (data: CreateReviewData) =>
    apiCall<Review>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Review>) =>
    apiCall<Review>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall<void>(`/reviews/${id}`, { method: 'DELETE' }),
};

export const purchaseService = {
  getAll: () => apiCall<Purchase[]>('/purchases'),
  getById: (id: string) => apiCall<Purchase>(`/purchases/${id}`),
  getUserPurchases: () => apiCall<Purchase[]>('/purchases/user'),
  create: (data: CreatePurchaseData) =>
    apiCall<Purchase>('/purchases', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall<void>(`/purchases/${id}`, { method: 'DELETE' }),
};

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiCall<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData: { email: string; password: string; name: string; role?: string }) =>
    apiCall<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return Promise.resolve({ success: true });
  },
  verifyToken: () => apiCall<User>('/auth/verify'),
};

export default apiCall;
