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
    id: 'playerflix',
    name: 'PlayerFlix Ultra',
    icon: '⚡',
    quality: '1080p / 4K',
    tags: ['Autoplay Ativo', 'Sem Anúncios', 'Alta Velocidade'],
    description: 'Servidor principal otimizado para streaming limpo com autoplay imediato.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      const id = imdbId || tmdbId
      return `https://playerflixapi.com/filme/${id}?autoplay=1`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => {
      return `https://playerflixapi.com/serie/${tmdbId}/${season}/${episode}?autoplay=1`
    },
    supportsSandbox: true,
  },
  {
    id: 'superflix',
    name: 'SuperFlix SBS',
    icon: '🇧🇷',
    quality: 'Full HD',
    tags: ['Autoplay Ativo', 'Dublado & Legendado', 'Servidor BR'],
    description: 'Excelente disponibilidade em português com autoplay e seleção de áudio.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      const id = imdbId || tmdbId
      return `https://superflixapi.sbs/filme/${id}#autoplay=true&noLink&color:E50914`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number) => {
      return `https://superflixapi.sbs/serie/${tmdbId}/${season}/${episode}#autoplay=true&noLink&color:E50914`
    },
    supportsSandbox: false,
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed VIP',
    icon: '🚀',
    quality: '1080p HD',
    tags: ['Multi-Stream', 'Alta Estabilidade'],
    description: 'Rede multi-servidores com sincronização instantânea de episódios.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      return `https://multiembed.mov/?video_id=${imdbId || tmdbId}&tmdb=1&autoplay=1`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => {
      return `https://multiembed.mov/?video_id=${imdbId || tmdbId}&tmdb=1&s=${season}&e=${episode}&autoplay=1`
    },
    supportsSandbox: true,
  },
  {
    id: '2embed',
    name: '2Embed HD',
    icon: '🎬',
    quality: 'HD',
    tags: ['Autoplay Ativo', 'Multi-idioma'],
    description: 'Servidor alternativo com ampla cobertura e reprodução automática.',
    getMovieUrl: (tmdbId: string) => {
      return `https://www.2embed.cc/embed/${tmdbId}?autoplay=1`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number) => {
      return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}&autoplay=1`
    },
    supportsSandbox: true,
  },
  {
    id: 'vidsrc',
    name: 'VidSrc Backup',
    icon: '📺',
    quality: 'HD',
    tags: ['Autoplay Ativo', 'Backup Internacional'],
    description: 'Servidor de contingência global com legendas e autoplay.',
    getMovieUrl: (tmdbId: string, imdbId?: string) => {
      if (imdbId) {
        return `https://vidsrcme.ru/embed/movie?imdb=${imdbId}&autoplay=1`
      }
      return `https://vidsrc.to/embed/movie/${tmdbId}?autoplay=1`
    },
    getSeriesUrl: (tmdbId: string, season: number, episode: number, imdbId?: string) => {
      return `https://vidsrcme.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&autoplay=1`
    },
    supportsSandbox: true,
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
