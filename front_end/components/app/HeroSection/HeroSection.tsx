'use client'

import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-secondary to-background px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Empowering Independent Writers</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Discover, support, and buy books directly from talented independent authors.
        </p>
        <Button size="lg" className="text-lg px-8 py-4">
          Get Started
        </Button>
      </div>
    </section>
  )
}
// This HeroSection component serves as the landing section of the application, providing a brief introduction and a call to action for users to get started. It uses Tailwind CSS for styling and includes a button that can be linked to further actions or pages.
// The section is designed to be visually appealing with a gradient background and centered text, making it
