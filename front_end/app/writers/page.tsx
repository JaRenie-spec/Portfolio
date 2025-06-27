'use client'

import { Navbar } from "@/components/app/Navbar/Navbar";
import { Footer } from "@/components/app/Footer/Footer";
import { SearchBar } from "@/components/app/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, BookOpen, Star, Heart, Mail } from "lucide-react";

export default function Writers() {
    const handleSearch = (query: string) => {
        // Rediriger vers la page de recherche avec la requête
        window.location.href = `/search?q=${encodeURIComponent(query)}`
    }

    const writers = [
        {
            id: 1,
            name: 'Jane Doe',
            bio: 'Auteure de fantasy et d\'aventure',
            genre: 'Fantasy',
            booksCount: 12,
            eventsCount: 3,
            rating: 4.5,
            location: 'Paris, France',
            image: null,
            upcomingEvent: {
                title: 'Signature de "Les Gardiens du Temps"',
                date: '15 Janvier 2024',
                location: 'Librairie du Quartier Latin'
            }
        },
        {
            id: 2,
            name: 'John Smith',
            bio: 'Spécialiste de science-fiction',
            genre: 'Science-Fiction',
            booksCount: 8,
            eventsCount: 2,
            rating: 4.2,
            location: 'Lyon, France',
            image: null,
            upcomingEvent: {
                title: 'Atelier d\'écriture SF',
                date: '22 Janvier 2024',
                location: 'Bibliothèque Municipale'
            }
        },
        {
            id: 3,
            name: 'Alice Johnson',
            bio: 'Romancière passionnée d\'histoires d\'amour',
            genre: 'Romance',
            booksCount: 15,
            eventsCount: 5,
            rating: 4.8,
            location: 'Marseille, France',
            image: null,
            upcomingEvent: {
                title: 'Rencontre lecteurs',
                date: '28 Janvier 2024',
                location: 'Café Littéraire'
            }
        },
        {
            id: 4,
            name: 'Bob Lee',
            bio: 'Maître du suspense et du thriller',
            genre: 'Thriller',
            booksCount: 10,
            eventsCount: 1,
            rating: 4.3,
            location: 'Bordeaux, France',
            image: null,
            upcomingEvent: {
                title: 'Lancement "Ombres Profondes"',
                date: '5 Février 2024',
                location: 'Espace Culturel'
            }
        },
        {
            id: 5,
            name: 'Maria Garcia',
            bio: 'Historienne et romancière',
            genre: 'Historique',
            booksCount: 6,
            eventsCount: 2,
            rating: 4.6,
            location: 'Toulouse, France',
            image: null,
            upcomingEvent: {
                title: 'Conférence historique',
                date: '12 Février 2024',
                location: 'Musée d\'Histoire'
            }
        },
        {
            id: 6,
            name: 'David Kim',
            bio: 'Essayiste et philosophe',
            genre: 'Non-Fiction',
            booksCount: 4,
            eventsCount: 1,
            rating: 4.1,
            location: 'Nantes, France',
            image: null,
            upcomingEvent: {
                title: 'Débat philosophique',
                date: '18 Février 2024',
                location: 'Université de Nantes'
            }
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header fixe */}
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col pt-16">
                {/* Hero Section avec recherche */}
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                Découvrez nos <span className="text-primary">auteurs</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                Rencontrez des auteurs indépendants passionnés et découvrez leurs événements
                            </p>
                            <div className="max-w-md mx-auto">
                                <SearchBar
                                    placeholder="Rechercher par nom, genre, ville..."
                                    onSearch={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filtres et tri */}
                <section className="px-6 py-8 border-b">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Filtrer par :</span>
                                <Button variant="outline" size="sm">Genre</Button>
                                <Button variant="outline" size="sm">Localisation</Button>
                                <Button variant="outline" size="sm">Note</Button>
                                <Button variant="outline" size="sm">Événements</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Trier par :</span>
                                <Button variant="outline" size="sm">Popularité</Button>
                                <Button variant="outline" size="sm">Prochains événements</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grille d'auteurs */}
                <section className="px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {writers.map((writer) => (
                                <div key={writer.id} className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        {/* En-tête de l'auteur */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {writer.image ? (
                                                    <img src={writer.image} alt={writer.name} className="w-16 h-16 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                                                        {writer.name[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-lg">{writer.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{writer.genre}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-muted-foreground mb-4">{writer.bio}</p>

                                        {/* Statistiques */}
                                        <div className="flex items-center gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span>{writer.booksCount} livres</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{writer.eventsCount} événements</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{writer.location}</span>
                                            </div>
                                        </div>

                                        {/* Note */}
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(writer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="text-sm text-muted-foreground ml-1">({writer.rating})</span>
                                        </div>

                                        {/* Prochain événement */}
                                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">Prochain événement</span>
                                            </div>
                                            <h4 className="text-sm font-semibold mb-1">{writer.upcomingEvent.title}</h4>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{writer.upcomingEvent.date}</span>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{writer.upcomingEvent.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex-1">
                                                Voir les livres
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Précédent</Button>
                                <Button size="sm">1</Button>
                                <Button variant="outline" size="sm">2</Button>
                                <Button variant="outline" size="sm">3</Button>
                                <Button variant="outline" size="sm">Suivant</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section CTA */}
                <section className="px-6 py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Vous êtes auteur indépendant ?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Rejoignez notre communauté et partagez vos histoires avec des lecteurs passionnés
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg">
                                Devenir auteur
                            </Button>
                            <Button variant="outline" size="lg">
                                Créer un événement
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
