
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Plus, Check, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const sizeClasses = {
    small: 'aspect-[2/3] w-32 sm:w-40',
    medium: 'aspect-[2/3] w-40 sm:w-48 md:w-52',
    large: 'aspect-[2/3] w-48 sm:w-56 md:w-64',
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

  const handleViewDetails = () => {
    onViewDetails?.(content)
  }

  return (
    <motion.div
      className={`relative group cursor-pointer ${sizeClasses[size]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Poster Image */}
      <div className="relative w-full h-full bg-gray-800 rounded-md overflow-hidden">
        {content.poster ? (
          <Image
            src={content.poster}
            alt={content.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 208px, 256px"
            onLoad={() => setImageLoading(false)}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}

        {/* Loading skeleton */}
        {imageLoading && content.poster && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}

        {/* Content type badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-black/70 text-white text-xs"
        >
          {content.type === 'series' ? 'Série' : content.type === 'anime' ? 'Anime' : 'Filme'}
        </Badge>

        {/* Rating badge */}
        {content.rating && (
          <Badge 
            variant="outline" 
            className="absolute top-2 right-2 bg-black/70 text-yellow-400 border-yellow-400 text-xs"
          >
            ★ {content.rating}
          </Badge>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
        >
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handlePlay}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={handleToggleList}
            >
              {isInList ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails()
              }}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Content info */}
      <div className="mt-2 px-1">
        <h3 className="text-white text-sm font-medium truncate" title={content.title}>
          {content.title}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
          {content.year && <span>{content.year}</span>}
          {content.runtime && (
            <>
              <span>•</span>
              <span>{content.runtime}min</span>
            </>
          )}
          {content.seasons && (
            <>
              <span>•</span>
              <span>{content.seasons} temp.</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
