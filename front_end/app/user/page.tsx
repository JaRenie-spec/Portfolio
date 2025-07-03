'use client'

import { useState, useEffect } from 'react'
import { Navbar } from "@/components/app/Navbar/Navbar"
import { Footer } from "@/components/app/Footer/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userService, purchaseService } from '@/lib/api'
import { useApi } from '@/lib/hooks/useApi'
import { User, Purchase } from '@/lib/api'
import PurchaseList from "@/components/app/PurchaseList/PurchaseList"
import { Edit, Settings, BookOpen, Calendar, Mail } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function UserProfileContent() {
    const { data: user, loading: userLoading, error: userError, execute: executeUser } = useApi<User>(userService.getProfile);
    const { data: purchases, loading: purchasesLoading, error: purchasesError, execute: executePurchases } = useApi<Purchase[]>(purchaseService.getUserPurchases);

    useEffect(() => {
        executeUser();
        executePurchases();
    }, [executeUser, executePurchases]);

    if (userLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (userError) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="text-red-500 mb-4">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                            <p className="text-muted-foreground mb-4">{userError}</p>
                            <Button onClick={() => executeUser()}>
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                    <Navbar />
                </header>
                <main className="flex flex-1 flex-col pt-16">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Utilisateur non trouvé</h3>
                            <p className="text-muted-foreground mb-4">Veuillez vous connecter pour accéder à votre profil.</p>
                            <Button>
                                Se connecter
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const userInitials = user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>
            case 'author':
                return <Badge className="bg-blue-100 text-blue-800">Auteur</Badge>
            case 'client':
                return <Badge className="bg-green-100 text-green-800">Client</Badge>
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center">
                <Navbar />
            </header>

            <main className="flex flex-1 flex-col pt-16">
                <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-2xl font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    {getRoleBadge(user.role)}
                                </div>
                                <p className="text-muted-foreground mb-4">{user.email}</p>
                                <div className="flex items-center gap-4">
                                    <Button size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modifier le profil
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Paramètres
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                                <TabsTrigger value="purchases">Mes achats</TabsTrigger>
                                <TabsTrigger value="reviews">Mes avis</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total des achats</CardTitle>
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{purchases?.length || 0}</div>
                                            <p className="text-xs text-muted-foreground">
                                                Livres achetés
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Membre depuis</CardTitle>
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Année d'inscription
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Statut</CardTitle>
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">Actif</div>
                                            <p className="text-xs text-muted-foreground">
                                                Compte vérifié
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations personnelles</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                                                <p className="text-sm">{user.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                <p className="text-sm">{user.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Rôle</label>
                                                <p className="text-sm">{user.role}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Date d'inscription</label>
                                                <p className="text-sm">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="purchases" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Historique des achats</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <PurchaseList />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="reviews" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Mes avis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8">
                                            <div className="text-muted-foreground mb-4">
                                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-md font-semibold mb-2">Aucun avis trouvé</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Vous n'avez pas encore laissé d'avis sur les livres que vous avez achetés.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default function UserProfilePage() {
    return (
        <ProtectedRoute>
            <UserProfileContent />
        </ProtectedRoute>
    )
}
