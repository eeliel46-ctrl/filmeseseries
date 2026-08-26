export const dynamic = "force-dynamic"

import { tmdbService } from '@/lib/services/tmdb'
import { DetailsClient } from './details-client'
import { notFound } from 'next/navigation'

interface DetailsPageProps {
  params: { id: string }
  searchParams: { type?: string }
}

export default async function DetailsPage({ params, searchParams }: DetailsPageProps) {
  const id = params.id
  let typeParam = searchParams.type

  // Standardize type
  let type: 'movie' | 'tv' = typeParam === 'series' || typeParam === 'tv' || typeParam === 'anime' ? 'tv' : 'movie'

  let rawContent = null

  // 1. Try to load details based on the explicitly passed or inferred type
  if (typeParam) {
    rawContent = await tmdbService.getDetails(id, type)
  }

  // 2. Fallback: If not found or no type specified, try to resolve type automatically
  if (!rawContent) {
    try {
      // Try movie details
      rawContent = await tmdbService.getDetails(id, 'movie')
      if (rawContent) {
        type = 'movie'
      }
    } catch (e) {
      console.log('Not a movie ID, trying TV show ID...')
    }

    if (!rawContent) {
      try {
        // Try TV details
        rawContent = await tmdbService.getDetails(id, 'tv')
        if (rawContent) {
          type = 'tv'
        }
      } catch (e) {
        console.log('Failed to resolve as movie or TV show.')
      }
    }
  }

  if (!rawContent) {
    notFound()
  }

  // 3. Convert the TMDb raw details format to normalized ContentItem
  const content = tmdbService.convertToContentItem(rawContent, type)

  return <DetailsClient initialContent={content} />
}
