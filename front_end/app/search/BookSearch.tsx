"use client";

import { useState } from "react";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
  if (!query.trim()) return;

  setLoading(true);
  setError(null);

  try {
    console.log("🔍 Recherche pour:", query);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/search?title=${encodeURIComponent(query)}`);
    console.log("📦 Status:", res.status);
    if (!res.ok) {
      throw new Error("Aucun livre trouvé");
    }
    const data = await res.json();
    console.log("✅ Résultat:", data);
    setResults(data);
  } catch (err: any) {
    console.error("Erreur recherche:", err);
    setError(err.message || "Erreur lors de la recherche");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="my-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Rechercher des livres, auteurs, genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((book) => (
              <li key={book.isbn} className="border p-2 rounded">
                <strong>{book.title}</strong> – {book.author?.pseudo || `${book.author?.firstName} ${book.author?.lastName}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
