'use client'

import { Button } from './button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  error: string
  onRetry?: () => void
  title?: string
  description?: string
}

export default function ErrorMessage({
  error,
  onRetry,
  title = "Une erreur s'est produite",
  description = "Impossible de charger les données. Veuillez réessayer."
}: ErrorMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {error && (
        <details className="mb-4 text-left max-w-md mx-auto">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Détails de l'erreur
          </summary>
          <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
            {error}
          </pre>
        </details>
      )}
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      )}
    </div>
  )
}
