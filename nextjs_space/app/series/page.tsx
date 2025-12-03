
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ContentRow } from '@/components/ui/content-row'
import { ContentGrid } from '@/components/ui/content-grid'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/use-content'
import { TV_GENRES } from '@/lib/genres'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem } from '@/lib/types'

export default function SeriesPage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSeasonEpisode, setShowSeasonEpisode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [allSeries, setAllSeries] = useState<ContentItem[]>([])
  const [loadingAll, setLoadingAll] = useState(false)
  const searchParams = useSearchParams()
  const genreParam = searchParams?.get('genre')
  const activeGenre = genreParam ? parseInt(genreParam) : undefined
  const activeGenreName = activeGenre ? TV_GENRES.find(g => g.id === activeGenre)?.name : undefined

  // Fetch different series categories
  const { contents: trendingSeries, loading: loadingTrending } = useContent({
    endpoint: '/api/content/trending',
    params: { type: 'tv' }
  })

  const { contents: popularSeries, loading: loadingPopular } = useContent({
    endpoint: '/api/content/popular',
    params: { type: 'tv' }
  })

  const {
    addToFavorites,
    removeFromFavorites,
    favoriteIds,
  } = useFavorites()

  // Fetch all series with pagination
  useEffect(() => {
    const fetchAllSeries = async () => {
      setLoadingAll(true)
      try {
        const url = new URL(window.location.origin + '/api/content/discover')
        url.searchParams.set('type', 'tv')
        url.searchParams.set('page', String(currentPage))
        if (activeGenre) url.searchParams.set('genre', String(activeGenre))
        const response = await fetch(url.toString())
        const data = await response.json()
        setAllSeries(data.results || [])
      } catch (error) {
        console.error('Error fetching all series:', error)
      } finally {
        setLoadingAll(false)
      }
    }

    fetchAllSeries()
  }, [currentPage, activeGenre])

  const handlePlay = (content: ContentItem) => {
    setSelectedContent(content)
    
    // Se for série ou anime, mostrar seletor de temporada/episódio
    if (content.type === 'series' || content.type === 'anime') {
      setShowSeasonEpisode(true)
    } else {
      setShowPlayer(true)
    }
  }

  const handlePlayEpisode = (season: number, episode: number) => {
    setSelectedSeason(season)
    setSelectedEpisode(episode)
    setShowSeasonEpisode(false)
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

  const closeSeasonEpisode = () => {
    setShowSeasonEpisode(false)
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Séries</h1>
                <p className="text-gray-400">
                  {activeGenreName ? `Gênero ativo: ${activeGenreName}` : 'Descubra séries viciantes e emocionantes'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 pb-16">
            {/* Featured Categories */}
            <ContentRow
              title="🔥 Séries em Alta"
              contents={trendingSeries || []}
              loading={loadingTrending}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              onViewDetails={handleViewDetails}
              favoriteIds={favoriteIds}
            />

            <ContentRow
              title="⭐ Séries Populares"
              contents={popularSeries || []}
              loading={loadingPopular}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              onViewDetails={handleViewDetails}
              favoriteIds={favoriteIds}
            />

            {/* All Series with Pagination */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">📚 Todas as Séries</h2>
              
              <ContentGrid
                contents={allSeries}
                loading={loadingAll}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                onViewDetails={handleViewDetails}
                favoriteIds={favoriteIds}
              />

              {/* Pagination Controls */}
              {!loadingAll && allSeries.length > 0 && (
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
      <SeasonEpisodeModal
        isOpen={showSeasonEpisode}
        onClose={closeSeasonEpisode}
        content={selectedContent}
        onPlayEpisode={handlePlayEpisode}
      />

      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={closePlayer}
        content={selectedContent}
        season={selectedSeason}
        episode={selectedEpisode}
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
