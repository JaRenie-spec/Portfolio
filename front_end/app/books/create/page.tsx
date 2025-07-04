'use client'

import CreateBookForm from '@/components/app/CreateBookForm/CreateBookForm'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'

export default function CreateBookPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12 min-h-[calc(100vh-128px)]">
                    <div className="max-w-xl mx-auto">
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Publier un nouveau livre
                        </h1>
                        <CreateBookForm />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
