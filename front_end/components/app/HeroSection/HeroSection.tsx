'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Star } from 'lucide-react'
import { SearchBar } from '@/components/app/SearchBar/SearchBar'
import Link from 'next/link'

export default function HeroSection() {
    const handleSearch = (query: string) => {
        // Rediriger vers la page de recherche avec la requête
        window.location.href = `/search?q=${encodeURIComponent(query)}`
    }

    return (
        <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Contenu principal */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Star className="h-4 w-4 mr-2" />
                            Découvrez des auteurs talentueux
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Soutenez les
                            <span className="text-primary"> auteurs indépendants</span>
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                            Explorez une collection unique de livres écrits par des auteurs passionnés.
                            Achetez directement auprès des créateurs et découvrez des histoires authentiques.
                        </p>

                        {/* Barre de recherche */}
                        <div className="mb-8">
                            <SearchBar
                                placeholder="Rechercher des livres, auteurs, genres..."
                                onSearch={handleSearch}
                                className="max-w-md mx-auto lg:mx-0"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="text-lg px-8 py-4">
                                Explorer les livres
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                Découvrir les auteurs
                            </Button>
                        </div>

                        {/* Statistiques */}
                        <div className="flex justify-center lg:justify-start gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">500+</div>
                                <div className="text-sm text-muted-foreground">Auteurs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">2000+</div>
                                <div className="text-sm text-muted-foreground">Livres</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">10k+</div>
                                <div className="text-sm text-muted-foreground">Lecteurs</div>
                            </div>
                        </div>
                    </div>

                    {/* Image/Illustration */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                            <div className="text-center">
                                <BookOpen className="h-24 w-24 text-primary mx-auto mb-4" />
                                <p className="text-lg font-medium">Votre prochaine lecture vous attend</p>
                                <p className="text-muted-foreground">Découvrez des histoires uniques</p>
                            </div>
                        </div>

                        {/* Éléments décoratifs */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/30 rounded-full"></div>
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
// This HeroSection component serves as the landing section of the application, providing a brief introduction and a call to action for users to get started. It uses Tailwind CSS for styling and includes a button that can be linked to further actions or pages.
// The section is designed to be visually appealing with a gradient background and centered text, making it
