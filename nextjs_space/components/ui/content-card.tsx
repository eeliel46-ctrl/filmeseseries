'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Plus, Check, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUISound } from '@/lib/hooks/use-ui-sound'

interface ContentCardProps {
  content: ContentItem
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  onRemoveFromList?: (content: ContentItem) => void
  isInList?: boolean
  onViewDetails?: (content: ContentItem) => void
  size?: 'small' | 'medium' | 'large'
}

export function ContentCard({ 
  content, 
  onPlay, 
  onAddToList, 
  onRemoveFromList, 
  isInList = false,
  onViewDetails,
  size = 'medium' 
}: ContentCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const { playHoverSound } = useUISound()

  const sizeClasses = {
    small: 'w-32 sm:w-40',
    medium: 'w-48 md:w-60',
    large: 'w-64 md:w-72',
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPlay?.(content)
  }

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList) {
      onRemoveFromList?.(content)
    } else {
      onAddToList?.(content)
    }
  }

  return (
    <motion.div
      className={`group relative flex-none ${sizeClasses[size]} snap-start cursor-pointer overflow-hidden rounded-lg transition-all duration-500`}
      onClick={() => onViewDetails?.(content)}
      onMouseEnter={playHoverSound}
      whileHover={{ scale: 1.05 }}
    >
      {/* Poster Media Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-500">
        {content.poster ? (
          <Image
            src={content.poster}
            alt={content.title}
            fill
            className={`object-cover transition-all duration-1000 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 200px, 300px"
            onLoad={() => setImageLoading(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">No Media</span>
          </div>
        )}

        {/* Shimmer Placeholder */}
        {imageLoading && content.poster && (
          <div className="absolute inset-0 bg-zinc-800 animate-shimmer" />
        )}

        {/* Interactive Glass Overlay Panel */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="glass m-3 p-4 rounded-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-black text-[11px] uppercase tracking-tight truncate flex-1 pr-2 text-white">
                {content.title}
              </h4>
              <div className="flex items-center gap-1 text-[9px] text-yellow-400 font-black">
                ★ {content.rating || '8.5'}
              </div>
            </div>

            <p className="text-[9px] text-white/50 line-clamp-2 mb-4 leading-relaxed font-bold italic">
              {content.overview || 'Exploração visual cinematográfica exclusiva do ecossistema Reversa.'}
            </p>

            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-white text-black hover:bg-zinc-200 h-8 px-4 font-black text-[10px] rounded-sm transition-all active:scale-95 flex items-center justify-center"
                onClick={handlePlay}
              >
                <Play className="w-3 h-3 mr-1.5 fill-current" />
                PLAY
              </button>
              
              <button
                className="w-8 h-8 border border-white/20 text-white hover:bg-white/10 rounded-sm transition-all active:scale-95 flex items-center justify-center"
                onClick={handleToggleList}
              >
                {isInList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>

              <button
                className="w-8 h-8 border border-white/20 text-white hover:bg-white/10 rounded-sm transition-all active:scale-95 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(content);
                }}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fallback Static Info (Fades out on hover) */}
      <div className="mt-3 px-1 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-white text-[11px] font-black uppercase tracking-wider truncate">
          {content.title}
        </h3>
        <div className="flex items-center gap-2 text-[9px] text-white/30 mt-1 font-bold uppercase tracking-tighter">
          <span>{content.year}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-netflix-red">{content.type}</span>
        </div>
      </div>
    </motion.div>
  )
}
