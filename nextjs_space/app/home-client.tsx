
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { HeroBanner } from '@/components/ui/hero-banner'
import { ContentRow } from '@/components/ui/content-row'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { useContent } from '@/hooks/use-content'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem } from '@/lib/types'

export function HomeClient() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSeasonEpisode, setShowSeasonEpisode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin')
    }
  }, [status, router])

  // Fetch different content categories
  const { contents: trendingMovies, loading: loadingTrending } = useContent({
    endpoint: '/api/content/trending',
    params: { type: 'movie' }
  })

  const { contents: popularMovies, loading: loadingPopular } = useContent({
    endpoint: '/api/content/popular',
    params: { type: 'movie' }
  })

  const { contents: trendingSeries, loading: loadingTrendingSeries } = useContent({
    endpoint: '/api/content/trending',
    params: { type: 'tv' }
  })

  const { contents: popularSeries, loading: loadingPopularSeries } = useContent({
    endpoint: '/api/content/popular',
    params: { type: 'tv' }
  })

  const {
    addToFavorites,
    removeFromFavorites,
    favoriteIds,
  } = useFavorites()

  const handlePlay = (content: ContentItem) => {
    setSelectedContent(content)
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
    
    // Se for série ou anime, mostrar seletor de temporada/episódio diretamente
    if (content.type === 'series' || content.type === 'anime') {
      setShowSeasonEpisode(true)
    } else {
      setShowDetails(true)
    }
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

  // Get hero content (first 5 trending movies)
  const heroContents = trendingMovies?.slice(0, 5) || []

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        {/* Hero Banner */}
        {heroContents.length > 0 && (
          <HeroBanner
            contents={heroContents}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Content Sections */}
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 pb-16">
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
            title="📺 Séries Populares"
            contents={trendingSeries || []}
            loading={loadingTrendingSeries}
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

          <ContentRow
            title="🎬 Séries em Destaque"
            contents={popularSeries || []}
            loading={loadingPopularSeries}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            onViewDetails={handleViewDetails}
            favoriteIds={favoriteIds}
          />
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
