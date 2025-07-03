'use client'

import { useEffect } from 'react'
import { eventService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Event } from '@/lib/api'
import EventCard from '../EventCard/EventCard'

export default function EventGrid() {
    const { data: events, loading, error, execute } = useApi<Event[]>(eventService.getAll);

    useEffect(() => {
        execute();
    }, [execute]);

    // Affichage du chargement
    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Affichage de l'erreur
    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                    onClick={() => execute()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // Affichage des événements
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events && events.length > 0 ? (
                events.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        dateEvent={event.dateEvent}
                        location={event.location}
                        author={event.author}
                        isOnline={event.isOnline}
                        maxParticipants={event.maxParticipants}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <div className="text-muted-foreground mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
                    <p className="text-muted-foreground">Il semble qu'il n'y ait pas encore d'événements disponibles.</p>
                </div>
            )}
        </div>
    )
}
