'use client'

import BookCard from '../BookCard/BookCard'

const books = [
  {
    id: 1,
    title: "Le Secret de l'Encre",
    author: "M. Charpentier",
    rating: 4.2,
    price: 15.99,
    coverColor: "from-blue-100 to-purple-100"
  },
  {
    id: 2,
    title: "Ombres du Passé",
    author: "J. Moreau",
    rating: 4.5,
    price: 12.99,
    coverColor: "from-green-100 to-blue-100"
  },
  {
    id: 3,
    title: "Lumière d'Hiver",
    author: "S. Berthier",
    rating: 4.8,
    price: 18.99,
    coverColor: "from-pink-100 to-red-100"
  },
  {
    id: 4,
    title: "Voyage au Coeur des Étoiles",
    author: "A. Lefèvre",
    rating: 3.8,
    price: 14.99,
    coverColor: "from-yellow-100 to-orange-100"
  },
  {
    id: 5,
    title: "Les Murmures de la Forêt",
    author: "C. Dubois",
    rating: 4.1,
    price: 16.99,
    coverColor: "from-purple-100 to-indigo-100"
  },
  {
    id: 6,
    title: "Rêves d'Émeraude",
    author: "L. Martin",
    rating: 4.3,
    price: 13.99,
    coverColor: "from-emerald-100 to-teal-100"
  },
  {
    id: 7,
    title: "L'Écho des Vagues",
    author: "P. Rousseau",
    rating: 4.0,
    price: 17.99,
    coverColor: "from-cyan-100 to-blue-100"
  },
  {
    id: 8,
    title: "Au-delà des Nuages",
    author: "F. Garnier",
    rating: 4.6,
    price: 19.99,
    coverColor: "from-indigo-100 to-purple-100"
  }
]

export default function BookGrid() {
  const handleAddToCart = (bookId: number) => {
    console.log(`Ajouter le livre ${bookId} au panier`)
    // Ici vous pouvez ajouter la logique pour ajouter au panier
  }

  const handleFavorite = (bookId: number) => {
    console.log(`Ajouter le livre ${bookId} aux favoris`)
    // Ici vous pouvez ajouter la logique pour les favoris
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          price={book.price}
          coverColor={book.coverColor}
          onAddToCart={() => handleAddToCart(book.id)}
          onFavorite={() => handleFavorite(book.id)}
        />
      ))}
    </div>
  )
}
