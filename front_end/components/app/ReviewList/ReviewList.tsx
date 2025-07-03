'use client'

import { useEffect } from 'react'
import { reviewService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Review } from '@/lib/api'
import ReviewCard from '../ReviewCard/ReviewCard'

interface ReviewListProps {
    bookId?: string
    limit?: number
}

export default function ReviewList({ bookId, limit }: ReviewListProps) {
    const { data: reviews, loading, error, execute } = useApi<Review[]>(
        bookId ? () => reviewService.getByBook(bookId) : reviewService.getAll
    );

    useEffect(() => {
        execute();
    }, [execute, bookId]);

    // Affichage du chargement
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Affichage de l'erreur
    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-4">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-md font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                <button
                    onClick={() => execute()}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // Affichage des avis
    const displayReviews = limit ? reviews?.slice(0, limit) : reviews;

    return (
        <div className="space-y-4">
            {displayReviews && displayReviews.length > 0 ? (
                displayReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        id={review.id}
                        rating={review.rating}
                        comment={review.comment}
                        user={review.user}
                        book={review.book}
                        createdAt={review.createdAt}
                    />
                ))
            ) : (
                <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <h3 className="text-md font-semibold mb-2">Aucun avis trouvé</h3>
                    <p className="text-muted-foreground text-sm">
                        {bookId ? 'Soyez le premier à laisser un avis sur ce livre.' : 'Il semble qu\'il n\'y ait pas encore d\'avis disponibles.'}
                    </p>
                </div>
            )}
        </div>
    )
}
