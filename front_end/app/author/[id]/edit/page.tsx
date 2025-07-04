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
import { Footer } from '@/components/app/Footer/Footer'

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

    if (loading) return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </main>
            <Footer />
        </div>
    )
    if (error) return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12 min-h-[calc(100vh-128px)]">
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded shadow p-8">
                            {updateError && <p className="text-red-500">{updateError}</p>}
                            <h1 className="text-2xl font-bold text-center mb-6">Modifier le profil d'auteur</h1>
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
                                <Button variant="outline" onClick={() => router.back()} type="button">
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={updating}>
                                    {updating ? 'Enregistrement…' : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
