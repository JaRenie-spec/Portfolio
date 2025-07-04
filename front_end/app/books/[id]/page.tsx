'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { bookService, Book } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { Star, Euro, User, Calendar } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCart } from '@/lib/hooks/useCart'

export default function BookDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: book, loading, error, execute } = useApi<Book>(bookService.getById)
    const { execute: deleteBook } = useApi<void>(bookService.delete)
    const { user, isAuthenticated } = useAuth()
    const { cart, addToCart } = useCart()
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<'error' | 'success' | null>(null)

    useEffect(() => {
        if (id) execute(id)
    }, [id, execute])

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!book) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Livre introuvable</h3>
                            <p className="text-muted-foreground mb-4">Le livre que vous recherchez n'existe pas.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // Vérifie si l'utilisateur est l'auteur ou admin
    const isOwnerOrAdmin = isAuthenticated && (user?.sub === book?.author?.id || user?.realm_access?.roles.includes('admin'))

    const handleDelete = async () => {
        if (!isOwnerOrAdmin) {
            setMessage("Vous n'êtes pas autorisé à supprimer ce livre.")
            setMessageType('error')
            return
        }
        if (confirm("Voulez-vous vraiment supprimer ce livre ?")) {
            await deleteBook(book.id)
            router.push('/books')
        }
    }

    const handleEdit = () => {
        if (!isOwnerOrAdmin) {
            setMessage("Vous n'êtes pas autorisé à modifier ce livre.")
            setMessageType('error')
            return
        }
        router.push(`/books/${book.id}/edit`)
    }

    const handleBuy = () => {
        if (!isAuthenticated) {
            setMessage("Vous devez être connecté pour acheter un livre.")
            setMessageType('error')
            return
        }
        // Ici, tu peux ajouter la logique d'achat réelle
        setMessage("Achat simulé : fonctionnalité à implémenter.")
        setMessageType('success')
    }

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            setMessage("Connectez-vous pour ajouter un livre au panier.")
            setMessageType('error')
            return
        }
        if (cart.find((item: any) => item.id === book.id)) {
            setMessage("Ce livre est déjà dans votre panier.")
            setMessageType('error')
            return
        }
        addToCart({ id: book.id, title: book.title, price: book.price })
        setMessage("Livre ajouté au panier !")
        setMessageType('success')
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        {message && (
                            <div className={`mb-6 px-4 py-3 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>{message}</div>
                        )}
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            {/* Image de couverture */}
                            <div className="flex justify-center">
                                {book.coverImage || book.fileUrl ? (
                                    <img
                                        src={book.coverImage || book.fileUrl}
                                        alt={book.title}
                                        className="w-64 h-96 object-cover rounded-lg shadow-lg"
                                    />
                                ) : (
                                    <div className="w-64 h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                        <span>Aucune image</span>
                                    </div>
                                )}
                            </div>

                            {/* Informations du livre */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                                    {book.genre && (
                                        <Badge variant="secondary" className="mb-4">
                                            {book.genre}
                                        </Badge>
                                    )}
                                </div>

                                {/* Auteur */}
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Par </span>
                                    {book.author?.id ? (
                                        <Link
                                            href={`/author/${book.author.id}`}
                                            className="font-semibold text-primary hover:underline"
                                        >
                                            {book.author.pseudo || `${book.author.firstName} ${book.author.lastName}`}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold">Auteur inconnu</span>
                                    )}
                                </div>

                                {/* Prix */}
                                <div className="flex items-center gap-2">
                                    <Euro className="h-5 w-5 text-primary" />
                                    <span className="text-3xl font-bold text-primary">
                                        €{book.price.toFixed(2)}
                                    </span>
                                </div>

                                {/* Note */}
                                {book.rating != null && (
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="font-medium">
                                            {book.rating.toFixed(1)} / 5
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                {book.description && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button size="lg" onClick={handleBuy}>
                                        Acheter maintenant
                                    </Button>
                                    <Button variant="outline" size="lg" onClick={handleAddToCart}>
                                        Ajouter au panier
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Actions de gestion */}
                <section className="px-6 py-8 border-t">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm" onClick={() => router.back()}>
                                ← Retour
                            </Button>
                            {isOwnerOrAdmin && (
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleEdit}>
                                        Modifier
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                                        Supprimer
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
