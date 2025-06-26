'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'

const writers = [
    { id: 1, name: 'Jane Doe', bio: 'Fantasy & Adventure', image: null },
    { id: 2, name: 'John Smith', bio: 'Science Fiction', image: null },
    { id: 3, name: 'Alice Johnson', bio: 'Romance Novels', image: null },
    { id: 4, name: 'Bob Lee', bio: 'Mystery & Thriller', image: null },
    { id: 5, name: 'Maria Garcia', bio: 'Historical Fiction', image: null },
    { id: 6, name: 'David Kim', bio: 'Non-Fiction & Essays', image: null },
    { id: 7, name: 'Emily Chen', bio: "Children's Books", image: null },
    { id: 8, name: 'Michael Brown', bio: 'Poetry & Short Stories', image: null },
    { id: 9, name: 'Sarah Wilson', bio: 'Graphic Novels', image: null },
    { id: 10, name: 'James Taylor', bio: 'Horror & Suspense', image: null }
]

export default function WriterCarouselVertical() {
    return (
        <Carousel
            orientation="vertical"
            className="h-[300px] relative overflow-hidden"
        >
            <CarouselContent className="h-full">
                {writers.map(writer => (
                    <CarouselItem key={writer.id} className="w-full">
                        <div className="bg-card p-4 rounded shadow text-center">
                            <h3 className="font-semibold">{writer.name}</h3>
                            <p className="text-muted-foreground text-sm">{writer.bio}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-1/2 -translate-x-1/2 -top-4 rotate-90" />
            <CarouselNext className="absolute left-1/2 -translate-x-1/2 -bottom-4 rotate-90" />
        </Carousel>
    );
}
