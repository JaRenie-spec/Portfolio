'use client'

import { useEffect } from 'react'
import { useApi } from '@/lib/hooks/useApi'
import { authorService, Author } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthorGrid() {
    const { data: authors, loading, error, execute } = useApi<Author[]>(authorService.getAll);

    useEffect(() => {
        execute();
    }, [execute]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Erreur lors du chargement des auteurs : {error}</p>
            </div>
        );
    }

    if (!authors || authors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun auteur trouvé.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => {
                const authorInitials = author.pseudo
                    ? author.pseudo.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                    : '??'

                return (
                    <Card key={author.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={author.link} alt={author.pseudo} />
                                    <AvatarFallback>{authorInitials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{author.pseudo}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{author.firstName} {author.lastName}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {author.bio && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                    {author.bio}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {author.books?.length || 0} livre{author.books?.length !== 1 ? 's' : ''}
                                </div>
                                <Link href={`/author/${author.id}`}>
                                    <Button variant="outline" size="sm">
                                        Voir le profil
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}
