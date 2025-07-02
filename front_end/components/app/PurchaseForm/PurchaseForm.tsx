'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Lock } from 'lucide-react'
import { purchaseService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Book } from '@/lib/api'

interface PurchaseFormProps {
    book: Book
    onSuccess?: () => void
    onCancel?: () => void
}

export default function PurchaseForm({ book, onSuccess, onCancel }: PurchaseFormProps) {
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [cardholderName, setCardholderName] = useState('')

    const { loading, error, execute } = useApi(() =>
        purchaseService.create({
            bookId: book.id,
            amount: book.price,
            paymentMethod,
            // En production, ces données seraient envoyées à un service de paiement sécurisé
            paymentDetails: {
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate,
                cvv,
                cardholderName
            }
        })
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (paymentMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
                alert('Veuillez remplir tous les champs de paiement')
                return
            }
        }

        await execute()
        if (onSuccess) {
            onSuccess()
        }
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Finaliser l'achat
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Acheter "{book.title}" pour {book.price.toFixed(2)} €
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Méthode de paiement */}
                    <div>
                        <Label htmlFor="payment-method">Méthode de paiement</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une méthode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="card">Carte bancaire</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {paymentMethod === 'card' && (
                        <>
                            {/* Numéro de carte */}
                            <div>
                                <Label htmlFor="card-number">Numéro de carte</Label>
                                <Input
                                    id="card-number"
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                />
                            </div>

                            {/* Nom du titulaire */}
                            <div>
                                <Label htmlFor="cardholder-name">Nom du titulaire</Label>
                                <Input
                                    id="cardholder-name"
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            {/* Date d'expiration et CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry-date">Date d'expiration</Label>
                                    <Input
                                        id="expiry-date"
                                        type="text"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                        placeholder="MM/AA"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                        placeholder="123"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Résumé de l'achat */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Prix du livre</span>
                            <span>{book.price.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Frais de transaction</span>
                            <span>0.00 €</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{book.price.toFixed(2)} €</span>
                        </div>
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Sécurité */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>Paiement sécurisé par SSL</span>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? 'Traitement...' : `Payer ${book.price.toFixed(2)} €`}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Annuler
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
