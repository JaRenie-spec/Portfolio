'use client'

import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { SearchBar } from '@/components/app/SearchBar/SearchBar'
import { Button } from '@/components/ui/button'
import BookGrid from '@/components/app/BookGrid/BookGrid'

export default function Book() {
  const handleSearch = (query: string) => {
    // Rediriger vers la page de recherche avec la requête
    window.location.href = `/search?q=${encodeURIComponent(query)}`
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
                Découvrez nos <span className="text-primary">livres</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Explorez notre collection de livres écrits par des auteurs indépendants passionnés
              </p>
              <div className="max-w-md mx-auto">
                <SearchBar
                  placeholder="Rechercher par titre, auteur, genre..."
                  onSearch={handleSearch}
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
            <BookGrid />

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
          </div>
        </section>

        <section className="px-6 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez nos auteurs indépendants et leurs histoires uniques
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Explorer les auteurs
              </Button>
              <Button variant="outline" size="lg">
                Voir les événements
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
