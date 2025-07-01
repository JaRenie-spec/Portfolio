'use client'

import { useState } from 'react'
import { Search, Filter, Calendar, MapPin, Users, Star, Clock, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { SearchBar } from '@/components/app/SearchBar/SearchBar'
import { Button } from '@/components/ui/button'

// Données mockées pour les événements
const mockEvents = [
    {
        id: 1,
        title: "Lancement de livre : Le Jardin de Minuit",
        author: "Sarah Chen",
        date: "2024-03-15",
        time: "19:00",
        location: "Bibliothèque Centrale, Centre-ville",
        attendees: 45,
        maxAttendees: 60,
        rating: 4.8,
        price: 25,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        description: "Rejoignez-nous pour le lancement du dernier roman de Sarah Chen, avec lectures, Q&R et dédicaces."
    },
    {
        id: 2,
        title: "Soirée Poésie : Voix de la Ville",
        author: "Michael Rodriguez",
        date: "2024-03-18",
        time: "20:00",
        location: "La Salle Bleue, Quartier des Arts",
        attendees: 28,
        maxAttendees: 40,
        rating: 4.6,
        price: 15,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        description: "Une soirée de poésie urbaine avec des poètes locaux et invités partageant leurs œuvres."
    },
    {
        id: 3,
        title: "Atelier d'écriture : Créer des Mémoires",
        author: "Emma Thompson",
        date: "2024-03-22",
        time: "14:00",
        location: "Centre Communautaire, Côté Ouest",
        attendees: 15,
        maxAttendees: 20,
        rating: 4.9,
        price: 50,
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
        description: "Apprenez l'art de l'écriture de mémoires avec l'auteure à succès Emma Thompson dans cet atelier pratique."
    },
    {
        id: 4,
        title: "Heure du Conte pour Enfants",
        author: "Lisa Park",
        date: "2024-03-25",
        time: "10:00",
        location: "Bibliothèque des Enfants, Côté Nord",
        attendees: 35,
        maxAttendees: 50,
        rating: 4.7,
        price: 0,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        description: "Heure du conte interactive pour les enfants de 3 à 8 ans, avec chansons, bricolages et activités de lecture."
    },
    {
        id: 5,
        title: "Club de Lecture Science-Fiction",
        author: "David Kim",
        date: "2024-03-28",
        time: "18:30",
        location: "Café Luna, Côté Est",
        attendees: 22,
        maxAttendees: 30,
        rating: 4.5,
        price: 10,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
        description: "Discussion mensuelle du club de lecture axée sur la littérature de science-fiction contemporaine."
    },
    {
        id: 6,
        title: "Rencontre d'Auteurs : Nouvelles Voix",
        author: "Divers Auteurs",
        date: "2024-04-02",
        time: "16:00",
        location: "Librairie Centrale, Midtown",
        attendees: 18,
        maxAttendees: 25,
        rating: 4.4,
        price: 20,
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        description: "Rencontrez des auteurs émergents et découvrez de nouvelles voix dans la littérature contemporaine."
    }
]

const categories = [
    "Tous les événements",
    "Lancements de livres",
    "Ateliers",
    "Clubs de lecture",
    "Événements pour enfants",
    "Poésie",
    "Rencontres d'auteurs"
]

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Tous les événements')
    const [currentPage, setCurrentPage] = useState(1)
    const eventsPerPage = 6

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             event.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             event.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'Tous les événements' ||
                               event.title.toLowerCase().includes(selectedCategory.toLowerCase().replace("s", ""))
        return matchesSearch && matchesCategory
    })

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col pt-16">
                {/* Section Hero */}
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                Découvrez nos <span className="text-primary">événements</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Connectez-vous avec des auteurs, assistez à des ateliers et plongez dans le monde de la littérature
                            </p>
                            <div className="max-w-md mx-auto">
                                <SearchBar
                                    placeholder="Rechercher des événements, auteurs ou lieux..."
                                    onSearch={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Filtres */}
                <section className="px-6 py-8 border-b">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Filtrer par :</span>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Trier par :</span>
                                <Button variant="outline" size="sm">Date</Button>
                                <Button variant="outline" size="sm">Prix</Button>
                                <Button variant="outline" size="sm">Popularité</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Grille d'événements */}
                <section className="px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border">
                                    {/* Image de l'événement */}
                                    <div className="relative h-48 bg-gray-200">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                                            {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                                        </div>
                                    </div>

                                    {/* Contenu de l'événement */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600">{event.rating}</span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {event.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {event.description}
                                        </p>

                                        {/* Détails de l'événement */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{event.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(event.date)} à {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>{event.attendees}/{event.maxAttendees} participants</span>
                                            </div>
                                        </div>

                                        {/* Boutons d'action */}
                                        <div className="flex gap-2">
                                            <Button className="flex-1">
                                                S'inscrire
                                            </Button>
                                            <Button variant="outline">
                                                Détails
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Précédent
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            size="sm"
                                            variant={currentPage === page ? "default" : "outline"}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section CTA */}
                <section className="px-6 py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Organisez Votre Propre Événement
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Êtes-vous un auteur ou un organisateur d'événements ? Créez et promouvez vos événements littéraires pour atteindre notre communauté d'amoureux de livres.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg">
                                Créer un événement
                            </Button>
                            <Button variant="outline" size="lg">
                                En savoir plus
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
