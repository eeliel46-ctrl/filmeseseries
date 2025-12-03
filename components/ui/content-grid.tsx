
'use client'

import { ContentItem } from '@/lib/types'
import { ContentCard } from './content-card'
import { Skeleton } from './skeleton'

interface ContentGridProps {
  contents: ContentItem[]
  loading?: boolean
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  onRemoveFromList?: (content: ContentItem) => void
  onViewDetails?: (content: ContentItem) => void
  favoriteIds?: string[]
}

export function ContentGrid({
  contents,
  loading = false,
  onPlay,
  onAddToList,
  onRemoveFromList,
  onViewDetails,
  favoriteIds = []
}: ContentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="aspect-[2/3]">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum conteúdo encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          onPlay={onPlay}
          onAddToList={onAddToList}
          onRemoveFromList={onRemoveFromList}
          onViewDetails={onViewDetails}
          isInList={favoriteIds.includes(content.id)}
        />
      ))}
    </div>
  )
}
