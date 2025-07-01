import Link from 'next/link'
import { BookOpen, Mail, Twitter, Instagram, Facebook } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Logo et description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">Chapter One</span>
                        </Link>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            Soutenons ensemble les auteurs indépendants. Découvrez des histoires uniques
                            et achetez directement auprès des créateurs.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h3 className="font-semibold mb-4">Découvrir</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">
                                    Tous les livres
                                </Link>
                            </li>
                            <li>
                                <Link href="/writers" className="text-muted-foreground hover:text-primary transition-colors">
                                    Auteurs
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                                    Événements
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                                    Catégories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                                    Centre d'aide
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                                    Conditions d'utilisation
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                    <p>&copy; 2024 IndieBooks. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
