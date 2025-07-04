'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { useAuth } from '@/lib/hooks/useAuth'
import { authorService, Author } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateAuthorForm() {
    const router = useRouter()
    const { user } = useAuth()

    const {
        execute: createAuthor,
        loading,
        error,
    } = useApi<Author>((data: Partial<Author>) => authorService.create(data))

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [link, setLink] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!user) {
            alert('Vous devez être connecté pour créer un profil d\'auteur.')
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

        const newAuthor = await createAuthor(payload)
        if (newAuthor) {
            router.push(`/author/${newAuthor.id}`)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-500">{error}</p>}

                        <div>
                            <Label htmlFor="firstName">Prénom *</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="Votre prénom"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="lastName">Nom *</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Votre nom"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="pseudo">Pseudo *</Label>
                            <Input
                                id="pseudo"
                                value={pseudo}
                                onChange={e => setPseudo(e.target.value)}
                                placeholder="Votre nom d'auteur"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="votre.email@exemple.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="bio">Biographie</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="Parlez-nous de vous, de votre parcours, de vos inspirations..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="link">Lien personnel</Label>
                            <Input
                                id="link"
                                type="url"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                placeholder="https://votre-site.com"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Lien vers votre site web ou réseau social
                            </p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Création…' : 'Créer le profil'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
