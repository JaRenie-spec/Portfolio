'use client';

import { useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import type { Book } from '@/lib/api';
import { bookService } from '@/lib/api';
import { useApi } from '@/lib/hooks/useApi';

export default function BookGrid() {
  const { data: books, loading, error, execute } = useApi<Book[]>(bookService.getAll);

  useEffect(() => { execute(); }, [execute]);

  const handleAddToCart = (bookId: string) => {
    console.log(`Add book ${bookId} to cart`);
  };

  const handleFavorite = (bookId: string) => {
    console.log(`Add book ${bookId} to favorites`);
  };

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          {/* icône d'erreur */}
        </div>
        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button onClick={() => execute()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books && books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author?.pseudo ?? 'Auteur inconnu'}
            rating={book.rating || 0}
            price={book.price}
            coverColor={getRandomCoverColor()}
            onAddToCart={() => handleAddToCart(book.id)}
            onFavorite={() => handleFavorite(book.id)}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          {/* message "Aucun livre" */}
        </div>
      )}
    </div>
  );
}

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
