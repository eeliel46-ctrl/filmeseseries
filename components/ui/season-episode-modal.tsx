'use client'

import { useState, useEffect } from 'react'
import { X, Play, Star } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from './button'
import { ScrollArea } from './scroll-area'

interface SeasonEpisodeModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  onPlayEpisode: (season: number, episode: number) => void
}

interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path?: string
  air_date?: string
}

interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date?: string
}

export function SeasonEpisodeModal({
  isOpen,
  onClose,
  content,
  onPlayEpisode
}: SeasonEpisodeModalProps) {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const fetchSeasons = async () => {
      if (!content || !isOpen || content.type === 'movie') return

      setLoadingSeasons(true)
      try {
        const tmdbId = content.tmdbId || content.id
        console.log('Fetching seasons for TMDB ID:', tmdbId)

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=pt-BR`
        )
        const data = await response.json()

        console.log('Seasons data:', data)

        if (data.seasons) {
          const filteredSeasons = data.seasons.filter((s: Season) => s.season_number > 0)
          console.log('Filtered seasons:', filteredSeasons)
          setSeasons(filteredSeasons)

          if (filteredSeasons.length > 0) {
            setSelectedSeason(filteredSeasons[0].season_number)
            fetchEpisodes(filteredSeasons[0].season_number)
          }
        }
      } catch (error) {
        console.error('Error fetching seasons:', error)
      } finally {
        setLoadingSeasons(false)
      }
    }

    fetchSeasons()
  }, [content, isOpen])

  const fetchEpisodes = async (seasonNumber: number) => {
    if (!content) return

    setLoadingEpisodes(true)

    try {
      const tmdbId = content.tmdbId || content.id
      console.log('Fetching episodes for season:', seasonNumber)

      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${apiKey}&language=pt-BR`
      )
      const data = await response.json()

      console.log('Episodes data:', data)

      if (data.episodes) {
        setEpisodes(data.episodes)
      }
    } catch (error) {
      console.error('Error fetching episodes:', error)
    } finally {
      setLoadingEpisodes(false)
    }
  }

  const handleSeasonClick = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber)
    fetchEpisodes(seasonNumber)
  }

  const handlePlayEpisode = (episode: number) => {
    onPlayEpisode(selectedSeason, episode)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace('.', '')
    } catch {
      return dateString
    }
  }

  if (!isOpen || !content || content.type === 'movie') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#0a0a0a] rounded-lg overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh]"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <ScrollArea className="h-full max-h-[90vh]">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Temporadas e episódios
              </h2>
            </div>

            <div className="px-6 pb-4">
              {loadingSeasons ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <button
                      key={season.season_number}
                      onClick={() => handleSeasonClick(season.season_number)}
                      className={`flex items-center justify-between px-4 py-3 rounded-md transition-all ${selectedSeason === season.season_number
                          ? 'bg-red-600 text-white'
                          : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-black/30 text-lg font-bold">
                          {season.season_number}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-sm">{season.name}</div>
                          {season.air_date && (
                            <div className="text-xs opacity-70">
                              {formatDate(season.air_date)}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedSeason === season.season_number && (
                        <div className="flex items-center space-x-1 ml-4">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold">{season.episode_count}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              {loadingEpisodes ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : episodes.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800">
                  {episodes.map((episode) => (
                    <div
                      key={episode.episode_number}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                      onClick={() => handlePlayEpisode(episode.episode_number)}
                    >
                      <div className="flex-shrink-0 w-32 aspect-video bg-gray-800 rounded-md overflow-hidden relative">
                        {episode.still_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                            alt={episode.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Sem imagem</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-2 mb-1">
                          <span className="text-gray-400 text-sm font-semibold mt-0.5">
                            {selectedSeason} - {episode.episode_number}
                          </span>
                        </div>
                        <h4 className="text-white font-medium mb-1 line-clamp-1">
                          {episode.name}
                        </h4>
                        {episode.air_date && (
                          <p className="text-gray-500 text-xs mb-2">
                            {formatDate(episode.air_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Nenhum episódio disponível
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
