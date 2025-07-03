'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/hooks/useAuth'

export function Navbar() {
  const {
    user: kcUser,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth()

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">Chapter One</span>
      </Link>

      {/* Liens de navigation */}
      <div className="flex items-center gap-6">
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

        {isAuthenticated && (
          <Link href="/books/create">
            <Button variant="outline" size="sm">
              Publier un livre
            </Button>
          </Link>
        )}
      </div>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ShoppingCart className="h-4 w-4" />
        </Button>

        {authLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        ) : isAuthenticated && kcUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  {/* Pas de propriété avatar sur KeycloakUser,
                      on passe une source vide pour forcer le fallback */}
                  <AvatarImage src="" alt={kcUser.preferred_username} />
                  <AvatarFallback>
                    {kcUser.given_name?.[0] || kcUser.preferred_username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {kcUser.given_name || kcUser.preferred_username}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium">
                  {kcUser.given_name} {kcUser.family_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kcUser.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
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
            <UserIcon className="h-4 w-4 mr-2" />
            Connexion
          </Button>
        )}
      </div>
    </nav>
  )
}
