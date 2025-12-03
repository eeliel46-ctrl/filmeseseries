
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const type = searchParams.get('type') as 'movie' | 'tv'

    if (!tmdbId || !type) {
      return NextResponse.json(
        { error: 'TMDb ID e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    const imdbId = await tmdbService.getIMDbId(tmdbId, type)

    return NextResponse.json({ imdbId })

  } catch (error) {
    console.error('Error fetching IMDb ID:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar IMDb ID' },
      { status: 500 }
    )
  }
}
