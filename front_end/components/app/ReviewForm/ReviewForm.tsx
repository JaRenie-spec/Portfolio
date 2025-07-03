'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { reviewService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'

interface ReviewFormProps {
    bookId: string
    bookTitle: string
    authorId: string
    onSuccess?: () => void
    onCancel?: () => void
}

export default function ReviewForm({ bookId, bookTitle, authorId, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hoveredRating, setHoveredRating] = useState(0)

    const { loading, error, execute } = useApi(() =>
        reviewService.create({
            bookId,
            authorId,
            rating,
            comment
        })
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            alert('Veuillez sélectionner une note')
            return
        }

        if (comment.trim().length < 10) {
            alert('Votre commentaire doit contenir au moins 10 caractères')
            return
        }

        await execute()
        if (onSuccess) {
            onSuccess()
        }
    }

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                onMouseEnter={() => setHoveredRating(index + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
            >
                <Star
                    className={`h-8 w-8 transition-colors ${index < (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                />
            </button>
        ))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Laisser un avis</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Partagez votre expérience avec "{bookTitle}"
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Note avec étoiles */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Votre note *
                        </label>
                        <div className="flex items-center gap-1">
                            {renderStars()}
                            <span className="ml-2 text-sm text-muted-foreground">
                                {rating > 0 && `(${rating}/5)`}
                            </span>
                        </div>
                    </div>

                    {/* Commentaire */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-2">
                            Votre commentaire *
                        </label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre avis sur ce livre..."
                            className="min-h-[100px]"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Minimum 10 caractères
                        </p>
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading || rating === 0 || comment.trim().length < 10}>
                            {loading ? 'Envoi...' : 'Publier l\'avis'}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Annuler
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
