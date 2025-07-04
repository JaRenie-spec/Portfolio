'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from "@/components/app/Navbar/Navbar"
import { Footer } from "@/components/app/Footer/Footer"
import { SearchBar } from "@/components/app/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import BookGrid from "@/components/app/BookGrid/BookGrid"
import { bookService, Book } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [searchQuery, setSearchQuery] = useState(query)

    const { data: books, loading, error, execute } = useApi<Book[]>(() =>
        searchQuery ? bookService.search(searchQuery) : bookService.getAll()
    );

    useEffect(() => {
        execute();
    }, [searchQuery]);

    const handleSearch = (newQuery: string) => {
        setSearchQuery(newQuery);
        // Mettre à jour l'URL sans recharger la page
        const url = new URL(window.location.href);
        url.searchParams.set('q', newQuery);
        window.history.pushState({}, '', url.toString());
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                Résultats de <span className="text-primary">recherche</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                {searchQuery ? `Recherche pour "${searchQuery}"` : 'Recherchez parmi nos livres'}
                            </p>
                            <div className="max-w-md mx-auto">
                                <SearchBar
                                    placeholder="Rechercher par titre, auteur, genre..."
                                    onSearch={handleSearch}
                                    defaultValue={searchQuery}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-8 border-b">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Filtrer par :</span>
                                <Button variant="outline" size="sm">Genre</Button>
                                <Button variant="outline" size="sm">Prix</Button>
                                <Button variant="outline" size="sm">Note</Button>
                                <Button variant="outline" size="sm">Date</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Trier par :</span>
                                <Button variant="outline" size="sm">Popularité</Button>
                                <Button variant="outline" size="sm">Nouveautés</Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Recherche en cours...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-4">
                                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Erreur de recherche</h3>
                                <p className="text-muted-foreground mb-4">{error}</p>
                                <button
                                    onClick={() => execute()}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                    Réessayer
                                </button>
                            </div>
                        ) : (
                            <>
                                {searchQuery && (
                                    <div className="mb-8">
                                        <p className="text-muted-foreground">
                                            {books && books.length > 0
                                                ? `${books.length} résultat(s) trouvé(s) pour "${searchQuery}"`
                                                : `Aucun résultat trouvé pour "${searchQuery}"`
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Passe les livres récupérés à BookGrid */}
                                <BookGrid books={books} loading={loading} error={error} />

                                {/* Pagination */}
                                {books && books.length > 0 && (
                                    <div className="flex justify-center mt-12">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm">Précédent</Button>
                                            <Button size="sm">1</Button>
                                            <Button variant="outline" size="sm">2</Button>
                                            <Button variant="outline" size="sm">3</Button>
                                            <Button variant="outline" size="sm">4</Button>
                                            <Button variant="outline" size="sm">Suivant</Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {!loading && !error && books && books.length === 0 && searchQuery && (
                    <section className="px-6 py-16 bg-muted/30">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Aucun résultat trouvé
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Essayez de modifier vos termes de recherche ou explorez nos catégories populaires
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" onClick={() => setSearchQuery('')}>
                                    Voir tous les livres
                                </Button>
                                <Button variant="outline" size="lg">
                                    Explorer les auteurs
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
