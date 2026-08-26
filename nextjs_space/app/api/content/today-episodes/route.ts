export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const DEFAULT_TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || DEFAULT_TMDB_API_KEY

    // Fetch on the air and anime releases
    const [onAirRes, animeRes] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
        params: { api_key: apiKey, language: 'pt-BR', page: 1 }
      }).catch(() => ({ data: { results: [] } })),
      axios.get(`${TMDB_BASE_URL}/discover/tv`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
          with_genres: '16',
          sort_by: 'popularity.desc',
          page: 1
        }
      }).catch(() => ({ data: { results: [] } }))
    ])

    const onAirShows = onAirRes.data?.results || []
    const animeShows = animeRes.data?.results || []

    // Combine and alternate for a rich variety
    const combined: any[] = []
    const maxLength = Math.max(onAirShows.length, animeShows.length)
    
    for (let i = 0; i < maxLength; i++) {
      if (onAirShows[i]) combined.push(onAirShows[i])
      if (animeShows[i]) combined.push(animeShows[i])
    }

    const releases = combined.slice(0, 20).map((tv, idx) => {
      const isAnime = tv.genre_ids && tv.genre_ids.includes(16)
      const seasonNum = (idx % 3) + 1
      const episodeNum = (idx % 8) + 1
      const isUpdated = idx % 2 === 0

      return {
        id: tv.id.toString(),
        tmdbId: tv.id.toString(),
        title: tv.name,
        type: isAnime ? 'anime' : 'series',
        category: isAnime ? 'Anime' : 'Série',
        tag: isUpdated ? '★ Atualizado' : '★ Hoje',
        poster: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null,
        backdrop: tv.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}` : null,
        season: seasonNum,
        episode: episodeNum,
        episodeCode: `T${seasonNum} E${episodeNum}`,
        episodeTitle: `Episódio ${episodeNum}`,
        rating: tv.vote_average ? tv.vote_average.toFixed(1) : '8.5',
        year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear().toString() : '2026',
        overview: tv.overview || 'Novo episódio já disponível para streaming em alta definição.'
      }
    })

    return NextResponse.json({
      title: 'Lançamentos de Hoje',
      subtitle: `${releases.length} títulos novos`,
      releases
    })
  } catch (error: any) {
    console.error('[Today Episodes API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao obter lançamentos' },
      { status: 500 }
    )
  }
}
