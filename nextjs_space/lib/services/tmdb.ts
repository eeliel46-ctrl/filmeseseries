
import axios from 'axios'
import { TMDbMovie, TMDbTVShow, ContentItem } from '../types'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

class TMDbService {
  private apiKey: string
  private baseURL = TMDB_BASE_URL
  private imageBaseURL = TMDB_IMAGE_BASE_URL

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
  }

  // Get trending content
  async getTrending(type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'week') {
    try {
      const response = await axios.get(`${this.baseURL}/trending/${type}/${timeWindow}`, {
        params: { api_key: this.apiKey }
      })
      return response.data.results || []
    } catch (error) {
      console.error('Error fetching trending content:', error)
      return []
    }
  }

  // Get popular content
  async getPopular(type: 'movie' | 'tv' = 'movie') {
    try {
      const response = await axios.get(`${this.baseURL}/${type}/popular`, {
        params: { api_key: this.apiKey }
      })
      return response.data.results || []
    } catch (error) {
      console.error('Error fetching popular content:', error)
      return []
    }
  }

  // Search content
  async search(query: string, type?: 'movie' | 'tv') {
    try {
      const endpoint = type ? `search/${type}` : 'search/multi'
      const response = await axios.get(`${this.baseURL}/${endpoint}`, {
        params: { 
          api_key: this.apiKey,
          query 
        }
      })
      return response.data.results || []
    } catch (error) {
      console.error('Error searching content:', error)
      return []
    }
  }

  // Get content details
  async getDetails(id: string, type: 'movie' | 'tv') {
    try {
      const response = await axios.get(`${this.baseURL}/${type}/${id}`, {
        params: { 
          api_key: this.apiKey,
          append_to_response: 'credits,videos,external_ids'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching content details:', error)
      return null
    }
  }

  // Get IMDb ID for content
  async getIMDbId(tmdbId: string, type: 'movie' | 'tv'): Promise<string | null> {
    try {
      const response = await axios.get(`${this.baseURL}/${type}/${tmdbId}/external_ids`, {
        params: { api_key: this.apiKey }
      })
      return response.data.imdb_id || null
    } catch (error) {
      console.error('Error fetching IMDb ID:', error)
      return null
    }
  }

  // Get content by genre
  async getByGenre(genreId: number, type: 'movie' | 'tv' = 'movie') {
    try {
      const response = await axios.get(`${this.baseURL}/discover/${type}`, {
        params: { 
          api_key: this.apiKey,
          with_genres: genreId
        }
      })
      return response.data.results || []
    } catch (error) {
      console.error('Error fetching content by genre:', error)
      return []
    }
  }

  // Convert TMDb data to our ContentItem format
  convertToContentItem(item: TMDbMovie | TMDbTVShow, type: 'movie' | 'tv'): ContentItem {
    const isMovie = type === 'movie' || 'title' in item
    const title = isMovie ? (item as TMDbMovie).title : (item as TMDbTVShow).name
    const releaseDate = isMovie ? (item as TMDbMovie).release_date : (item as TMDbTVShow).first_air_date
    
    return {
      id: item.id.toString(),
      title,
      type: type === 'tv' ? 'series' : 'movie',
      poster: item.poster_path ? `${this.imageBaseURL}/w500${item.poster_path}` : undefined,
      backdrop: item.backdrop_path ? `${this.imageBaseURL}/original${item.backdrop_path}` : undefined,
      year: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
      rating: item.vote_average ? item.vote_average.toFixed(1) : undefined,
      overview: item.overview,
      tmdbId: item.id.toString(),
      runtime: isMovie ? (item as TMDbMovie).runtime : undefined,
      seasons: !isMovie ? (item as TMDbTVShow).number_of_seasons : undefined,
      episodes: !isMovie ? (item as TMDbTVShow).number_of_episodes : undefined,
    }
  }

  // Get image URL
  getImageUrl(path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    return `${this.imageBaseURL}/${size}${path}`
  }

  // Discover movies with pagination
  async getDiscoverMovies(page: number = 1, genreId?: number) {
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
      console.error('Error discovering movies:', error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }
  }

  // Discover TV shows with pagination
  async getDiscoverTVShows(page: number = 1, genreId?: number) {
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
      console.error('Error discovering TV shows:', error)
      return { results: [], page: 1, total_pages: 1, total_results: 0 }
    }
  }
}

export const tmdbService = new TMDbService()
