'use client'

import { useEffect } from 'react'
import BookCard from '../BookCard/BookCard'
import { bookService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'

// Type pour un livre
interface Book {
  id: string;
  title: string;
  author: {
    name: string;
  };
  rating?: number;
  price: number;
  coverImage?: string;
  genre?: string;
  description?: string;
}

export default function BookGrid() {
  const { data: books, loading, error, execute } = useApi<Book[]>(bookService.getAll);

  useEffect(() => {
    execute();
  }, [execute]);

  const handleAddToCart = (bookId: string) => {
    console.log(`Add book ${bookId} to cart`)
    // Here you can add the logic to add to cart
  }

  const handleFavorite = (bookId: string) => {
    console.log(`Add book ${bookId} to favorites`)
    // Here you can add the logic for favorites
  }

  // Affichage du chargement
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => execute()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Affichage des livres
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books && books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author.name}
            rating={book.rating || 0}
            price={book.price}
            coverColor={getRandomCoverColor()}
            onAddToCart={() => handleAddToCart(book.id)}
            onFavorite={() => handleFavorite(book.id)}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
          <p className="text-muted-foreground">Il semble qu'il n'y ait pas encore de livres disponibles.</p>
        </div>
      )}
    </div>
  )
}

// Fonction pour générer une couleur de couverture aléatoire
function getRandomCoverColor(): string {
  const colors = [
    "from-blue-100 to-purple-100",
    "from-green-100 to-blue-100",
    "from-pink-100 to-red-100",
    "from-yellow-100 to-orange-100",
    "from-purple-100 to-indigo-100",
    "from-emerald-100 to-teal-100",
    "from-cyan-100 to-blue-100",
    "from-indigo-100 to-purple-100"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
