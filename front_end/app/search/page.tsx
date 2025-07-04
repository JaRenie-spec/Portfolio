'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { SearchBar } from '@/components/app/SearchBar/SearchBar'
import { Button } from '@/components/ui/button'
import BookGrid from '@/components/app/BookGrid/BookGrid'
import { bookService, Book } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  // Fonction API stabilisée
  const apiFn = useCallback(
    () => (searchQuery ? bookService.search(searchQuery) : bookService.getAll()),
    [searchQuery]
  )

  const { data: books, loading, error, execute } = useApi<Book[]>(apiFn)

  // Lancer la recherche quand searchQuery change
  useEffect(() => {
    execute()
  }, [searchQuery, execute])

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery)
    const url = new URL(window.location.href)
    if (newQuery) {
      url.searchParams.set('q', newQuery)
    } else {
      url.searchParams.delete('q')
    }
    window.history.pushState({}, '', url.toString())
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
        <Navbar />
      </header>

      <main className="flex flex-1 flex-col pt-16">
        {/* Hero/Search Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
          <div className="max-w-6xl mx-auto text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Recherche de <span className="text-primary">Livres</span>
            </h1>
            <div className="max-w-md mx-auto">
              <SearchBar
                placeholder="Rechercher par titre, auteur, genre..."
                onSearch={handleSearch}
                defaultValue={searchQuery}
              />
            </div>
          </div>
        </section>

        {/* Filter & Sort Section */}
        <section className="px-6 py-8 border-b">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
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
        </section>

        {/* Results Section */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Erreur : {error}</p>
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
                  <div className="mb-8 text-center">
                    <p className="text-muted-foreground">
                      {books && books.length > 0
                        ? `${books.length} résultat(s) pour "${searchQuery}"`
                        : `Aucun résultat pour "${searchQuery}"`}
                    </p>
                  </div>
                )}
                <BookGrid />
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
      </main>

      <Footer />
    </div>
  )
}
