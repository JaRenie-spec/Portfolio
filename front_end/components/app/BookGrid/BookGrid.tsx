'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookCard from '../BookCard/BookCard'
import type { Book } from '@/lib/api'
import { bookService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCart } from '@/lib/hooks/useCart'

export default function BookGrid() {
    const { data: books, loading, error, execute } = useApi<Book[]>(bookService.getAll)
    const { isAuthenticated } = useAuth()
    const { cart, addToCart } = useCart()
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<'error' | 'success' | null>(null)

    useEffect(() => {
        execute()
    }, [execute])

    const handleAddToCart = (book: Book) => {
        if (!isAuthenticated) {
            setMessage('Connectez-vous pour ajouter un livre au panier.')
            setMessageType('error')
            return
        }
        if (cart.find((item: any) => item.id === book.id)) {
            setMessage('Ce livre est déjà dans votre panier.')
            setMessageType('error')
            return
        }
        addToCart({ id: book.id, title: book.title, price: book.price })
        setMessage('Livre ajouté au panier !')
        setMessageType('success')
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
                    {/* icône d'erreur */}
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
        )
    }

    return (
        <>
            {message && (
                <div className={`mb-6 px-4 py-3 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>{message}</div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id}>
                            <Link href={`/books/${book.id}`} className="block">
                                <BookCard
                                    title={book.title}
                                    author={book.author?.pseudo ?? 'Auteur inconnu'}
                                    rating={book.rating || 0}
                                    price={book.price}
                                    coverColor={getRandomCoverColor()}
                                    onAddToCart={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(book)
                                    }}
                                />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        {/* message "Aucun livre trouvé" */}
                        <div className="text-muted-foreground mb-4">
                            {/* icône info */}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
                        <p className="text-muted-foreground">Il semble qu'il n'y ait pas encore de livres disponibles.</p>
                    </div>
                )}
            </div>
        </>
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
