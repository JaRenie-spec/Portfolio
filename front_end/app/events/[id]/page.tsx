'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { useApi } from '@/lib/hooks/useApi'
import { eventService, Event } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  User,
  MapPin,
  Users as UsersIcon
} from 'lucide-react'

export default function EventDetailPage() {
  const { id: rawId } = useParams() as { id?: string }
  if (!rawId) return <p className="text-center py-12 text-red-500">ID manquant</p>
  const id = rawId

  const router = useRouter()
  const { data: event, loading, error, execute } = useApi<Event>(eventService.getById)
  const { execute: deleteEvent } = useApi<void>(eventService.delete)

  useEffect(() => { execute(id) }, [id, execute])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  )
  if (error) return <p className="text-center py-12 text-red-500">Erreur : {error}</p>
  if (!event) return <p className="text-center py-12">Événement introuvable.</p>

  const date = new Date(event.dateEvent)
  const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const handleDelete = async () => {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      await deleteEvent(id)
      router.push('/events')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/75 backdrop-blur-sm border-b h-16 flex items-center px-6">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="mt-16 relative h-64 bg-cover bg-center" style={{ backgroundImage: "url('/images/event-hero.jpg')" }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 text-center">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate} à {formattedTime}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-3">

          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Details & Actions */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-2">
              <h3 className="font-medium text-muted-foreground">Détails</h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.maxParticipants != null && (
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="h-4 w-4 text-primary" />
                  <span>{event.maxParticipants} places disponibles</span>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-medium text-muted-foreground">Actions</h3>
              <Button variant="secondary" className="w-full" onClick={() => router.push(`/events/${id}/edit`)}>
                Modifier
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                Supprimer
              </Button>
              <Button variant="link" className="w-full" onClick={() => router.push('/events')}>
                ← Retour
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
