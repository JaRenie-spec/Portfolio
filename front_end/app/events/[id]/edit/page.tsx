'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useApi } from '@/lib/hooks/useApi'
import { eventService, Event } from '@/lib/api'

export default function EditEventPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''
  const router = useRouter()

  const { data: event, loading: loadingFetch, execute: fetchEvent } = useApi<Event>(() => eventService.getById(id))
  const { execute: updateEvent, loading: saving, error } = useApi<Event>(
    (sid: string, data: Partial<Event>) => eventService.update(sid, data)
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dateEvent, setDateEvent] = useState('')
  const [location, setLocation] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [maxParticipants, setMaxParticipants] = useState('')

  useEffect(() => {
    if (id) fetchEvent()
  }, [id, fetchEvent])

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setDateEvent(event.dateEvent.slice(0, 16))
      setLocation(event.location ?? '')
      setIsOnline(event.isOnline ?? false)
      setMaxParticipants(event.maxParticipants?.toString() ?? '')
    }
  }, [event])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload: Partial<Event> = {
      title,
      description,
      dateEvent,
      location: location || undefined,
      isOnline,
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
    }
    await updateEvent(id, payload)
    router.push(`/events/${id}`)
  }

  const handleDelete = async () => {
    if (confirm('Supprimer cet événement ?')) {
      await eventService.delete(id)
      router.push('/events')
    }
  }

  if (loadingFetch) return <p className="text-center py-12">Chargement…</p>

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center px-6">
        <Navbar />
      </header>

      <main className="pt-16 px-6 flex-1">
        <section className="max-w-4xl mx-auto py-12">
          <h1 className="text-3xl font-bold mb-6 text-center">Modifier l’événement</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="dateEvent">Date et heure</Label>
              <Input
                id="dateEvent"
                type="datetime-local"
                value={dateEvent}
                onChange={e => setDateEvent(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isOnline"
                type="checkbox"
                checked={isOnline}
                onChange={e => setIsOnline(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="isOnline" className="mb-0">
                Événement en ligne
              </Label>
            </div>
            <div>
              <Label htmlFor="maxParticipants">Nombre max. de participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                value={maxParticipants}
                onChange={e => setMaxParticipants(e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => router.push(`/events/${id}`)}>
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
