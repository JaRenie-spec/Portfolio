"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { authorService, bookService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Book } from '@/lib/api'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthorPublicProfilePage() {
    const params = useParams()
    const authorId = params.id as string
    const router = useRouter()
    const { data: author, loading, error, execute } = useApi(authorService.getById)
    const { execute: deleteAuthor } = useApi<void>(authorService.delete)
    const { user, isAuthenticated } = useAuth();
    const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
    const [bookError, setBookError] = useState<string | null>(null);

    useEffect(() => {
        if (authorId) {
            execute(authorId)
        }
    }, [authorId, execute])

    if (loading) return <div>Chargement...</div>
    if (error) return <div>Erreur: {error}</div>
    if (!author) return <div>Auteur non trouvé</div>

    const authorInitials = author.pseudo
        ? author.pseudo.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??'

    const handleDelete = async () => {
        if (confirm("Voulez-vous vraiment supprimer ce profil d'auteur ?")) {
            await deleteAuthor(author.id)
            router.push('/author')
        }
    }

    // Vérifier si l'utilisateur courant est l'auteur ou admin
    const isOwnerOrAdmin = isAuthenticated && (
        user?.sub === author.id || user?.realm_access?.roles.includes('admin')
    );

    // Handler suppression livre
    const handleDeleteBook = async (bookId: string) => {
        if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) return;
        setDeletingBookId(bookId);
        setBookError(null);
        const res = await bookService.delete(bookId);
        if (res.success) {
            // Rafraîchir la liste des livres
            execute(authorId);
        } else {
            setBookError(res.error || 'Erreur lors de la suppression');
        }
        setDeletingBookId(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={author.link} alt={author.pseudo} />
                                    <AvatarFallback>{authorInitials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-3xl font-bold">{author.pseudo}</CardTitle>
                                    <p className="text-muted-foreground">{author.firstName} {author.lastName}</p>
                                    <p className="mt-2">{author.bio}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </section>
                <section className="px-6 py-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">Livres</h2>
                        {bookError && <div className="text-red-500 mb-2">{bookError}</div>}
                        {author.books && author.books.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {author.books.map((book: Book) => (
                                    <Card key={book.id} className="flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                {book.coverImage || book.fileUrl ? (
                                                    <img
                                                        src={book.coverImage || book.fileUrl}
                                                        alt={book.title}
                                                        className="w-20 h-28 object-cover rounded shadow"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-muted-foreground">
                                                        <span>Aucune image</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <CardTitle>{book.title}</CardTitle>
                                                    <p className="text-sm text-muted-foreground mb-2">{book.genre}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-muted-foreground mb-2 line-clamp-3">{book.description}</p>
                                        </CardContent>
                                        <div className="flex gap-2 px-6 pb-4">
                                            <Link href={`/books/${book.id}`}>
                                                <Button size="sm" variant="outline">Voir</Button>
                                            </Link>
                                            {isOwnerOrAdmin && (
                                                <>
                                                    <Link href={`/books/${book.id}/edit`}>
                                                        <Button size="sm" variant="outline">Modifier</Button>
                                                    </Link>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteBook(book.id)} disabled={deletingBookId === book.id}>
                                                        {deletingBookId === book.id ? 'Suppression…' : 'Supprimer'}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Aucun livre trouvé.</div>
                        )}
                    </div>
                </section>
            </main>

            {/* Actions en bas */}
            <div className="border-t pt-6 pb-8">
                <div className="max-w-3xl mx-auto flex justify-between px-6">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        ← Retour
                    </Button>
                    {isOwnerOrAdmin && (
                        <div className="flex space-x-2">
                            <Link href={`/author/${author.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    Modifier
                                </Button>
                            </Link>
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
