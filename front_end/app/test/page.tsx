import { Navbar } from '@/components/app/Navbar/Navbar'
import { Button } from '@/components/ui/button'
import WriterCarousel from '../../components/app/WriterCarousel/WriterCarousel'

export default function Test() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50 bg-background shadow-md h-20 flex items-center px-8">
        <div className="w-full">
          <Navbar />
        </div>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 bg-background pt-32">
        <section className="max-w-2xl text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Independent Writers</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Discover, support, and buy books directly from talented independent authors. Our platform helps writers reach their audience and sell their books online with ease.
          </p>
          <Button size="lg" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </section>
        <section className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Featured Writers</h2>
          <WriterCarousel />
        </section>
      </main>
    </div>
  )
}
