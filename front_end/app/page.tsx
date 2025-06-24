// app/page.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Bienvenue sur AutheursConnect</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Une plateforme dédiée aux auteurs indépendants et à leurs lecteurs curieux.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">📚 Livres vedette</h2>
        <Carousel orientation="vertical" className="h-[300px]">
          <CarouselContent>
            {[...Array(5)].map((_, i) => (
              <CarouselItem key={i}>
                <div className="bg-card p-4 rounded shadow">Livre vedette #{i + 1}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">🎉 Évènements à venir</h2>
        <Carousel orientation="vertical" className="h-[300px]">
          <CarouselContent>
            {[...Array(5)].map((_, i) => (
              <CarouselItem key={i}>
                <div className="bg-card p-4 rounded shadow">Événement #{i + 1}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">✨ Recommandés pour vous</h2>
        <Carousel orientation="horizontal">
          <CarouselContent className="space-x-4">
            {[...Array(8)].map((_, i) => (
              <CarouselItem key={i} className="basis-1/3">
                <div className="bg-card p-4 rounded shadow text-center">Suggestion #{i + 1}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
