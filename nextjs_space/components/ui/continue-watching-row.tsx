'use client'

import { useRef } from 'react'
import { Play, Plus, Check, ThumbsUp, Info, X, ChevronLeft, ChevronRight, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import { WatchedItem } from '@/hooks/use-continue-watching'
import { ContentItem } from '@/lib/types'

interface ContinueWatchingRowProps {
  items: WatchedItem[]
  onPlay: (content: ContentItem, season?: number, episode?: number) => void
  onViewDetails: (content: ContentItem) => void
  onAddToList: (content: ContentItem) => void
  onRemoveFromList: (content: ContentItem) => void
  onRemoveWatched: (id: string) => void
  favoriteIds: string[]
}

const FALLBACK_BACKDROPS: Record<string, string> = {
  '108978': 'https://image.tmdb.org/t/p/w1280/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg',
  '1368337': 'https://image.tmdb.org/t/p/w1280/RMXG8myu1aGlNUsRjtxzmpdMK0.jpg',
  '95350': 'https://image.tmdb.org/t/p/w1280/mdbWfpbWhvxgG3k5MHpo90UgAUe.jpg',
  '125988': 'https://image.tmdb.org/t/p/w1280/uTWhbLc7Bj4qNSdW3ZvZKL8cOHv.jpg',
}

export function ContinueWatchingRow({
  items,
  onPlay,
  onViewDetails,
  onAddToList,
  onRemoveFromList,
  onRemoveWatched,
  favoriteIds
}: ContinueWatchingRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const { scrollLeft, clientWidth } = rowRef.current
    const scrollAmount = clientWidth * 0.75
    const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount
    rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  const toContentItem = (item: WatchedItem): ContentItem => ({
    id: item.id,
    tmdbId: item.tmdbId,
    title: item.title,
    type: item.type,
    poster: item.poster,
    backdrop: item.backdrop,
    rating: item.rating,
    year: '2026',
    overview: '',
    genres: item.genres
  })

  if (!items || items.length === 0) return null

  return (
    <div className="space-y-4 relative group/row">
      {/* Section Title */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          Continuar Assistindo
        </h2>
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

        {/* Scrollable Cards Track */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
        >
          {items.map((item) => {
            const content = toContentItem(item)
            const isInList = favoriteIds.includes(item.id)
            const fallbackSrc = FALLBACK_BACKDROPS[item.id] || item.backdrop || item.poster || ''

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="flex-none w-64 sm:w-72 md:w-80 bg-zinc-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-netflix-red/60 transition-colors group/card flex flex-col"
              >
                {/* Thumbnail Container */}
                <div 
                  className="relative aspect-video w-full bg-zinc-900 overflow-hidden cursor-pointer"
                  onClick={() => onPlay(content, item.season, item.episode)}
                >
                  <img
                    src={item.backdrop || fallbackSrc}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (fallbackSrc && target.src !== fallbackSrc) {
                        target.src = fallbackSrc
                      }
                    }}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top-Right Duration / Season Episode Pill */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-black text-white/90 border border-white/15">
                    {item.durationStr}
                  </div>

                  {/* Bottom-Left Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-black text-sm uppercase tracking-wider truncate italic drop-shadow-lg">
                      {item.title}
                    </h3>
                  </div>

                  {/* Center Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover/card:bg-netflix-red group-hover/card:border-netflix-red shadow-2xl transition-all scale-90 group-hover/card:scale-100">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Red Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-netflix-red shadow-lg shadow-netflix-red/50 transition-all duration-500"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Below Thumbnail Controls & Metadata */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Play Button */}
                      <button
                        onClick={() => onPlay(content, item.season, item.episode)}
                        className="w-8 h-8 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center transition-all shadow-md active:scale-95"
                        title="Continuar Assistindo"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>

                      {/* Add to List Button */}
                      <button
                        onClick={() => (isInList ? onRemoveFromList(content) : onAddToList(content))}
                        className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
                        title={isInList ? 'Remover da Lista' : 'Adicionar à Minha Lista'}
                      >
                        {isInList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                      </button>

                      {/* Like Button */}
                      <button
                        className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
                        title="Gostei"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Details Info Button */}
                      <button
                        onClick={() => onViewDetails(content)}
                        className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
                        title="Ver Detalhes"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove from Continue Watching Button */}
                    <button
                      onClick={() => onRemoveWatched(item.id)}
                      className="w-7 h-7 rounded-full text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
                      title="Remover da lista de continuar assistindo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata Tag Row */}
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="text-emerald-400 font-bold">{item.matchPercent}% Relevante</span>
                    <span className="px-1.5 py-0.5 border border-white/20 rounded text-white/60 bg-white/5">
                      {item.ageRating}
                    </span>
                    <span className="px-1.5 py-0.5 border border-white/20 rounded text-white/60 bg-white/5">
                      {item.quality}
                    </span>
                  </div>

                  {/* Genres */}
                  {item.genres && item.genres.length > 0 && (
                    <div className="text-[10px] text-white/40 font-bold truncate">
                      {item.genres.join(' • ')}
                    </div>
                  )}
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
