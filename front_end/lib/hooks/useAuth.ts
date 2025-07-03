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

        // Rafraîchir si token expiré
        if (authenticated && keycloakService.isTokenExpired()) {
          refreshToken()
        }
      } catch (error) {
        console.error("Erreur initialisation auth:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  // Connexion
  const login = useCallback(() => {
    keycloakService.login()
  }, [])

  // Déconnexion
  const logout = useCallback(() => {
    keycloakService.logout()
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }, [])

  // Rafraîchir le token
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true)
      await keycloakService.refreshAccessToken()

      const currentUser = keycloakService.getCurrentUser()
      const authenticated = keycloakService.isAuthenticated()
      setUser(currentUser)
      setIsAuthenticated(authenticated)

      // Stocker le token d'accès
      const token = keycloakService.getAccessToken()
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', token)
      }
    } catch (error) {
      console.error('Erreur rafraîchissement token:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Callback OIDC de Keycloak
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const error = params.get('error')

      if (error) {
        console.error("Erreur Keycloak:", error)
        setIsLoading(false)
        return
      }

      if (code && state) {
        setIsLoading(true)
        keycloakService.handleCallback(code, state)
          .then(() => {
            const currentUser = keycloakService.getCurrentUser()
            setUser(currentUser)
            setIsAuthenticated(true)
            // Stocker token
            const token = keycloakService.getAccessToken()
            if (token && typeof window !== 'undefined') {
              localStorage.setItem('authToken', token)
            }
            window.history.replaceState({}, document.title, window.location.pathname)
          })
          .catch((err) => {
            console.error('Erreur callback Keycloak:', err)
            setUser(null)
            setIsAuthenticated(false)
          })
          .finally(() => setIsLoading(false))
      }
    }

    handleUrlChange()
    window.addEventListener('popstate', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  }
}
