export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'
import axios from 'axios'

const DIONEYFLIX_BASE_URL = 'https://dioneyflix.notiffly.com.br/api'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const season = searchParams.get('season')

    if (!tmdbId) {
      return NextResponse.json(
        { error: 'TMDb ID é obrigatório' },
        { status: 400 }
      )
    }

    const DEFAULT_TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'
    const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || DEFAULT_TMDB_API_KEY
    const isKeyValid = apiKey !== '' && !apiKey.includes('your_tmdb_api_key_here')

    // If season is provided, fetch episodes for that season
    if (season) {
      const seasonNumber = parseInt(season)
      if (isKeyValid) {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}`, {
          params: {
            api_key: apiKey,
            language: 'pt-BR'
          }
        })
        return NextResponse.json(response.data)
      } else {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/tv/${tmdbId}/season/${seasonNumber}`)
        return NextResponse.json(response.data)
      }
    } else {
      // Fetch tv show details (which contains seasons info)
      const data = await tmdbService.getDetails(tmdbId, 'tv')
      return NextResponse.json(data)
    }

  } catch (error: any) {
    console.error('Error in TV API route:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
