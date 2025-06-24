import { Navbar } from "@/components/app/Navbar/Navbar";
import HeroSection from "@/components/app/HeroSection/HeroSection";
import WriterCarousel from "@/components/app/WriterCarousel/WriterCarousel";
import BookCarouselVertical from "@/components/app/BookCarouselVertical/BookCarouselVertical";
import EventCarouselVertical from "@/components/app/EventCarouselVertical/EventCarouselVertical";
import RecommendedCarousel from "@/components/app/RecommendedCarousel/RecommendedCarousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-background shadow-md h-20 flex items-center px-8 justify-end">
        <Navbar />
      </header>

      <main className="flex flex-1 flex-col pt-32 space-y-16 px-6">
        <HeroSection />

        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            Featured Writers
          </h2>
          <WriterCarousel />
        </section>

        <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-center">
              📚 Livres vedettes
            </h2>
            <BookCarouselVertical />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-center">
              🎉 Évènements
            </h2>
            <EventCarouselVertical />
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            ✨ Recommandés pour vous
          </h2>
          <RecommendedCarousel />
        </section>
      </main>
    </div>
  );
}
