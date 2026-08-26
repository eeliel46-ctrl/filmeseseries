export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const rawType = searchParams.get('type') || 'movie'
    const type: 'movie' | 'tv' = (rawType === 'series' || rawType === 'tv' || rawType === 'anime') ? 'tv' : 'movie'

    if (!tmdbId) {
      return NextResponse.json(
        { error: 'TMDb ID é obrigatório' },
        { status: 400 }
      )
    }

    const imdbId = await tmdbService.getIMDbId(tmdbId, type)

    return NextResponse.json({ imdbId: imdbId || null })

  } catch (error: any) {
    console.error('Error fetching IMDb ID:', error?.message)
    return NextResponse.json(
      { error: 'Erro ao buscar IMDb ID' },
      { status: 500 }
    )
  }
}
