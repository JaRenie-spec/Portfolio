'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
    id: string
    title: string
    price: number
    quantity: number
}

type CartContextType = {
    cart: CartItem[]
    addToCart: (item: { id: string; title: string; price: number }) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('cart')
        if (stored) setCart(JSON.parse(stored))
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: { id: string; title: string; price: number }) => {
        setCart(prev => {
            const found = prev.find(i => i.id === item.id)
            if (found) return prev
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                const safeQty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
                return { ...i, quantity: safeQty }
            }
            return i
        }))
    }

    const clearCart = () => setCart([])

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}
