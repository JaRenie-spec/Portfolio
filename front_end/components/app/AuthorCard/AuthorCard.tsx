'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, User } from 'lucide-react'
import Link from 'next/link'

interface AuthorCardProps {
    id: string
    pseudo: string
    firstName: string
    lastName: string
    bio?: string
    avatar?: string
    booksCount: number
}

export default function AuthorCard({ id, pseudo, firstName, lastName, bio, avatar, booksCount }: AuthorCardProps) {
    const initials = typeof pseudo === 'string' && pseudo.trim()
        ? pseudo.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
        : '??'

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatar} alt={pseudo} />
                        <AvatarFallback className="text-lg font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <h3 className="text-xl font-semibold">{pseudo}</h3>
                {bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {bio}
                    </p>
                )}
            </CardHeader>

            <CardContent className="pb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{booksCount} livre{booksCount !== 1 ? 's' : ''}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                    <Button asChild variant="outline" className="flex-1">
                        <Link href={`/authors/${id}`}>
                            <User className="h-4 w-4 mr-2" />
                            Profil
                        </Link>
                    </Button>
                    <Button asChild className="flex-1">
                        <Link href={`/authors/${id}/books`}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Livres
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
