'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpen, Users, Calendar, Search, User, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
    return (
        <nav className="flex items-center justify-between w-full px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Chapter One</span>
            </Link>

            {/* Navigation principale */}
            <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                    Accueil
                </Link>
                <Link href="/book" className="text-sm font-medium hover:text-primary transition-colors">
                    Livres
                </Link>
                <Link href="/writers" className="text-sm font-medium hover:text-primary transition-colors">
                    Écrivains
                </Link>
                <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
                    Événements
                </Link>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                </Button>
            </div>
        </nav>
    )
}
