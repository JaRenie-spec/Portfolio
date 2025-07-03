'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface ProtectedRouteProps {
    children: ReactNode
    fallback?: ReactNode
    redirectTo?: string
}

export function ProtectedRoute({
    children,
    fallback,
    redirectTo = '/'
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, login } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>
        }

        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-6 w-6" />
                        </div>
                        <CardTitle>Accès restreint</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Vous devez être connecté pour accéder à cette page.
                        </p>
                        <Button onClick={login} className="w-full">
                            Se connecter
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <>{children}</>
}
