'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { useAuth } from '@/lib/hooks/useAuth'
import { Author, authorService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/app/Navbar/Navbar'

export default function EditAuthorPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const { data: author, loading, error, execute } = useApi<Author>(authorService.getById)
    const {
        execute: updateAuthor,
        loading: updating,
        error: updateError,
    } = useApi<Author>((authorId: string, data: Partial<Author>) => authorService.update(authorId, data))

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [link, setLink] = useState('')

    // Charger l'auteur existant
    useEffect(() => {
        if (id) execute(id)
    }, [id, execute])

    // Initialiser les champs quand l'auteur est chargé
    useEffect(() => {
        if (author) {
            setFirstName(author.firstName)
            setLastName(author.lastName)
            setPseudo(author.pseudo)
            setEmail(author.email)
            setBio(author.bio || '')
            setLink(author.link || '')
        }
    }, [author])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!id) return

        if (!user) {
            alert('Vous devez être connecté pour modifier un profil d\'auteur.')
            return
        }

        const payload: Partial<Author> = {
            firstName,
            lastName,
            pseudo,
            email,
            bio,
            link,
        }

        await updateAuthor(id, payload)
        router.push(`/author/${id}`)
    }

    if (loading) return <p>Chargement…</p>
    if (error) return <p className="text-red-500 text-center mt-6">Erreur : {error}</p>

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow">
            {updateError && <p className="text-red-500">{updateError}</p>}
            <Navbar />

            <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>

            <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>

            <div>
                <Label htmlFor="pseudo">Pseudo</Label>
                <Input id="pseudo" value={pseudo} onChange={e => setPseudo(e.target.value)} required />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
                <Label htmlFor="bio">Biographie</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} />
            </div>

            <div>
                <Label htmlFor="link">Lien personnel</Label>
                <Input
                    id="link"
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
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
