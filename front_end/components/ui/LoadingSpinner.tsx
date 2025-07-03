'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4',
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <div className={cn('animate-spin rounded-full border-b-2 border-primary', sizes[size])}></div>
            {text && <span className="mt-2 text-muted-foreground">{text}</span>}
        </div>
    )
}
