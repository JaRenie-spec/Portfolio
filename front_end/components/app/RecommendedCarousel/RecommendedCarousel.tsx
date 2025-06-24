"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const recommendations = [
  { title: "L’Autre Côté", author: "L. Dumas" },
  { title: "Fragments", author: "C. Lemoine" },
  { title: "Nuits Blanches", author: "A. Rivière" },
  { title: "Mémoire Vive", author: "P. Girard" },
  { title: "L’Étoile du Matin", author: "S. Lefebvre" },
  { title: "Le Dernier Voyage", author: "M. Fontaine" },
  { title: "Au Fil des Pages", author: "J. Morel" },
  { title: "Les Ombres du Passé", author: "E. Charpentier" },
  { title: "Rêves d’Été", author: "F. Dubois" },
  { title: "L’Encre et le Sang", author: "T. Garnier" },
];

export default function RecommendedCarousel() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      orientation="horizontal"
      className="w-full"
    >
      <CarouselContent className="space-x-4">
        {recommendations.map((rec, i) => (
          <CarouselItem key={i} className="basis-1/2 md:basis-1/4">
            <div className="bg-card p-4 rounded shadow text-center">
              <h3 className="font-semibold">{rec.title}</h3>
              <p className="text-muted-foreground text-sm">{rec.author}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
