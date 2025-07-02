'use client'

import { useState, useEffect, useCallback } from 'react'
import { keycloakService, KeycloakUser } from '@/lib/keycloak'

export interface UseAuthReturn {
  user: KeycloakUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  refreshToken: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<KeycloakUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialiser l'état d'authentification
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = keycloakService.getCurrentUser()
        const authenticated = keycloakService.isAuthenticated()

        setUser(currentUser)
        setIsAuthenticated(authenticated)

        // Vérifier si le token est expiré et le rafraîchir si nécessaire
        if (authenticated && keycloakService.isTokenExpired()) {
          refreshToken()
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
        // En cas d'erreur, déconnecter l'utilisateur
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Fonction de connexion
  const login = useCallback(() => {
    keycloakService.login()
  }, [])

  // Fonction de déconnexion
  const logout = useCallback(() => {
    keycloakService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  // Fonction de rafraîchissement du token
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true)
      await keycloakService.refreshAccessToken()

      // Mettre à jour l'état après le rafraîchissement
      const currentUser = keycloakService.getCurrentUser()
      const authenticated = keycloakService.isAuthenticated()

      setUser(currentUser)
      setIsAuthenticated(authenticated)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      // En cas d'erreur, déconnecter l'utilisateur
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Écouter les changements d'URL pour gérer le callback Keycloak
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const error = urlParams.get('error')

      if (error) {
        console.error('Erreur d\'authentification Keycloak:', error)
        setIsLoading(false)
        return
      }

      if (code && state) {
        setIsLoading(true)
        keycloakService.handleCallback(code, state)
          .then((user) => {
            setUser(user)
            setIsAuthenticated(true)
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname)
          })
          .catch((error) => {
            console.error('Erreur lors de la gestion du callback:', error)
            setUser(null)
            setIsAuthenticated(false)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    }

    // Vérifier l'URL au chargement
    handleUrlChange()

    // Écouter les changements d'URL
    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken
  }
}
