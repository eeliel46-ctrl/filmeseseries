/**
 * Centralized Embed Provider Service
 * Manages all video player embed URLs with automatic fallback and autoplay support.
 */

export interface EmbedProvider {
  id: string
  name: string
  icon: string
  quality: string
  tags: string[]
  description: string
  getMovieUrl: (tmdbId: string, imdbId?: string) => string
  getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => string
  supportsSandbox: boolean
}

export const embedProviders: EmbedProvider[] = [
  {
    id: 'embedplay',
    name: 'EmbedPlay VIP',
    icon: '💎',
    quality: '1080p / 4K',
    tags: ['Autoplay Ativo', 'Anti-Popups', 'Alta Velocidade'],
    description: 'Servidor oficial de alta performance com catálogo completo de animes, séries e filmes.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      const direct = `https://embedplayapi.top/embed/${tmdbId || imdbId}`
      return `/api/player/proxy?url=${encodeURIComponent(direct)}`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => {
      const direct = `https://embedplayapi.top/embed/${tmdbId || imdbId}/${season}/${episode}`
      return `/api/player/proxy?url=${encodeURIComponent(direct)}`
    },
    supportsSandbox: false,
  },
  {
    id: 'playerflix',
    name: 'PlayerFlix Ultra',
    icon: '⚡',
    quality: '1080p / 4K',
    tags: ['Autoplay Ativo', 'Sem Anúncios', 'Servidor BR'],
    description: 'Servidor otimizado para streaming limpo com reprodução veloz.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      const id = imdbId || tmdbId
      return `https://playerflixapi.com/filme/${id}?autoplay=1`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => {
      return `https://playerflixapi.com/serie/${tmdbId}/${season}/${episode}?autoplay=1`
    },
    supportsSandbox: false,
  },
  {
    id: '2embed',
    name: '2Embed / VidSrc HD',
    icon: '🎬',
    quality: 'Full HD',
    tags: ['Anti-Popups', 'Anime • Filmes • Séries', 'Multi-idioma'],
    description: 'Servidor internacional de alta estabilidade com reprodução direta sem bloqueios de sandbox.',
    getMovieUrl: (tmdbId: string) => {
      return `https://vidsrc.buzz/embed/movie/${tmdbId}`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number) => {
      return `https://vidsrc.buzz/embed/tv/${tmdbId}/${season}/${episode}`
    },
    supportsSandbox: false,
  },
  {
    id: 'vidlink',
    name: 'VidLink Pro',
    icon: '🚀',
    quality: '1080p HD',
    tags: ['Multi-Stream', 'Alta Estabilidade', 'Anime'],
    description: 'Servidor moderno com CDN rápida e suporte a player alternativo.',
    getMovieUrl: (tmdbId: string) => {
      return `https://vidlink.pro/movie/${tmdbId}`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number) => {
      return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    },
    supportsSandbox: false,
  },
  {
    id: 'vidsrc',
    name: 'VidSrc Direct',
    icon: '🌐',
    quality: 'Full HD',
    tags: ['Internacional', 'Multi-Legendas'],
    description: 'Servidor alternativo global para filmes e séries.',
    getMovieUrl: (tmdbId: string) => {
      return `https://vidsrc.to/embed/movie/${tmdbId}`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number) => {
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
    },
    supportsSandbox: false,
  },
]

/**
 * Get a provider by ID
 */
export function getProvider(id: string): EmbedProvider | undefined {
  return embedProviders.find(p => p.id === id)
}

/**
 * Get the next fallback provider
 */
export function getNextProvider(currentId: string): EmbedProvider | undefined {
  const currentIndex = embedProviders.findIndex(p => p.id === currentId)
  if (currentIndex === -1 || currentIndex >= embedProviders.length - 1) {
    return embedProviders[0]
  }
  return embedProviders[currentIndex + 1]
}

/**
 * Generate player URL for a movie
 */
export function getMoviePlayerUrl(
  providerId: string,
  tmdbId: string,
  imdbId?: string
): string {
  const provider = getProvider(providerId) || embedProviders[0]
  return provider.getMovieUrl(tmdbId, imdbId)
}

/**
 * Generate player URL for a series episode
 */
export function getSeriesPlayerUrl(
  providerId: string,
  tmdbId: string,
  season: number,
  episode: number,
  imdbId?: string
): string {
  const provider = getProvider(providerId) || embedProviders[0]
  return provider.getSeriesUrl(tmdbId, season, episode, imdbId)
}
