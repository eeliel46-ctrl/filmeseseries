import axios from 'axios'
import { TMDbMovie, TMDbTVShow, ContentItem } from '../types'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const DIONEYFLIX_BASE_URL = 'https://dioneyflix.notiffly.com.br/api'
const DEFAULT_TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'

class TMDbService {
  private apiKey: string
  private baseURL = TMDB_BASE_URL
  private imageBaseURL = TMDB_IMAGE_BASE_URL

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || DEFAULT_TMDB_API_KEY
  }

  private isKeyValid(): boolean {
    return this.apiKey !== '' && !this.apiKey.includes('your_tmdb_api_key_here')
  }

  // Get trending content
  async getTrending(type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'week') {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/trending/${type}/${timeWindow}`, {
          params: { 
            api_key: this.apiKey,
            language: 'pt-BR'
          }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching trending content from TMDb:', error)
        return []
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/trending/${type === 'tv' ? 'tv' : 'movie'}/week`)
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching trending content from Dioneyflix:', error)
        return []
      }
    }
  }

  // Get popular content
  async getPopular(type: 'movie' | 'tv' = 'movie') {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/${type}/popular`, {
          params: { 
            api_key: this.apiKey,
            language: 'pt-BR'
          }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching popular content from TMDb:', error)
        return []
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/${type === 'tv' ? 'tv' : 'movies'}/popular`)
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching popular content from Dioneyflix:', error)
        return []
      }
    }
  }

  // Search content
  async search(query: string, type?: 'movie' | 'tv') {
    if (this.isKeyValid()) {
      try {
        const endpoint = type ? `search/${type}` : 'search/multi'
        const response = await axios.get(`${this.baseURL}/${endpoint}`, {
          params: { 
            api_key: this.apiKey,
            language: 'pt-BR',
            query 
          }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error searching content from TMDb:', error)
        return []
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/search`, {
          params: { q: query }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error searching content from Dioneyflix:', error)
        return []
      }
    }
  }

  // Get content details
  async getDetails(id: string, type: 'movie' | 'tv') {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/${type}/${id}`, {
          params: { 
            api_key: this.apiKey,
            language: 'pt-BR',
            append_to_response: 'credits,videos,external_ids'
          }
        })
        return response.data
      } catch (error) {
        console.error('Error fetching content details from TMDb:', error)
        return null
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/${type === 'tv' ? 'tv' : 'movie'}/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching content details from Dioneyflix:', error)
        return null
      }
    }
  }

  // Get IMDb ID for content
  async getIMDbId(tmdbId: string, type: 'movie' | 'tv'): Promise<string | null> {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/${type}/${tmdbId}/external_ids`, {
          params: { api_key: this.apiKey }
        })
        return response.data.imdb_id || null
      } catch (error) {
        console.error('Error fetching IMDb ID from TMDb:', error)
        return null
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/${type === 'tv' ? 'tv' : 'movie'}/${tmdbId}`)
        return response.data.imdbId || response.data.imdb_id || null
      } catch (error) {
        console.error('Error fetching IMDb ID from Dioneyflix:', error)
        return null
      }
    }
  }

  // Get content by genre
  async getByGenre(genreId: number, type: 'movie' | 'tv' = 'movie') {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/discover/${type}`, {
          params: { 
            api_key: this.apiKey,
            language: 'pt-BR',
            sort_by: 'popularity.desc',
            with_genres: genreId
          }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching content by genre from TMDb:', error)
        return []
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/discover/${type === 'tv' ? 'tv' : 'movies'}`, {
          params: { page: 1 }
        })
        return response.data.results || []
      } catch (error) {
        console.error('Error fetching content by genre from Dioneyflix:', error)
        return []
      }
    }
  }

  // Convert data to our ContentItem format
  convertToContentItem(item: any, type: 'movie' | 'tv'): ContentItem {
    const isMovie = type === 'movie' || item.type === 'movie' || 'title' in item
    const title = isMovie ? (item.title || item.name) : (item.name || item.title)
    
    // Resolve poster
    let poster = item.poster_path || item.poster
    if (poster && !poster.startsWith('http')) {
      poster = `${this.imageBaseURL}/w500${poster}`
    }

    // Resolve backdrop
    let backdrop = item.backdrop_path || item.backdrop
    if (backdrop && !backdrop.startsWith('http')) {
      backdrop = `${this.imageBaseURL}/original${backdrop}`
    }

    // Resolve year
    let year = item.year ? item.year.toString() : undefined
    if (!year) {
      const releaseDate = item.release_date || item.first_air_date
      year = releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined
    }

    // Resolve rating
    let rating = item.vote_average ? item.vote_average.toFixed(1) : undefined
    if (!rating && item.rating) {
      rating = typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating.toString()
    }

    // Resolve overview
    const overview = item.overview || item.description || ''

    // Resolve id & tmdbId
    const tmdbId = (item.tmdbId || item.id || '').toString()

    return {
      id: tmdbId,
      title: title || '',
      type: type === 'tv' || item.type === 'series' || item.type === 'tv' ? 'series' : 'movie',
      poster: poster || undefined,
      backdrop: backdrop || undefined,
      year,
      rating,
      overview,
      tmdbId,
      runtime: isMovie ? (item.runtime || item.duration) : undefined,
      seasons: !isMovie ? (item.number_of_seasons || item.seasons) : undefined,
      episodes: !isMovie ? (item.number_of_episodes || item.episodes) : undefined,
    }
  }

  // Get image URL
  getImageUrl(path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (path && path.startsWith('http')) {
      return path
    }
    return `${this.imageBaseURL}/${size}${path}`
  }

  // Discover movies with pagination
  async getDiscoverMovies(page: number = 1, genreId?: number) {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            language: 'pt-BR',
            sort_by: 'popularity.desc',
            page,
            include_adult: false,
            include_video: false,
            ...(genreId ? { with_genres: genreId } : {})
          }
        })

        const results = response.data.results || []
        const transformedResults = results.map((item: TMDbMovie) => 
          this.convertToContentItem(item, 'movie')
        )

        return {
          results: transformedResults,
          page: response.data.page,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results
        }
      } catch (error) {
        console.error('Error discovering movies from TMDb:', error)
        return { results: [], page: 1, total_pages: 1, total_results: 0 }
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/discover/movies`, {
          params: { page }
        })

        const results = response.data.results || []
        const transformedResults = results.map((item: any) => 
          this.convertToContentItem(item, 'movie')
        )

        return {
          results: transformedResults,
          page: response.data.page || page,
          total_pages: response.data.totalPages || 500,
          total_results: response.data.totalResults || 10000
        }
      } catch (error) {
        console.error('Error discovering movies from Dioneyflix:', error)
        return { results: [], page: 1, total_pages: 1, total_results: 0 }
      }
    }
  }

  // Discover TV shows with pagination
  async getDiscoverTVShows(page: number = 1, genreId?: number) {
    if (this.isKeyValid()) {
      try {
        const response = await axios.get(`${this.baseURL}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            language: 'pt-BR',
            sort_by: 'popularity.desc',
            page,
            include_adult: false,
            ...(genreId ? { with_genres: genreId } : {})
          }
        })

        const results = response.data.results || []
        const transformedResults = results.map((item: TMDbTVShow) => 
          this.convertToContentItem(item, 'tv')
        )

        return {
          results: transformedResults,
          page: response.data.page,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results
        }
      } catch (error) {
        console.error('Error discovering TV shows from TMDb:', error)
        return { results: [], page: 1, total_pages: 1, total_results: 0 }
      }
    } else {
      try {
        const response = await axios.get(`${DIONEYFLIX_BASE_URL}/media/discover/tv`, {
          params: { page }
        })

        const results = response.data.results || []
        const transformedResults = results.map((item: any) => 
          this.convertToContentItem(item, 'tv')
        )

        return {
          results: transformedResults,
          page: response.data.page || page,
          total_pages: response.data.totalPages || 500,
          total_results: response.data.totalResults || 10000
        }
      } catch (error) {
        console.error('Error discovering TV shows from Dioneyflix:', error)
        return { results: [], page: 1, total_pages: 1, total_results: 0 }
      }
    }
  }
}

export const tmdbService = new TMDbService()
