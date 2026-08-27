'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroBanner } from '@/components/ui/hero-banner'
import { ContentRow } from '@/components/ui/content-row'
import { TodayEpisodesRow } from '@/components/ui/today-episodes-row'
import { ContinueWatchingRow } from '@/components/ui/continue-watching-row'
import { CategoryVault } from '@/components/ui/category-vault'
import { LiveChannelsRow } from '@/components/ui/live-channels-row'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { useContent } from '@/hooks/use-content'
import { useFavorites } from '@/hooks/use-favorites'
import { useContinueWatching } from '@/hooks/use-continue-watching'
import { ContentItem } from '@/lib/types'

export function HomeClient() {
  const router = useRouter()
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSeasonEpisode, setShowSeasonEpisode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  // Continue Watching Hook
  const {
    items: continueWatchingItems,
    saveProgress,
    removeItem: removeWatchedItem
  } = useContinueWatching()

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

  const handlePlay = (content: ContentItem, season: number = 1, episode: number = 1) => {
    setSelectedContent(content)
    setShowDetails(false)
    if (content.type === 'series' || content.type === 'anime') {
      setSelectedSeason(season)
      setSelectedEpisode(episode)
      setShowSeasonEpisode(true)
    } else {
      saveProgress(content, 1, 1, 20)
      setShowPlayer(true)
    }
  }

  const handlePlayDirect = (content: ContentItem, season: number = 1, episode: number = 1) => {
    setSelectedContent(content)
    setSelectedSeason(season)
    setSelectedEpisode(episode)
    setShowDetails(false)
    setShowSeasonEpisode(false)
    saveProgress(content, season, episode, 25)
    setShowPlayer(true)
  }

  const handlePlayEpisode = (season: number, episode: number) => {
    setSelectedSeason(season)
    setSelectedEpisode(episode)
    setShowSeasonEpisode(false)
    if (selectedContent) {
      saveProgress(selectedContent, season, episode, 25)
    }
    setShowPlayer(true)
  }

  const handleViewDetails = (content: ContentItem) => {
    router.push(`/details/${content.id}?type=${content.type}`)
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-netflix-red selection:text-white">
      <Header />
      
      <main>
        {/* Hero Banner with Cinematic Video */}
        {heroContents.length > 0 && (
          <HeroBanner
            contents={heroContents}
            onPlay={(content) => handlePlay(content)}
            onAddToList={handleAddToList}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Cinematic Content Hub */}
        <div className="space-y-16 px-4 sm:px-8 lg:px-12 pb-32 -mt-32 relative z-10">
          
          {/* Continuar Assistindo Section */}
          {continueWatchingItems && continueWatchingItems.length > 0 && (
            <ContinueWatchingRow
              items={continueWatchingItems}
              onPlay={handlePlayDirect}
              onViewDetails={handleViewDetails}
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              onRemoveWatched={removeWatchedItem}
              favoriteIds={favoriteIds}
            />
          )}

          {/* Lançamentos de Hoje Section */}
          <TodayEpisodesRow
            onPlayEpisode={handlePlayDirect}
            onViewDetails={handleViewDetails}
          />

          {/* TV Ao Vivo & Canais VIP Section */}
          <LiveChannelsRow />

          {/* Trending Row - Reversa Selection */}
          <ContentRow
            title="Em Alta Reversa"
            contents={trendingMovies || []}
            loading={loadingTrending}
            onPlay={(content) => handlePlay(content)}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            onViewDetails={handleViewDetails}
            favoriteIds={favoriteIds}
          />

          {/* Popular Series Row */}
          <ContentRow
            title="Séries Populares"
            contents={trendingSeries || []}
            loading={loadingTrendingSeries}
            onPlay={(content) => handlePlay(content)}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            onViewDetails={handleViewDetails}
            favoriteIds={favoriteIds}
          />

          {/* Categorias // Vault Section */}
          <CategoryVault 
            categories={["Ação", "Ficção Científica", "Thriller", "Anime", "Documentários", "Terror", "Fantasia", "Crime", "Noir"]}
          />

          {/* Popular Movies Row */}
          <ContentRow
            title="Filmes Populares"
            contents={popularMovies || []}
            loading={loadingPopular}
            onPlay={(content) => handlePlay(content)}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            onViewDetails={handleViewDetails}
            favoriteIds={favoriteIds}
          />

          {/* Séries em Destaque */}
          <ContentRow
            title="Séries em Destaque"
            contents={popularSeries || []}
            loading={loadingPopularSeries}
            onPlay={(content) => handlePlay(content)}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            onViewDetails={handleViewDetails}
            favoriteIds={favoriteIds}
          />
        </div>
      </main>

      <Footer />

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
        onPlay={(content) => handlePlay(content)}
        onAddToList={handleAddToList}
        onRemoveFromList={handleRemoveFromList}
        isInList={selectedContent ? favoriteIds.includes(selectedContent.id) : false}
      />
    </div>
  )
}
