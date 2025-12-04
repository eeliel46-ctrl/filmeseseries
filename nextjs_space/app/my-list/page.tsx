
'use client'

import { useState } from 'react'
import { Heart, Trash2, Play, Info, SortAsc } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ContentCard } from '@/components/ui/content-card'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem, Favorite } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function MyListPage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSeasonEpisode, setShowSeasonEpisode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'year' | 'rating'>('date')

  const {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    favoriteIds,
  } = useFavorites()

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

  const closeSeasonEpisode = () => {
    setShowSeasonEpisode(false)
    setSelectedContent(null)
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

  // Convert favorites to ContentItem format
  const convertFavoriteToContentItem = (favorite: Favorite): ContentItem => ({
    id: favorite.contentId,
    title: favorite.title,
    type: favorite.contentType as 'movie' | 'series' | 'anime',
    poster: favorite.poster,
    year: favorite.year,
    rating: favorite.rating,
  })

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'year':
        return (b.year || '0').localeCompare(a.year || '0')
      case 'rating':
        return parseFloat(b.rating || '0') - parseFloat(a.rating || '0')
      case 'date':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  const favoriteContentItems = sortedFavorites.map(convertFavoriteToContentItem)

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando sua lista...</p>
            </div>
          </div>
        </main>
      </div>
    )
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
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Minha Lista</h1>
                <p className="text-gray-400">
                  {favorites.length} {favorites.length === 1 ? 'item' : 'itens'} salvos
                </p>
              </div>
            </div>

            {/* Sort Controls */}
            {favorites.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">Ordenar por:</span>
                </div>
                <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'year' | 'rating') => setSortBy(value)}>
                  <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="date">Data adicionada</SelectItem>
                    <SelectItem value="title">Título (A-Z)</SelectItem>
                    <SelectItem value="year">Ano</SelectItem>
                    <SelectItem value="rating">Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="pb-16">
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Sua lista está vazia</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Explore filmes e séries e adicione seus favoritos clicando no botão de coração
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Explorar Conteúdo
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {favoriteContentItems.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <ContentCard
                        content={content}
                        onPlay={handlePlay}
                        onAddToList={handleAddToList}
                        onRemoveFromList={handleRemoveFromList}
                        onViewDetails={handleViewDetails}
                        isInList={true}
                        size="medium"
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Quick Actions */}
          {favorites.length > 0 && (
            <div className="fixed bottom-6 right-6">
              <div className="bg-gray-900 rounded-lg shadow-lg p-4 space-y-3">
                <p className="text-sm text-gray-400 text-center">Ações rápidas</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => {
                      if (favoriteContentItems.length > 0) {
                        const randomContent = favoriteContentItems[Math.floor(Math.random() * favoriteContentItems.length)]
                        handlePlay(randomContent)
                      }
                    }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Aleatório
                  </Button>
                </div>
              </div>
            </div>
          )}
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
        onClose={() => setShowPlayer(false)}
        content={selectedContent}
        season={selectedSeason}
        episode={selectedEpisode}
      />

      <ContentDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        content={selectedContent}
        onPlay={handlePlay}
        onAddToList={handleAddToList}
        onRemoveFromList={handleRemoveFromList}
        isInList={selectedContent ? favoriteIds.includes(selectedContent.id) : false}
      />
    </div>
  )
}
