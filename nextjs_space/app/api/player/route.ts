import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export const dynamic = "force-dynamic"

/**
 * Player API Route
 * Returns IMDB ID for a given TMDB ID to help embed providers
 * that require IMDB IDs (like SuperFlix for movies).
 * 
 * Query params:
 *   tmdbId - TMDB ID of the content
 *   type - 'movie' or 'tv'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const type = searchParams.get('type') as 'movie' | 'tv'

    if (!tmdbId || !type) {
      return NextResponse.json(
        { error: 'Parâmetros tmdbId e type são obrigatórios' },
        { status: 400 }
      )
    }

    // Fetch IMDB ID from TMDb/DioneyFlix
    const imdbId = await tmdbService.getIMDbId(tmdbId, type === 'tv' ? 'tv' : 'movie')

    // Also try to get content details for more metadata
    let details = null
    try {
      details = await tmdbService.getDetails(tmdbId, type === 'tv' ? 'tv' : 'movie')
    } catch {
      // Non-critical, continue without details
    }

    return NextResponse.json({
      tmdbId,
      imdbId: imdbId || null,
      title: details?.title || details?.name || null,
      type,
    })
  } catch (error: any) {
    console.error('Error in player API:', error?.message || error)
    return NextResponse.json(
      { error: 'Erro ao buscar informações do player', tmdbId: null, imdbId: null },
      { status: 500 }
    )
  }
}
