'use client'

import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import WriterCard from '../WriterCard/WriterCard'

const writers = [
  { id: 1, name: 'Jane Doe', bio: 'Fantasy & Adventure', image: null },
  { id: 2, name: 'John Smith', bio: 'Science Fiction', image: null },
  { id: 3, name: 'Alice Johnson', bio: 'Romance Novels', image: null },
  { id: 4, name: 'Bob Lee', bio: 'Mystery & Thriller', image: null },
  { id: 5, name: 'Maria Garcia', bio: 'Historical Fiction', image: null },
  { id: 6, name: 'David Kim', bio: 'Non-Fiction & Essays', image: null },
  { id: 7, name: 'Emily Chen', bio: 'Children’s Books', image: null },
  { id: 8, name: 'Michael Brown', bio: 'Poetry & Short Stories', image: null },
  { id: 9, name: 'Sarah Wilson', bio: 'Graphic Novels', image: null },
  { id: 10, name: 'James Taylor', bio: 'Horror & Suspense', image: null }
]

export default function WriterCarousel() {
  const plugin = useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      orientation="horizontal"
    >
      <CarouselContent>
        {writers.map(writer => (
          <CarouselItem key={writer.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
            <WriterCard name={writer.name} bio={writer.bio} image={writer.image} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
