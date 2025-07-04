'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/hooks/useAuth'
import { useApi } from '@/lib/hooks/useApi'
import { eventService, Event } from '@/lib/api'

export default function CreateEventPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { execute: createEvent, loading, error } = useApi<Event>(data => eventService.create(data))

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [dateEvent, setDateEvent] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const [maxParticipants, setMaxParticipants] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      alert('Connectez-vous pour créer un événement')
      return
    }
    const payload: Partial<Event> = {
      title,
      description,
      dateEvent,
      location: location || undefined,
      isOnline,
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined
    }
    await createEvent(payload)
    router.push('/events')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center px-6">
        <Navbar />
      </header>
      <main className="pt-16 px-6 flex-1">
        <section className="max-w-4xl mx-auto py-12">
          <h1 className="text-3xl font-bold mb-6 text-center">Publier un nouvel événement</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
              <Input id="dateEvent" type="datetime-local" value={dateEvent} onChange={e => setDateEvent(e.target.value)} required />
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
              <Label htmlFor="isOnline" className="mb-0">Événement en ligne</Label>
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
            <div className="flex justify-end gap-2 pt-6">
              <Button variant="outline" onClick={() => router.push('/events')}>Annuler</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Création…' : 'Créer'}</Button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
	)
}
