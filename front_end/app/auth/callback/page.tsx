'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { keycloakService } from '@/lib/keycloak'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setError(`Erreur d'authentification: ${error}`)
          setIsProcessing(false)
          return
        }

        if (!code || !state) {
          setError('Paramètres de callback manquants')
          setIsProcessing(false)
          return
        }

        // Traiter le callback Keycloak
        await keycloakService.handleCallback(code, state)

        // Rediriger vers la page d'accueil ou la page demandée
        const redirectTo = searchParams.get('redirect_uri') || '/'
        router.push(redirectTo)
      } catch (err) {
        console.error('Erreur lors du traitement du callback:', err)
        setError('Erreur lors de la connexion. Veuillez réessayer.')
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Connexion en cours...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorMessage
            error={error}
            title="Erreur de connexion"
            description="Une erreur s'est produite lors de la connexion avec Keycloak."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return null
}
