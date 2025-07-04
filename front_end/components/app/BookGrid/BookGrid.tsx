'use client'

import Link from 'next/link'
import BookCard from '../BookCard/BookCard'
import type { Book } from '@/lib/api'

interface BookGridProps {
  books: Book[] | null
  loading: boolean
  error: string | null
}

export default function BookGrid({ books, loading, error }: BookGridProps) {
  const handleAddToCart = (bookId: string) => {
    console.log(`Add book ${bookId} to cart`)
  }

  const handleFavorite = (bookId: string) => {
    console.log(`Add book ${bookId} to favorites`)
  }

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
        )
    }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          {/* Icône d'erreur (tu peux en rajouter ici si tu veux) */}
        </div>
        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-muted-foreground">
        <div className="mb-4">
          {/* Icône info */}
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
        <p>Il semble qu'il n'y ait pas encore de livres disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link key={book.id} href={`/books/${book.id}`} className="block">
          <BookCard
            title={book.title}
            author={book.author?.pseudo ?? 'Auteur inconnu'}
            rating={book.rating || 0}
            price={book.price}
            coverColor={getRandomCoverColor()}
            onAddToCart={() => handleAddToCart(book.id)}
            onFavorite={() => handleFavorite(book.id)}
          />
        </Link>
      ))}
    </div>
  )
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
        "from-indigo-100 to-purple-100",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}
