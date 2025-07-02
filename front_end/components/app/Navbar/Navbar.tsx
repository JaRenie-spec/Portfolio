'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpen, Users, Calendar, Search, User, ShoppingCart, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/hooks/useAuth'

export function Navbar() {
    const { user, isAuthenticated, isLoading, login, logout } = useAuth()

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
                <Link href="/books" className="text-sm font-medium hover:text-primary transition-colors">
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

                {/* Bouton de connexion/déconnexion */}
                {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                ) : isAuthenticated && user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="" alt={user.preferred_username} />
                                    <AvatarFallback>
                                        {user.given_name?.[0] || user.preferred_username[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden sm:inline text-sm">
                                    {user.given_name || user.preferred_username}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user.given_name} {user.family_name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/user" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Mon Profil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/user/settings" className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="outline" size="sm" onClick={login}>
                        <User className="h-4 w-4 mr-2" />
                        Connexion
                    </Button>
                )}
            </div>
        </nav>
    )
}
