'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, User, Users } from 'lucide-react'
import Link from 'next/link'
import { Author } from '@/lib/api'

interface EventCardProps {
  id: string
  title: string
  description: string
  dateEvent: string
  location?: string
  author?: Author
  isOnline?: boolean
  maxParticipants?: number
}

export default function EventCard({
  id,
  title,
  description,
  dateEvent,
  location,
  author,
  isOnline,
  maxParticipants
}: EventCardProps) {
  const eventDate = new Date(dateEvent)
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const isPast = eventDate < new Date()

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${isPast ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
          <div className="flex gap-1">
            {isOnline && (
              <Badge variant="secondary" className="text-xs">
                En ligne
              </Badge>
            )}
            {isPast && (
              <Badge variant="outline" className="text-xs">
                Terminé
              </Badge>
            )}
          </div>
        </div>

        {author && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Par {author.pseudo}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
          </div>

          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location}</span>
            </div>
          )}

          {maxParticipants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Max {maxParticipants} participants</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/events/${id}`}>
              Détails
            </Link>
          </Button>
          {!isPast && (
            <Button asChild className="flex-1">
              <Link href={`/events/${id}/register`}>
                S'inscrire
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
