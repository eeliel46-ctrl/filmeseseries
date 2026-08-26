'use client'

import { useState, useEffect } from 'react'
import { X, Play, Star, Clock, Calendar, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
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

function getEpisodeReleaseInfo(airDate?: string) {
  if (!airDate) {
    return {
      isReleased: true,
      label: 'Disponível',
      formattedDate: '',
      formattedTime: '21:00h',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }

  // Parse release date assuming 21:00 BRT standard release window
  const releaseDateTime = new Date(`${airDate}T21:00:00-03:00`)
  const now = new Date()
  const isReleased = now >= releaseDateTime

  const dateObj = new Date(`${airDate}T00:00:00`)
  const dayMonth = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
  const fullDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const isToday = now.toISOString().split('T')[0] === airDate

  if (!isReleased) {
    return {
      isReleased: false,
      isToday,
      formattedDate: fullDate,
      formattedTime: '21:00h BRT',
      label: isToday ? 'Lança Hoje às 21:00h' : `Lança em ${dayMonth} às 21:00h`,
      badgeClass: isToday
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    }
  }

  return {
    isReleased: true,
    isToday: false,
    formattedDate: fullDate,
    formattedTime: '21:00h',
    label: `Exibido em ${dayMonth}`,
    badgeClass: 'bg-white/5 text-white/50 border-white/10'
  }
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
  const [upcomingNoticeEp, setUpcomingNoticeEp] = useState<Episode | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (upcomingNoticeEp) {
          setUpcomingNoticeEp(null)
        } else {
          onClose()
        }
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
  }, [isOpen, onClose, upcomingNoticeEp])

  useEffect(() => {
    const fetchSeasons = async () => {
      if (!content || !isOpen || content.type === 'movie') return

      setLoadingSeasons(true)
      try {
        const tmdbId = content.tmdbId || content.id
        const response = await fetch(`/api/content/tv?tmdbId=${tmdbId}`)
        const data = await response.json()

        if (data.seasons) {
          if (Array.isArray(data.seasons)) {
            const filteredSeasons = data.seasons.filter((s: Season) => s.season_number > 0)
            setSeasons(filteredSeasons)

            if (filteredSeasons.length > 0) {
              const firstSeasonNum = filteredSeasons[0].season_number
              setSelectedSeason(firstSeasonNum)
              fetchEpisodes(firstSeasonNum)
            }
          } else if (typeof data.seasons === 'number') {
            const generatedSeasons: Season[] = []
            for (let i = 1; i <= data.seasons; i++) {
              generatedSeasons.push({
                season_number: i,
                name: `Temporada ${i}`,
                episode_count: 0
              })
            }
            setSeasons(generatedSeasons)
            if (generatedSeasons.length > 0) {
              setSelectedSeason(generatedSeasons[0].season_number)
              fetchEpisodes(generatedSeasons[0].season_number)
            }
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
      const response = await fetch(`/api/content/tv?tmdbId=${tmdbId}&season=${seasonNumber}`)
      const data = await response.json()

      let episodesData = data.episodes
      if (!episodesData && Array.isArray(data)) {
        episodesData = data
      }

      if (episodesData) {
        const mappedEpisodes = episodesData.map((ep: any) => ({
          episode_number: ep.number || ep.episode_number,
          name: ep.title || ep.name || `Episódio ${ep.number || ep.episode_number}`,
          overview: ep.description || ep.overview || '',
          still_path: ep.thumbnail || ep.still_path || '',
          air_date: ep.air_date || ''
        }))
        setEpisodes(mappedEpisodes)
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

  const handleEpisodeClick = (ep: Episode) => {
    const info = getEpisodeReleaseInfo(ep.air_date)
    if (!info.isReleased) {
      // Show informational launch modal
      setUpcomingNoticeEp(ep)
    } else {
      onPlayEpisode(selectedSeason, ep.episode_number)
    }
  }

  const handleForcePlayUpcoming = () => {
    if (upcomingNoticeEp) {
      onPlayEpisode(selectedSeason, upcomingNoticeEp.episode_number)
      setUpcomingNoticeEp(null)
    }
  }

  if (!isOpen || !content || content.type === 'movie') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                {content.title}
              </h2>
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-0.5">
                Temporadas e Episódios Atualizados
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full w-9 h-9 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Season Selector Tabs */}
            <div className="p-6 pb-4">
              {loadingSeasons ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <button
                      key={season.season_number}
                      onClick={() => handleSeasonClick(season.season_number)}
                      className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                        selectedSeason === season.season_number
                          ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30 scale-105'
                          : 'bg-zinc-900/80 text-white/60 hover:text-white hover:bg-zinc-800 border border-white/5'
                      }`}
                    >
                      <span>{season.name}</span>
                      {season.episode_count > 0 && (
                        <span className="text-[10px] opacity-70 bg-black/30 px-2 py-0.5 rounded-full">
                          {season.episode_count} eps
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episodes List */}
            <div className="px-6 pb-8">
              {loadingEpisodes ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-netflix-red"></div>
                  <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
                    Carregando episódios e datas...
                  </p>
                </div>
              ) : episodes.length > 0 ? (
                <div className="space-y-3">
                  {episodes.map((episode) => {
                    const releaseInfo = getEpisodeReleaseInfo(episode.air_date)
                    const stillImg = episode.still_path
                      ? (episode.still_path.startsWith('http')
                        ? episode.still_path
                        : `https://image.tmdb.org/t/p/w300${episode.still_path}`)
                      : (content.backdrop || content.poster || '')

                    return (
                      <div
                        key={episode.episode_number}
                        onClick={() => handleEpisodeClick(episode)}
                        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border transition-all duration-300 group cursor-pointer ${
                          !releaseInfo.isReleased
                            ? 'bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40'
                            : 'bg-zinc-900/50 border-white/5 hover:border-netflix-red/40 hover:bg-zinc-900/90'
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative flex-shrink-0 w-full sm:w-44 aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-white/5 shadow-md">
                          {stillImg ? (
                            <Image
                              src={stillImg}
                              alt={episode.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="176px"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                              <span className="text-white/30 text-xs font-bold uppercase">Sem imagem</span>
                            </div>
                          )}

                          {/* Hover Play / Clock Icon Overlay */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all ${
                              !releaseInfo.isReleased ? 'bg-blue-600/80 backdrop-blur-sm' : 'bg-netflix-red shadow-lg shadow-netflix-red/40'
                            }`}>
                              {!releaseInfo.isReleased ? (
                                <Clock className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              )}
                            </div>
                          </div>

                          {/* Episode Index Pill */}
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-black text-white tracking-wider">
                            EP {episode.episode_number}
                          </div>
                        </div>

                        {/* Episode Info & Release Badges */}
                        <div className="flex-1 min-w-0 space-y-1.5 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-white font-bold text-sm truncate group-hover:text-netflix-red transition-colors">
                              {episode.name}
                            </h4>

                            {/* Release Date Badge */}
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${releaseInfo.badgeClass}`}>
                              {!releaseInfo.isReleased ? (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>{releaseInfo.label}</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>{releaseInfo.label}</span>
                                </>
                              )}
                            </span>
                          </div>

                          {episode.overview && (
                            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-medium">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-white/30 text-xs font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-xl">
                  Nenhum episódio cadastrado para esta temporada.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Upcoming Episode Notice Modal Overlay */}
          <AnimatePresence>
            {upcomingNoticeEp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="max-w-md w-full bg-zinc-900 border border-blue-500/30 p-8 rounded-2xl shadow-2xl space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-xl">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                      Lançamento Programado
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {upcomingNoticeEp.name}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                      Este episódio está agendado para estrear em{' '}
                      <strong className="text-blue-300">
                        {getEpisodeReleaseInfo(upcomingNoticeEp.air_date).formattedDate}
                      </strong>{' '}
                      às <strong className="text-blue-300">21:00h BRT</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={() => setUpcomingNoticeEp(null)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl"
                    >
                      Entendido, Aguardar
                    </Button>
                    <Button
                      onClick={handleForcePlayUpcoming}
                      className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-netflix-red/30"
                    >
                      Tentar Assistir Agora
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
