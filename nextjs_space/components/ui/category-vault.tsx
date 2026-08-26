
'use client'

import { useRouter } from 'next/navigation'
import { MOVIE_GENRES, TV_GENRES } from '@/lib/genres'

interface CategoryVaultProps {
  categories: string[]
}

export function CategoryVault({ categories }: CategoryVaultProps) {
  const router = useRouter()

  const handleCategoryClick = (cat: string) => {
    const normalized = cat.toLowerCase().trim()
    
    // Custom manual mappings
    if (normalized === 'anime') {
      router.push('/series?genre=16') // TV animation
      return
    }
    if (normalized === 'documentários') {
      router.push('/movies?genre=99') // Documentaries
      return
    }

    // Try to find in Movie Genres
    const movieGenre = MOVIE_GENRES.find(g => g.name.toLowerCase() === normalized)
    if (movieGenre) {
      router.push(`/movies?genre=${movieGenre.id}`)
      return
    }

    // Try to find in TV Genres
    const tvGenre = TV_GENRES.find(g => g.name.toLowerCase() === normalized)
    if (tvGenre) {
      router.push(`/series?genre=${tvGenre.id}`)
      return
    }

    // Default fallback to search
    router.push(`/search?q=${encodeURIComponent(cat)}`)
  }

  return (
    <section className="space-y-12 py-10 animate-fade-in">
      <div className="flex items-end gap-4">
        <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Categorias</h3>
        <span className="text-white/10 text-2xl font-black tracking-tighter uppercase leading-none mb-1">// VAULT</span>
      </div>
      <div className="flex flex-wrap gap-5">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="glass px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-netflix-red hover:border-netflix-red transition-all transform hover:-translate-y-2 active:scale-95 shadow-2xl"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  )
}
