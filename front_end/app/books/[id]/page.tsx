'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { bookService, Book } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navbar } from '@/components/app/Navbar/Navbar'

export default function BookDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: book, loading, error, execute } = useApi<Book>(bookService.getById)
    const { execute: deleteBook } = useApi<void>(bookService.delete)

    useEffect(() => {
        if (id) execute(id)
    }, [id, execute])

    if (loading) return <p>Chargement…</p>
    if (error) return <p className="text-red-500 text-center mt-6">Erreur : {error}</p>
    if (!book) return <p className="text-center mt-6">Livre introuvable.</p>

    const handleDelete = async () => {
        if (confirm("Voulez-vous vraiment supprimer ce livre ?")) {
            await deleteBook(book.id)
            router.push('/books')
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* Contenu centré */}
            <div className="flex-1 flex flex-col justify-start py-12 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl font-bold">{book.title}</h1>
                    {/* Bloc auteur avec lien */}
                    {book.author?.id
                        ? <Link href={`/author/${book.author.id}`}>{book.author.pseudo || `${book.author.firstName} ${book.author.lastName}`}</Link>
                        : <span>Auteur inconnu</span>
                    }
                    <p className="text-lg text-muted-foreground">
                        Par <strong>{book.author.pseudo}</strong>
                    </p>
                    <p className="text-2xl font-semibold">€{book.price.toFixed(2)}</p>
                    {book.rating != null && (
                        <p className="text-md">Note : {book.rating.toFixed(1)} / 5</p>
                    )}
                    <div className="prose max-w-none mx-auto text-left">
                        <p>{book.description}</p>
                    </div>
                </div>
            </div>

            {/* Actions en bas */}
            <div className="border-t pt-6 pb-8">
                <div className="max-w-4xl mx-auto flex justify-between px-6">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        ← Retour
                    </Button>
                    <div className="flex space-x-2">
                        <Link href={`/books/${book.id}/edit`}>
                            <Button variant="outline" size="sm">
                                Modifier
                            </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
