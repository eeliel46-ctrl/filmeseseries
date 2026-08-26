'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Flame, ChevronLeft, ChevronRight, Play, Tv, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { ContentItem } from '@/lib/types'

export interface TodayReleaseItem {
  id: string
  tmdbId: string
  title: string
  type: 'series' | 'anime'
  category: 'Série' | 'Anime'
  tag: '★ Hoje' | '★ Atualizado'
  poster: string | null
  backdrop: string | null
  season: number
  episode: number
  episodeCode: string
  episodeTitle: string
  rating: string
  year: string
  overview: string
}

interface TodayEpisodesRowProps {
  onPlayEpisode: (content: ContentItem, season: number, episode: number) => void
  onViewDetails?: (content: ContentItem) => void
}

export function TodayEpisodesRow({ onPlayEpisode, onViewDetails }: TodayEpisodesRowProps) {
  const [releases, setReleases] = useState<TodayReleaseItem[]>([])
  const [subtitle, setSubtitle] = useState('19 títulos novos')
  const [loading, setLoading] = useState(true)
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch('/api/content/today-episodes')
        if (!res.ok) return
        const data = await res.json()
        if (data.releases && data.releases.length > 0) {
          setReleases(data.releases)
          if (data.subtitle) setSubtitle(data.subtitle)
        }
      } catch (err) {
        console.error('Error fetching today releases:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReleases()
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const { scrollLeft, clientWidth } = rowRef.current
    const scrollAmount = clientWidth * 0.75
    const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount
    rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  const handleCardClick = (item: TodayReleaseItem) => {
    const contentItem: ContentItem = {
      id: item.id,
      tmdbId: item.tmdbId,
      title: item.title,
      type: item.type,
      poster: item.poster || '',
      backdrop: item.backdrop || '',
      rating: item.rating,
      year: item.year,
      overview: item.overview,
      genres: [item.category]
    }
    onPlayEpisode(contentItem, item.season, item.episode)
  }

  if (!loading && releases.length === 0) return null

  return (
    <div className="space-y-4 relative group/row">
      {/* Header with Flame Icon */}
      <div className="flex items-center space-x-3 px-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center shadow-lg shadow-orange-600/30">
          <Flame className="w-5 h-5 text-white fill-current" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Lançamentos de Hoje
          </h2>
          <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrow Left */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/15 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-netflix-red shadow-2xl backdrop-blur-md"
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
        >
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] bg-zinc-900/80 rounded-2xl animate-pulse border border-white/5"
                />
              ))
            : releases.map((item) => {
                const isAnime = item.category === 'Anime'

                return (
                  <motion.div
                    key={item.id + item.episodeCode}
                    whileHover={{ scale: 1.04, y: -4 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    onClick={() => handleCardClick(item)}
                    className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] relative rounded-2xl overflow-hidden border border-white/10 hover:border-netflix-red/80 transition-colors duration-300 shadow-xl cursor-pointer group/card bg-zinc-950 flex flex-col justify-between p-3"
                  >
                    {/* Poster Background Image */}
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 180px, 220px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                        <Tv className="w-8 h-8 text-white/20" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-1 w-full">
                      {/* Category Badge (Anime/Série) */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${
                          isAnime
                            ? 'bg-purple-600/90 text-white'
                            : 'bg-blue-600/90 text-white'
                        }`}
                      >
                        {isAnime ? <Sparkles className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
                        {item.category}
                      </span>

                      {/* Update Tag Badge */}
                      <span className="bg-red-600/95 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                        {item.tag}
                      </span>
                    </div>

                    {/* Center Play Button Overlay on Hover */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-netflix-red text-white flex items-center justify-center shadow-2xl shadow-netflix-red/60 transform scale-75 group-hover/card:scale-100 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 space-y-1.5">
                      <h3 className="text-white text-xs md:text-sm font-black uppercase tracking-tight truncate drop-shadow-md">
                        {item.title}
                      </h3>

                      {/* Episode Pill */}
                      <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white/90 border border-white/10 max-w-full">
                        <span className="font-black text-netflix-red">{item.episodeCode}</span>
                        <span className="text-white/40">•</span>
                        <span className="truncate text-white/70 text-[9px]">{item.episodeTitle}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/15 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hover:bg-netflix-red shadow-2xl backdrop-blur-md"
          aria-label="Rolar para a direita"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
