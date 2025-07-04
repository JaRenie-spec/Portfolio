'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { bookService } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'    // ← importer useAuth

export default function CreateBookForm() {
    const router = useRouter()
    const { user } = useAuth()                   // ← récupérer user
    const [title, setTitle] = useState('')
    const [isbn, setIsbn] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // On ajoute authorId depuis keycloakUser.sub
        const payload: Record<string, any> = {
            title,
            isbn,
            price: parseFloat(price),
            description,
            fileUrl,
            authorId: user?.sub,      // ← MUST: fournir authorId
        }

        const response = await bookService.create(payload)
        setLoading(false)

        if (response.success) {
            router.push('/books')
        } else {
            setError(response.error || 'Erreur lors de la création du livre')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4 bg-white rounded shadow">
            {error && <p className="text-red-500">{error}</p>}

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
                <Label htmlFor="fileUrl">URL de la couverture</Label>
                <Input
                    id="fileUrl"
                    type="url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Publication...' : 'Publier le livre'}
            </Button>
        </form>
    )
}
