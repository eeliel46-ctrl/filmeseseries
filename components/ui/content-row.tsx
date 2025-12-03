
'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { ContentCard } from './content-card'
import { Button } from './button'

interface ContentRowProps {
  title: string
  contents: ContentItem[]
  loading?: boolean
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  onRemoveFromList?: (content: ContentItem) => void
  onViewDetails?: (content: ContentItem) => void
  onViewMore?: () => void
  favoriteIds?: string[]
}

export function ContentRow({
  title,
  contents,
  loading = false,
  onPlay,
  onAddToList,
  onRemoveFromList,
  onViewDetails,
  onViewMore,
  favoriteIds = []
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const scrollAmount = 400
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="flex space-x-4 pb-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <div className="aspect-[2/3] w-48 bg-gray-700 animate-pulse rounded-md" />
          <div className="mt-2 space-y-1">
            <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-gray-700 animate-pulse rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded" />
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (!contents || contents.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
        {onViewMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewMore}
            className="text-gray-400 hover:text-white"
          >
            Ver mais
            <MoreHorizontal className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="relative group">
        {/* Scroll Buttons */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-4 z-10 flex items-center"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('left')}
                className="h-full bg-black/50 hover:bg-black/70 text-white rounded-r-none rounded-l-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </motion.div>
          )}

          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-4 z-10 flex items-center"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('right')}
                className="h-full bg-black/50 hover:bg-black/70 text-white rounded-l-none rounded-r-md"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {contents.map((content, index) => (
            <div key={`${content.id}-${index}`} className="flex-shrink-0">
              <ContentCard
                content={content}
                onPlay={onPlay}
                onAddToList={onAddToList}
                onRemoveFromList={onRemoveFromList}
                onViewDetails={onViewDetails}
                isInList={favoriteIds.includes(content.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
