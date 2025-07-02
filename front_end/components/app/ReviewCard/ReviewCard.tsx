'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar } from 'lucide-react'
import { User, Book } from '@/lib/api'

interface ReviewCardProps {
  id: string
  rating: number
  comment: string
  user: User
  book: Book
  createdAt: string
}

export default function ReviewCard({
  id,
  rating,
  comment,
  user,
  book,
  createdAt
}: ReviewCardProps) {
  const userInitials = user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const reviewDate = new Date(createdAt)
  const formattedDate = reviewDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm">{user.name}</h4>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(rating)}
                <span className="text-xs text-muted-foreground ml-1">
                  ({rating}/5)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">
          {comment}
        </p>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Avis sur
          </Badge>
          <span className="text-sm font-medium">{book.title}</span>
        </div>
      </CardContent>
    </Card>
  )
}
