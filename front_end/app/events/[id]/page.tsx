'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { useApi } from '@/lib/hooks/useApi'
import { eventService, Event } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()!
  const router = useRouter()
  const { data: event, loading, error, execute } = useApi<Event>(eventService.getById)
  const { execute: deleteEvent } = useApi<void>(eventService.delete)

  useEffect(() => { if (id) execute(id) }, [id, execute])

  if (loading) return <p className="text-center py-12">Chargement…</p>
  if (error) return <p className="text-center text-red-500 py-12">Erreur : {error}</p>
  if (!event) return <p className="text-center py-12">Événement introuvable.</p>

  const formattedDate = new Date(event.dateEvent).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const handleDelete = async () => {
    if (confirm('Supprimer cet événement ?')) {
      await deleteEvent(id)
      router.push('/events')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center px-6">
        <Navbar />
      </header>
      <main className="pt-16 px-6 flex-1">
        <section className="max-w-4xl mx-auto py-12 text-center space-y-4">
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <div className="flex justify-center items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{formattedDate}</span>
          </div>
          {event.location && (
            <div className="flex justify-center items-center gap-2 text-sm">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{event.location}</span>
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex justify-center items-center gap-2 text-sm">
              <Users className="h-5 w-5 text-primary" />
              <span>Max {event.maxParticipants}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground px-4">{event.description}</p>
        </section>
      </main>
      <div className="border-t py-6">
        <div className="max-w-4xl mx-auto flex justify-between px-6">
          <Button variant="outline" onClick={() => router.push('/events')}>← Retour</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/events/${id}/edit`)}>Modifier</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
	)
}
