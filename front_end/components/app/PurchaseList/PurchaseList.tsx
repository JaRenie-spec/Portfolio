'use client'

import { useEffect } from 'react'
import { purchaseService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { Purchase } from '@/lib/api'
import PurchaseCard from '../PurchaseCard/PurchaseCard'

export default function PurchaseList() {
  const { data: purchases, loading, error, execute } = useApi<Purchase[]>(purchaseService.getUserPurchases);

  useEffect(() => {
    execute();
  }, [execute]);

  // Affichage du chargement
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-lg h-16 w-12"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-md font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        <button
          onClick={() => execute()}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Affichage des achats
  return (
    <div className="space-y-4">
      {purchases && purchases.length > 0 ? (
        purchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            id={purchase.id}
            book={purchase.book}
            amount={purchase.amount}
            purchaseDate={purchase.purchaseDate}
            status={purchase.status}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-md font-semibold mb-2">Aucun achat trouvé</h3>
          <p className="text-muted-foreground text-sm">
            Vous n'avez pas encore effectué d'achats.
          </p>
        </div>
      )}
    </div>
  )
}
