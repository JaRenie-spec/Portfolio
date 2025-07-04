import { Navbar } from "@/components/app/Navbar/Navbar";
import { Footer } from "@/components/app/Footer/Footer";
import HeroSection from "@/components/app/HeroSection/HeroSection";
import WriterCarouselVertical from "@/components/app/WriterCarouselVertical/WriterCarouselVertical";
import BookCarouselHorizontal from "@/components/app/BookCarouselHorizontal/BookCarouselHorizontal";
import EventCarouselVertical from "@/components/app/EventCarouselVertical/EventCarouselVertical";
import RecommendedCarousel from "@/components/app/RecommendedCarousel/RecommendedCarousel";
import { CategoryGrid } from "@/components/app/CategoryGrid/CategoryGrid";
import BookSearch from "./search/BookSearch";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col">
                <HeroSection />

                <section className="py-16 px-6 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Livres à découvrir
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Découvrez les coups de cœur de nos lecteurs
                            </p>
                        </div>
                        <BookCarouselHorizontal />
                    </div>
                </section>

                <CategoryGrid />

                <section className="py-16 px-6 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">
                                        Écrivains à découvrir
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Découvrez des auteurs talentueux
                                    </p>
                                </div>
                                <WriterCarouselVertical />
                            </div>

                            <div>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">
                                        Événements à venir
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Rencontrez vos auteurs préférés
                                    </p>
                                </div>
                                <EventCarouselVertical />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Recommandés pour vous
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Des livres sélectionnés spécialement selon vos goûts
                            </p>
                        </div>
                        <RecommendedCarousel />
                    </div>
                </section>

                <section className="py-16 px-6 bg-muted/30">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Prêt à découvrir de nouveaux auteurs ?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Rejoignez notre communauté de lecteurs et soutenez les auteurs indépendants
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Commencer à explorer
                            </button>
                            <button className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors">
                                En savoir plus
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
