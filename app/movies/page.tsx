
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Film, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ContentRow } from '@/components/ui/content-row'
import { ContentGrid } from '@/components/ui/content-grid'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/use-content'
import { MOVIE_GENRES } from '@/lib/genres'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem } from '@/lib/types'

export default function MoviesPage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allMovies, setAllMovies] = useState<ContentItem[]>([])
  const [loadingAll, setLoadingAll] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const genreParam = searchParams?.get('genre')
  const activeGenre = genreParam ? parseInt(genreParam) : undefined
  const activeGenreName = activeGenre ? MOVIE_GENRES.find(g => g.id === activeGenre)?.name : undefined

  // Fetch different movie categories
  const { contents: trendingMovies, loading: loadingTrending } = useContent({
    endpoint: '/api/content/trending',
    params: { type: 'movie' }
  })

  const { contents: popularMovies, loading: loadingPopular } = useContent({
    endpoint: '/api/content/popular',
    params: { type: 'movie' }
  })

  const {
    addToFavorites,
    removeFromFavorites,
    favoriteIds,
  } = useFavorites()

  // Fetch all movies with pagination
  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoadingAll(true)
      try {
        const url = new URL(window.location.origin + '/api/content/discover')
        url.searchParams.set('type', 'movie')
        url.searchParams.set('page', String(currentPage))
        if (activeGenre) url.searchParams.set('genre', String(activeGenre))
        const response = await fetch(url.toString())
        const data = await response.json()
        setAllMovies(data.results || [])
      } catch (error) {
        console.error('Error fetching all movies:', error)
      } finally {
        setLoadingAll(false)
      }
    }

    fetchAllMovies()
  }, [currentPage, activeGenre])

  const handlePlay = (content: ContentItem) => {
    setSelectedContent(content)
    setShowPlayer(true)
  }

  const handleViewDetails = (content: ContentItem) => {
    setSelectedContent(content)
    setShowDetails(true)
  }

  const handleAddToList = async (content: ContentItem) => {
    await addToFavorites(content)
  }

  const handleRemoveFromList = async (content: ContentItem) => {
    await removeFromFavorites(content.id)
  }

  const closePlayer = () => {
    setShowPlayer(false)
    setSelectedContent(null)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedContent(null)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetPaginationOnGenreChange = () => setCurrentPage(1)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Filmes</h1>
                <p className="text-gray-400">
                  {activeGenreName ? `Gênero ativo: ${activeGenreName}` : 'Explore nossa seleção de filmes incríveis'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 pb-16">
            {/* Featured Categories */}
            <ContentRow
              title="🔥 Filmes em Alta"
              contents={trendingMovies || []}
              loading={loadingTrending}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              onViewDetails={handleViewDetails}
              favoriteIds={favoriteIds}
            />

            <ContentRow
              title="⭐ Filmes Populares"
              contents={popularMovies || []}
              loading={loadingPopular}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              onViewDetails={handleViewDetails}
              favoriteIds={favoriteIds}
            />

            {/* All Movies with Pagination */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">📚 Todos os Filmes</h2>
              
              <ContentGrid
                contents={allMovies}
                loading={loadingAll}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                onViewDetails={handleViewDetails}
                favoriteIds={favoriteIds}
              />

              {/* Pagination Controls */}
              {!loadingAll && allMovies.length > 0 && (
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Anterior
                  </Button>
                  
                  <div className="text-white bg-gray-800 px-4 py-2 rounded-lg">
                    Página {currentPage}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNextPage}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Próxima
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={closePlayer}
        content={selectedContent}
      />

      <ContentDetailsModal
        isOpen={showDetails}
        onClose={closeDetails}
        content={selectedContent}
        onPlay={handlePlay}
        onAddToList={handleAddToList}
        onRemoveFromList={handleRemoveFromList}
        isInList={selectedContent ? favoriteIds.includes(selectedContent.id) : false}
      />
    </div>
  )
}
