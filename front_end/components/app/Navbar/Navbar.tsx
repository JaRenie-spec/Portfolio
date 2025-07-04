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
import { useCart } from '@/lib/hooks/useCart'

export function Navbar() {
    const {
        user: kcUser,
        isAuthenticated,
        isLoading: authLoading,
        login,
        logout,
    } = useAuth()
    const { cart, removeFromCart, updateQuantity } = useCart()
    const cartCount = cart.reduce((sum, item) => sum + (typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0), 0)

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

            {/* Actions utilisateur + Panier */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className={`absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs px-1.5 py-0.5 transition-all ${cartCount > 0 ? 'scale-100' : 'scale-0'}`}>
                                {cartCount}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="p-2">
                            <h4 className="font-semibold mb-2">Mon panier</h4>
                            {cart.length === 0 ? (
                                <div className="text-muted-foreground text-sm">Votre panier est vide.</div>
                            ) : (
                                <ul className="divide-y divide-muted-foreground/10 max-h-64 overflow-y-auto">
                                    {cart.map(item => (
                                        <li key={item.id} className="flex items-center gap-2 py-2">
                                            <div className="flex-1">
                                                <div className="font-medium line-clamp-1">{item.title}</div>
                                                <div className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="outline" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                                                <span className="px-2 text-sm">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-red-500" onClick={() => removeFromCart(item.id)}>
                                                ×
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {cart.length > 0 && (
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="font-semibold">Total :</span>
                                    <span className="font-bold">€{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="mt-4 flex gap-2">
                                <Button className="w-full" disabled={cart.length === 0}>
                                    Commander
                                </Button>
                            </div>
                            <div className="mt-2 text-center">
                                <Link href="/cart" className="text-primary underline text-sm">Voir mon panier</Link>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const url = typeof window !== 'undefined'
                                ? window.location.pathname + window.location.search + window.location.hash
                                : '/';
                            login(url);
                        }}
                    >
                        <UserIcon className="h-4 w-4 mr-2" />
                        Connexion
                    </Button>
                )}
            </div>
        </nav>
    )
}
