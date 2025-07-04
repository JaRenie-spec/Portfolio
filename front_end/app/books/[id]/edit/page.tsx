'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/lib/hooks/useApi'
import { useAuth } from '@/lib/hooks/useAuth'
import { Book, bookService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'

export default function EditBookPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()

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
    const [fileUrl, setFileUrl] = useState('')

    useEffect(() => {
        if (id) execute(id)
    }, [id, execute])

    useEffect(() => {
        if (book) {
            setTitle(book.title)
            setIsbn((book as any).isbn || '')
            setPrice(book.price.toString())
            setDescription(book.description || '')
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
            fileUrl: fileUrl,
            authorId: user.sub,
        }

        await updateBook(id, payload)
        router.push(`/books/${id}`)
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
                            <h1 className="text-2xl font-bold text-center mb-6">Modifier le livre</h1>
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
                                <Input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="fileUrl">URL de la couverture</Label>
                                <Input id="fileUrl" type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} required />
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
