'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    className?: string
}

export function SearchBar({ placeholder = "Rechercher des livres, auteurs...", onSearch, className = "" }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSearch = () => {
        if (query.trim() && onSearch) {
            onSearch(query.trim())
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const clearSearch = () => {
        setQuery('')
        setIsExpanded(false)
    }

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsExpanded(true)}
                        className="pl-10 pr-10"
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button
                    onClick={handleSearch}
                    className="ml-2"
                    disabled={!query.trim()}
                >
                    Rechercher
                </Button>
            </div>

            {/* Suggestions de recherche (optionnel) */}
            {isExpanded && query && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                        <div className="text-sm text-muted-foreground mb-2">Suggestions :</div>
                        <div className="space-y-1">
                            <button
                                className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                                onClick={() => setQuery('romans')}
                            >
                                Romans
                            </button>
                            <button
                                className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                                onClick={() => setQuery('science-fiction')}
                            >
                                Science-fiction
                            </button>
                            <button
                                className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                                onClick={() => setQuery('fantasy')}
                            >
                                Fantasy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
