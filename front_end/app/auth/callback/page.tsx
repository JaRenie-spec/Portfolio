'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { keycloakService } from '@/lib/keycloak'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

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

        // Extraire la page d'origine depuis le state
        let redirectTo = '/'
        try {
          const stateObj = JSON.parse(decodeURIComponent(state))
          if (stateObj.appRedirect && typeof stateObj.appRedirect === 'string') {
            redirectTo = stateObj.appRedirect
          }
        } catch (e) {
          // fallback: redirectTo = '/'
        }
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur de connexion</strong>
            <span className="block">{error}</span>
            <span className="block text-sm text-muted-foreground mt-2">Une erreur s'est produite lors de la connexion avec Keycloak.</span>
            <button className="mt-4 underline text-primary" onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
