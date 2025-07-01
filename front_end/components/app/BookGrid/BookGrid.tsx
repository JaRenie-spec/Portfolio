'use client'

import BookCard from '../BookCard/BookCard'

const books = [
  {
    id: 1,
    title: "The Secret of Ink",
    author: "M. Carpenter",
    rating: 4.2,
    price: 15.99,
    coverColor: "from-blue-100 to-purple-100"
  },
  {
    id: 2,
    title: "Shadows of the Past",
    author: "J. Morgan",
    rating: 4.5,
    price: 12.99,
    coverColor: "from-green-100 to-blue-100"
  },
  {
    id: 3,
    title: "Winter Light",
    author: "S. Bertier",
    rating: 4.8,
    price: 18.99,
    coverColor: "from-pink-100 to-red-100"
  },
  {
    id: 4,
    title: "Journey to the Heart of Stars",
    author: "A. Lefevre",
    rating: 3.8,
    price: 14.99,
    coverColor: "from-yellow-100 to-orange-100"
  },
  {
    id: 5,
    title: "Whispers of the Forest",
    author: "C. Dubois",
    rating: 4.1,
    price: 16.99,
    coverColor: "from-purple-100 to-indigo-100"
  },
  {
    id: 6,
    title: "Emerald Dreams",
    author: "L. Martin",
    rating: 4.3,
    price: 13.99,
    coverColor: "from-emerald-100 to-teal-100"
  },
  {
    id: 7,
    title: "Echo of the Waves",
    author: "P. Rousseau",
    rating: 4.0,
    price: 17.99,
    coverColor: "from-cyan-100 to-blue-100"
  },
  {
    id: 8,
    title: "Beyond the Clouds",
    author: "F. Garnier",
    rating: 4.6,
    price: 19.99,
    coverColor: "from-indigo-100 to-purple-100"
  }
]

export default function BookGrid() {
  const handleAddToCart = (bookId: number) => {
    console.log(`Add book ${bookId} to cart`)
    // Here you can add the logic to add to cart
  }

  const handleFavorite = (bookId: number) => {
    console.log(`Add book ${bookId} to favorites`)
    // Here you can add the logic for favorites
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
