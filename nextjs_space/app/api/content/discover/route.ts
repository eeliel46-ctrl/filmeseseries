
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'movie'
    const page = parseInt(searchParams.get('page') || '1')
    const genreParam = searchParams.get('genre')
    const genreId = genreParam ? parseInt(genreParam) : undefined

    if (type === 'movie') {
      const data = await tmdbService.getDiscoverMovies(page, genreId)
      return NextResponse.json(data)
    } else if (type === 'tv') {
      const data = await tmdbService.getDiscoverTVShows(page, genreId)
      return NextResponse.json(data)
    }

    return NextResponse.json({ results: [], page: 1, total_pages: 1 })
  } catch (error) {
    console.error('Error in discover endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
