'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Oups ! Quelque chose s'est mal passé</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support si le problème persiste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={this.handleReset}>
                Réessayer
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Retour à l'accueil
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left max-w-md mx-auto">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Détails de l'erreur (développement)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
