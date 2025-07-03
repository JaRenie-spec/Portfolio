'use client'

import CreateAuthorForm from '@/components/app/CreateAuthorForm/CreateAuthorForm'

export default function CreateAuthorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Créer un nouveau profil d'auteur
      </h1>
      <CreateAuthorForm />
    </div>
  )
}
