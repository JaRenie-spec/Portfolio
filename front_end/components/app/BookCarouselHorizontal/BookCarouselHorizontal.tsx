"use client";

import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const books = [
    { title: "Le Secret de l'Encre", author: "M. Charpentier" },
    { title: "Ombres du Passé", author: "J. Moreau" },
    { title: "Lumière d'Hiver", author: "S. Berthier" },
    { title: "Voyage au Coeur des Étoiles", author: "A. Lefèvre" },
    { title: "Les Murmures de la Forêt", author: "C. Dubois" },
    { title: "Rêves d'Émeraude", author: "L. Martin" },
    { title: "L'Écho des Vagues", author: "P. Rousseau" },
    { title: "Au-delà des Nuages", author: "F. Garnier" },
    { title: "Le Chant des Sirènes", author: "E. Laurent" },
    { title: "Mystères de la Nuit", author: "T. Fontaine" },
];

export default function BookCarouselHorizontal() {
    const plugin = useRef(Autoplay({ delay: 2000 }));

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseLeave={plugin.current.reset}
            orientation="horizontal"
        >
            <CarouselContent>
                {books.map((book, i) => (
                    <CarouselItem key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
                        <div className="bg-card p-4 rounded shadow text-center h-full">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-muted-foreground text-sm">{book.author}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
