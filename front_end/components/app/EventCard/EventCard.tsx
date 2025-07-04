'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { Event } from '@/lib/api'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.dateEvent)
  const formatted = date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            {event.isOnline && (
              <Badge variant="secondary" className="text-xs">En ligne</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatted}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{event.maxParticipants} participants max</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Badge variant="outline" className="w-full text-center">Détails →</Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
