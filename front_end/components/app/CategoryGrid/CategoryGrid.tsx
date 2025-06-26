'use client'

import Link from 'next/link'
import { BookOpen, Heart, Zap, Globe, Star, Palette } from 'lucide-react'

const categories = [
    {
        id: 'romance',
        name: 'Romance',
        description: 'Histoires d\'amour et de passion',
        icon: Heart,
        color: 'bg-pink-100 text-pink-600',
        count: 150
    },
    {
        id: 'fantasy',
        name: 'Fantasy',
        description: 'Mondes magiques et créatures légendaires',
        icon: Star,
        color: 'bg-purple-100 text-purple-600',
        count: 120
    },
    {
        id: 'science-fiction',
        name: 'Science-Fiction',
        description: 'Futur, technologie et exploration spatiale',
        icon: Zap,
        color: 'bg-blue-100 text-blue-600',
        count: 95
    },
    {
        id: 'thriller',
        name: 'Thriller',
        description: 'Suspense et intrigue',
        icon: Globe,
        color: 'bg-red-100 text-red-600',
        count: 80
    },
    {
        id: 'biography',
        name: 'Biographie',
        description: 'Vies extraordinaires',
        icon: BookOpen,
        color: 'bg-green-100 text-green-600',
        count: 65
    },
    {
        id: 'art',
        name: 'Art & Culture',
        description: 'Créativité et expression artistique',
        icon: Palette,
        color: 'bg-yellow-100 text-yellow-600',
        count: 45
    }
]

export function CategoryGrid() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Explorez par catégorie
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Trouvez votre prochaine lecture parmi nos catégories populaires
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon
                        return (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="group block p-6 bg-background border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-primary/20"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${category.color}`}>
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {category.count} livres
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>

                                <p className="text-muted-foreground text-sm mb-4">
                                    {category.description}
                                </p>

                                <div className="flex items-center text-sm text-primary font-medium">
                                    Explorer
                                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/categories"
                        className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        Voir toutes les catégories
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}
