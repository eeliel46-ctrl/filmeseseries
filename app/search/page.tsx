
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ContentCard } from '@/components/ui/content-card'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { ContentDetailsModal } from '@/components/ui/content-details-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeFilters, setActiveFilters] = useState({
    type: 'all' as 'all' | 'movie' | 'tv',
    genre: 'all',
    year: 'all'
  })
  const [searchResults, setSearchResults] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showSeasonEpisode, setShowSeasonEpisode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const {
    addToFavorites,
    removeFromFavorites,
    favoriteIds,
  } = useFavorites()

  const searchContent = async (query: string, filters = activeFilters) => {
    if (!query?.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ q: query })
      if (filters.type !== 'all') {
        params.append('type', filters.type)
      }

      const response = await fetch(`/api/content/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        let results = data.contents || []

        // Apply client-side filters
        if (filters.year !== 'all') {
          results = results.filter((item: ContentItem) => item.year === filters.year)
        }

        setSearchResults(results)
      } else {
        console.error('Search error:', data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      searchContent(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchContent(searchQuery, activeFilters)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value }
    setActiveFilters(newFilters)
    
    if (searchQuery?.trim()) {
      searchContent(searchQuery, newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all' as const,
      genre: 'all',
      year: 'all'
    }
    setActiveFilters(clearedFilters)
    
    if (searchQuery?.trim()) {
      searchContent(searchQuery, clearedFilters)
    }
  }

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
    setShowDetails(true)
  }

  const handleAddToList = async (content: ContentItem) => {
    await addToFavorites(content)
  }

  const handleRemoveFromList = async (content: ContentItem) => {
    await removeFromFavorites(content.id)
  }

  const activeFilterCount = Object.values(activeFilters).filter(value => value !== 'all').length

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">Buscar</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar filmes, séries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-red-600 h-12"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 h-12 px-6"
                disabled={loading}
              >
                Buscar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-white hover:bg-gray-800 h-12 px-4 relative"
              >
                <Filter className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </form>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-900 rounded-lg p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Filtros</h3>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Tipo</label>
                      <Select value={activeFilters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="movie">Filmes</SelectItem>
                          <SelectItem value="tv">Séries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ano</label>
                      <Select value={activeFilters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all">Todos os anos</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-gray-400 text-sm">Filtros ativos:</span>
                {activeFilters.type !== 'all' && (
                  <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-800">
                    Tipo: {activeFilters.type === 'movie' ? 'Filmes' : 'Séries'}
                  </Badge>
                )}
                {activeFilters.year !== 'all' && (
                  <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-800">
                    Ano: {activeFilters.year}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="pb-16">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Buscando conteúdo...</p>
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-400">Tente outras palavras-chave ou ajuste os filtros</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Resultados para "{searchQuery}" ({searchResults.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((content, index) => (
                    <motion.div
                      key={`${content.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ContentCard
                        content={content}
                        onPlay={handlePlay}
                        onAddToList={handleAddToList}
                        onRemoveFromList={handleRemoveFromList}
                        onViewDetails={handleViewDetails}
                        isInList={favoriteIds.includes(content.id)}
                        size="medium"
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Descubra seu próximo filme ou série</h3>
                <p className="text-gray-400">Use a barra de pesquisa para encontrar conteúdo incrível</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SeasonEpisodeModal
        isOpen={showSeasonEpisode}
        onClose={() => setShowSeasonEpisode(false)}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
