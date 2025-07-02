'use client'

import { useEffect } from 'react'
import { authorService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Author } from '@/lib/api'
import AuthorCard from '../AuthorCard/AuthorCard'

export default function AuthorGrid() {
    const { data: authors, loading, error, execute } = useApi<Author[]>(authorService.getAll);

    useEffect(() => {
        execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Affichage du chargement
    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-full h-32 w-32 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Affichage de l'erreur
    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
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
        );
    }

    // Affichage des auteurs
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authors && authors.length > 0 ? (
                authors.map((author) => (
                    <AuthorCard
                        key={author.id}
                        id={author.id}
                        pseudo={author.pseudo}
                        firstName={author.firstName}
                        lastName={author.lastName}
                        bio={author.bio}
                        avatar={author.avatar}
                        booksCount={author.books?.length || 0}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <div className="text-muted-foreground mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucun auteur trouvé</h3>
                    <p className="text-muted-foreground">Il semble qu'il n'y ait pas encore d'auteurs disponibles.</p>
                </div>
            )}
        </div>
    )
}
