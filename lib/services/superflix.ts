
import axios from 'axios'

const SUPERFLIX_BASE_URL = 'https://superflixapi.asia'

export interface SuperflixListParams {
  category: 'movie' | 'serie' | 'anime'
  type?: 'tmdb' | 'imdb'
  format?: 'json' | 'html'
  order?: 'asc' | 'desc'
}

export interface CalendarItem {
  title: string
  episode_title: string
  episode_number: number
  air_date: string
  poster_path: string
  backdrop_path: string
  season_number: number
  tmdb_id: string
  imdb_id: string
  status: 'Atualizado' | 'Hoje' | 'Futuro' | 'Atrasado'
}

export interface PlayerOptions {
  noEpList?: boolean
  color?: string
  noLink?: boolean
  transparent?: boolean
  noBackground?: boolean
}

class SuperflixService {
  private baseURL = SUPERFLIX_BASE_URL

  /**
   * Get content list by category
   * Endpoint: /lista
   */
  async getContentList(params: SuperflixListParams): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseURL}/lista`, {
        params: {
          category: params.category,
          type: params.type || 'tmdb',
          format: params.format || 'json',
          order: params.order || 'asc'
        }
      })
      return response.data || []
    } catch (error) {
      console.error('Error fetching content list:', error)
      return []
    }
  }

  /**
   * Get calendar data with upcoming and recent releases
   * Endpoint: /calendario.php
   */
  async getCalendarData(): Promise<CalendarItem[]> {
    try {
      const response = await axios.get(`${this.baseURL}/calendario.php`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching calendar data:', error)
      return []
    }
  }

  /**
   * Generate player embed URL for movies
   * Format: /filme/ttIMDB_ID
   */
  getMoviePlayerUrl(imdbId: string, options?: PlayerOptions): string {
    let url = `${this.baseURL}/filme/${imdbId}`
    url += this.buildPlayerOptions(options)
    return url
  }

  /**
   * Generate player embed URL for series
   * Format: /serie/TMDB_ID/SEASON/EPISODE
   */
  getSeriesPlayerUrl(
    tmdbId: string,
    season?: number,
    episode?: number,
    options?: PlayerOptions
  ): string {
    let url = `${this.baseURL}/serie/${tmdbId}`
    
    if (season) {
      url += `/${season}`
      if (episode) {
        url += `/${episode}`
      }
    }
    
    url += this.buildPlayerOptions(options)
    return url
  }

  /**
   * Build player customization parameters
   */
  private buildPlayerOptions(options?: PlayerOptions): string {
    if (!options) {
      // Default options for Netflix-like experience
      return '#noLink&color:E50914'
    }

    const params: string[] = []
    
    if (options.noEpList) params.push('noEpList')
    if (options.color) params.push(`color:${options.color.replace('#', '')}`)
    if (options.noLink) params.push('noLink')
    if (options.transparent) params.push('transparent')
    if (options.noBackground) params.push('noBackground')
    
    return params.length > 0 ? '#' + params.join('&') : ''
  }

  /**
   * Get player iframe HTML for embedding
   */
  getPlayerIframe(
    id: string,
    type: 'movie' | 'series',
    season?: number,
    episode?: number,
    options?: PlayerOptions
  ): string {
    const playerUrl = type === 'movie' 
      ? this.getMoviePlayerUrl(id, options)
      : this.getSeriesPlayerUrl(id, season, episode, options)
    
    return `<iframe src="${playerUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`
  }

  /**
   * Generate Streamtape player URL with custom options
   */
  getStreamtapePlayerUrl(videoId: string, options?: {
    sub?: string
    lang?: string
    logo?: string
    logo_link?: string
    vast?: string
    image?: string
  }): string {
    let url = `${this.baseURL}/stape/${videoId}`
    
    if (options) {
      const params = new URLSearchParams()
      
      if (options.sub) params.append('sub', options.sub)
      if (options.lang) params.append('lang', options.lang)
      if (options.logo) params.append('logo', options.logo)
      if (options.logo_link) params.append('logo_link', options.logo_link)
      if (options.vast) params.append('vast', options.vast)
      if (options.image) params.append('image', options.image)
      
      const paramString = params.toString()
      if (paramString) {
        url += `?${paramString}`
      }
    }
    
    return url
  }
}

export const superflixService = new SuperflixService()
