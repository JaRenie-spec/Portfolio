'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { useAuth } from '@/lib/hooks/useAuth' // ← importer useAuth
import { Book, bookService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/app/Navbar/Navbar'

export default function EditBookPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth() // ← récupérer l'utilisateur pour authorId

  const { data: book, loading, error, execute } = useApi<Book>(bookService.getById)
  const {
    execute: updateBook,
    loading: updating,
    error: updateError,
  } = useApi<Book>((bookId: string, data: Partial<Book>) => bookService.update(bookId, data))

  const [title, setTitle] = useState('')
  const [isbn, setIsbn] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  // Charger le livre existant
  useEffect(() => {
    if (id) execute(id)
  }, [id, execute])

  // Initialiser les champs quand le livre est chargé
  useEffect(() => {
    if (book) {
      setTitle(book.title)
      setIsbn((book as any).isbn || '')
      setPrice(book.price.toString())
      setDescription(book.description || '')
      setRating(book.rating?.toString() || '')
      setFileUrl((book as any).fileUrl || '')
    }
  }, [book])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return

    if (!user) {
      alert('Vous devez être connecté pour modifier un livre.')
      return
    }

    const payload: Partial<Book> & { authorId: string } = {
      title,
      isbn,
      price: parseFloat(price),
      description,
      rating: rating ? parseFloat(rating) : undefined,
      fileUrl: fileUrl,
      authorId: user.sub, // ← inclure authorId pour valider le schéma
    }

    await updateBook(id, payload)
    router.push(`/books/${id}`)
  }

  if (loading) return <p>Chargement…</p>
  if (error) return <p className="text-red-500 text-center mt-6">Erreur : {error}</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      {updateError && <p className="text-red-500">{updateError}</p>}
      <Navbar />
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="isbn">ISBN</Label>
        <Input id="isbn" value={isbn} onChange={e => setIsbn(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="price">Prix (€)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="rating">Note (0–5)</Label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="fileUrl">URL de la couverture</Label>
        <Input
          id="fileUrl"
          type="url"
          value={fileUrl}
          onChange={e => setFileUrl(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={updating}>
          {updating ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
