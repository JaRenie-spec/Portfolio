"use client"

import { useEffect } from 'react'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/useAuth'
import { authorService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Book } from '@/lib/api'
import Link from 'next/link'

export default function AuthorProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const { data: author, loading: authorLoading, error: authorError, execute: fetchAuthor } = useApi(authorService.getById)

    useEffect(() => {
        if (user && user.sub) {
            fetchAuthor(user.sub)
        }
    }, [user, fetchAuthor])

    if (isLoading || authorLoading) {
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

    if (!isAuthenticated || !user || !user.realm_access?.roles.includes('author')) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Accès refusé</h3>
                            <p className="text-muted-foreground mb-4">Vous devez être connecté en tant qu'auteur pour accéder à cette page.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (authorError) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                            <p className="text-muted-foreground mb-4">{authorError}</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const authorInitials = author?.pseudo
        ? author.pseudo.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??'

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
                                    <AvatarImage src={author?.link} alt={author?.pseudo} />
                                    <AvatarFallback>{authorInitials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-3xl font-bold">{author?.pseudo}</CardTitle>
                                    <p className="text-muted-foreground">{author?.firstName} {author?.lastName}</p>
                                    <p className="mt-2">{author?.bio}</p>
                                    <div className="flex gap-2 mt-4">
                                        <Link href={`/author/${author?.id}/edit`}>
                                            <Button>Modifier le profil</Button>
                                        </Link>
                                        <Link href="/books/create">
                                            <Button variant="outline">Publier un livre</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </section>
                <section className="px-6 py-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">Mes livres</h2>
                        {author?.books && author.books.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {author.books.map((book: Book) => (
                                    <Card key={book.id}>
                                        <CardHeader>
                                            <CardTitle>{book.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{book.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Aucun livre trouvé.</div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
