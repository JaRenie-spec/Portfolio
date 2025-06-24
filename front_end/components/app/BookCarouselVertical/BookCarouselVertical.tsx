"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const books = [
  { title: "Le Secret de l’Encre", author: "M. Charpentier" },
  { title: "Ombres du Passé", author: "J. Moreau" },
  { title: "Lumière d’Hiver", author: "S. Berthier" },
  { title: "Voyage au Coeur des Étoiles", author: "A. Lefèvre" },
  { title: "Les Murmures de la Forêt", author: "C. Dubois" },
  { title: "Rêves d’Émeraude", author: "L. Martin" },
  { title: "L’Écho des Vagues", author: "P. Rousseau" },
  { title: "Au-delà des Nuages", author: "F. Garnier" },
  { title: "Le Chant des Sirènes", author: "E. Laurent" },
  { title: "Mystères de la Nuit", author: "T. Fontaine" },
];

export default function BookCarouselVertical() {
  return (
    <Carousel
      orientation="vertical"
      className="h-[300px] relative overflow-hidden"
    >
      <CarouselContent className="h-full">
        {books.map((book, i) => (
          <CarouselItem key={i} className="w-full">
            <div className="bg-card p-4 rounded shadow text-center">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-muted-foreground text-sm">{book.author}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1/2 -translate-x-1/2 -top-4 rotate-90" />
      <CarouselNext className="absolute left-1/2 -translate-x-1/2 -bottom-4 rotate-90" />
    </Carousel>
  );
}
