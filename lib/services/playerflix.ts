

const PLAYERFLIX_BASE_URL = 'https://playerflixapi.com'

class PlayerFlixService {
  private baseURL = PLAYERFLIX_BASE_URL

  /**
   * Generate player embed URL for movies using IMDB ID
   * @param imdbId - IMDB ID of the movie (e.g., "tt0111161")
   * @returns Full URL for iframe src
   */
  getMoviePlayerUrl(imdbId: string): string {
    return `${this.baseURL}/filme/${imdbId}`
  }

  /**
   * Generate player embed URL for series using TMDB ID
   * @param tmdbId - TMDB ID of the series
   * @param season - Season number
   * @param episode - Episode number
   * @returns Full URL for iframe src
   */
  getSeriesPlayerUrl(tmdbId: string | number, season: number, episode: number): string {
    return `${this.baseURL}/serie/${tmdbId}/${season}/${episode}`
  }

  /**
   * Universal method to get player URL based on content type
   * @param id - Either IMDB ID (for movies) or TMDB ID (for series)
   * @param type - Content type ('movie' or 'series')
   * @param season - Season number (for series only)
   * @param episode - Episode number (for series only)
   * @returns Full URL for iframe src
   */
  getPlayerUrl(
    id: string | number,
    type: 'movie' | 'series',
    season?: number,
    episode?: number
  ): string {
    if (type === 'movie') {
      return this.getMoviePlayerUrl(String(id))
    } else {
      if (!season || !episode) {
        throw new Error('Season and episode are required for series')
      }
      return this.getSeriesPlayerUrl(id, season, episode)
    }
  }
}

export const playerFlixService = new PlayerFlixService()
