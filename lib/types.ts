
// Content Types
export interface ContentItem {
  id: string
  title: string
  type: 'movie' | 'series' | 'anime'
  poster?: string
  backdrop?: string
  year?: string
  rating?: string
  overview?: string
  genres?: string[]
  runtime?: number
  seasons?: number
  episodes?: number
  cast?: string[]
  director?: string
  imdbId?: string
  tmdbId?: string
}

export interface SuperflixContent {
  id: string
  title: string
  year?: string
  rating?: string
  poster?: string
  type: 'movie' | 'series' | 'anime'
}

export interface TMDbMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  runtime?: number
  genres?: { id: number; name: string }[]
}

export interface TMDbTVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  number_of_seasons?: number
  number_of_episodes?: number
  genres?: { id: number; name: string }[]
}

export interface Favorite {
  id: string
  userId: string
  contentId: string
  contentType: string
  title: string
  poster?: string
  year?: string
  rating?: string
  addedAt: Date
}

// User Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  image?: string
}

// NextAuth Session User Extension
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      firstName?: string
      lastName?: string
    }
  }

  interface User {
    id: string
    firstName?: string
    lastName?: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ContentResponse {
  results: ContentItem[]
  page: number
  total_pages: number
  total_results: number
}

// Component Props
export interface ContentCardProps {
  content: ContentItem
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  className?: string
}

export interface ContentRowProps {
  title: string
  contents: ContentItem[]
  loading?: boolean
  onViewMore?: () => void
}

export interface HeroBannerProps {
  content: ContentItem
  onPlay: (content: ContentItem) => void
  onAddToList: (content: ContentItem) => void
}
