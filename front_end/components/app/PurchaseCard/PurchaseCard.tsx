'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Eye } from 'lucide-react'
import { Book } from '@/lib/api'
import Link from 'next/link'

interface PurchaseCardProps {
    id: string
    book: Book
    amount: number
    purchaseDate: string
    status: 'pending' | 'completed' | 'cancelled'
}

export default function PurchaseCard({
    id,
    book,
    amount,
    purchaseDate,
    status
}: PurchaseCardProps) {
    const purchaseDateObj = new Date(purchaseDate)
    const formattedDate = purchaseDateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Couverture du livre */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                                {book.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </span>
                        </div>
                    </div>

                    {/* Informations du livre */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                                <p className="text-xs text-muted-foreground">{book.author.name}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                {getStatusBadge(status)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formattedDate}</span>
                                </div>
                                <span className="font-medium text-primary">
                                    {amount.toFixed(2)} €
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/books/${book.id}`}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        Voir
                                    </Link>
                                </Button>
                                {status === 'completed' && (
                                    <Button size="sm">
                                        <Download className="h-3 w-3 mr-1" />
                                        Télécharger
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
