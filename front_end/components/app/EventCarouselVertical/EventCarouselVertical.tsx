'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const events = [
    { name: 'Live Q&A', date: 'July 10' },
    { name: 'Book Launch', date: 'August 3' },
    { name: 'Author Panel', date: 'September 15' },
    { name: 'Writing Workshop', date: 'October 22' },
    { name: 'Book Signing', date: 'November 5' },
    { name: 'Literary Festival', date: 'December 12' },
    { name: 'Poetry Reading', date: 'January 20' },
    { name: 'Storytelling Night', date: 'February 14' },
    { name: 'Genre Exploration', date: 'March 8' },
    { name: 'Book Club Meeting', date: 'April 25' }
]

export default function EventCarouselVertical() {
    return (
        <Carousel orientation="vertical" className="h-[320px] relative overflow-hidden w-full max-w-xl">
            <CarouselContent className="h-full">
                {events.map((event, i) => (
                    <CarouselItem key={i} className='w-full'>
                        <div className="bg-card p-4 rounded shadow text-center">
                            <h3 className="font-semibold">{event.name}</h3>
                            <p className="text-muted-foreground text-sm">{event.date}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-1/2 -translate-x-1/2 -top-6 rotate-90 z-10" />
            <CarouselNext className="absolute left-1/2 -translate-x-1/2 -bottom-6 rotate-90 z-10" />
        </Carousel>
    )
}
