'use client'

import { useCart } from '@/lib/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/app/Navbar/Navbar'
import { Footer } from '@/components/app/Footer/Footer'
import Link from 'next/link'

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>
            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12 min-h-[calc(100vh-128px)]">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8 text-center">Mon panier</h1>
                        {cart.length === 0 ? (
                            <div className="text-muted-foreground text-center">Votre panier est vide.</div>
                        ) : (
                            <>
                                <ul className="divide-y divide-muted-foreground/10 mb-6">
                                    {cart.map(item => (
                                        <li key={item.id} className="flex items-center gap-4 py-4">
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
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-semibold">Total :</span>
                                    <span className="font-bold text-lg">€{total.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={clearCart}>
                                        Vider le panier
                                    </Button>
                                    <Button className="flex-1" disabled={cart.length === 0}>
                                        Commander
                                    </Button>
                                </div>
                            </>
                        )}
                        <div className="mt-8 text-center">
                            <Link href="/books" className="text-primary underline">← Continuer mes achats</Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
