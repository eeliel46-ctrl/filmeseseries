import { ContentItem } from '../types'
import { embedProviders, EmbedProvider, getMoviePlayerUrl, getSeriesPlayerUrl, getProvider } from './embed-providers'

export interface StreamResolutionResult {
  provider: EmbedProvider
  url: string
  imdbId: string | null
  tmdbId: string
  quality: string
  latencyMs: number
}

export class SmartPlayerEngine {
  /**
   * Resolves the IMDb ID for a given TMDB movie/series ID
   */
  static async resolveImdbId(tmdbId: string, type: 'movie' | 'series' | 'tv' | 'anime' = 'movie'): Promise<string | null> {
    try {
      const response = await fetch(`/api/content/imdb?tmdbId=${tmdbId}&type=${type}`)
      if (!response.ok) return null
      const data = await response.json()
      return data.imdbId || null
    } catch (error) {
      console.warn('[SmartPlayerEngine] Could not fetch IMDb ID:', error)
      return null
    }
  }

  /**
   * Intelligently resolves the best player stream URL for a given content
   */
  static async resolveBestStream(
    content: ContentItem,
    preferredProviderId?: string,
    season: number = 1,
    episode: number = 1
  ): Promise<StreamResolutionResult> {
    const startTime = Date.now()
    const tmdbId = content.tmdbId || content.id
    const isMovie = content.type === 'movie'

    // 1. Resolve IMDb ID if not present
    let resolvedImdbId = content.imdbId || null
    if (!resolvedImdbId && tmdbId) {
      resolvedImdbId = await this.resolveImdbId(tmdbId, isMovie ? 'movie' : 'series')
    }

    // 2. Select Provider
    let targetProvider = preferredProviderId ? getProvider(preferredProviderId) : undefined
    if (!targetProvider) {
      targetProvider = embedProviders[0]
    }

    // 3. Generate URL
    let url = ''
    if (isMovie) {
      url = getMoviePlayerUrl(targetProvider.id, tmdbId, resolvedImdbId || undefined)
    } else {
      url = getSeriesPlayerUrl(targetProvider.id, tmdbId, season, episode, resolvedImdbId || undefined)
    }

    const latencyMs = Date.now() - startTime

    return {
      provider: targetProvider,
      url,
      imdbId: resolvedImdbId,
      tmdbId,
      quality: targetProvider.quality,
      latencyMs,
    }
  }
}
