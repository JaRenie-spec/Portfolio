'use client'

import CreateBookForm from '@/components/app/CreateBookForm/CreateBookForm'
import { Navbar } from '@/components/app/Navbar/Navbar'

export default function CreateBookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <Navbar />
      <h1 className="text-2xl font-bold text-center mb-6">
        Publier un nouveau livre
      </h1>
      <CreateBookForm />
    </div>
  )
}
