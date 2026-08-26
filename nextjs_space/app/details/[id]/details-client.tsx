'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Play, Plus, Check, Star, Volume2, VolumeX, Tv, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContentRow } from '@/components/ui/content-row'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import { ContentItem } from '@/lib/types'
import { useContent } from '@/hooks/use-content'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface DetailsClientProps {
  initialContent: ContentItem
}

interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path?: string
  air_date?: string
}

interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date?: string
}

function getEpisodeReleaseInfo(airDate?: string) {
  if (!airDate) {
    return {
      isReleased: true,
      label: 'Disponível',
      formattedDate: '',
      formattedTime: '21:00h',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }

  const releaseDateTime = new Date(`${airDate}T21:00:00-03:00`)
  const now = new Date()
  const isReleased = now >= releaseDateTime

  const dateObj = new Date(`${airDate}T00:00:00`)
  const dayMonth = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
  const fullDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const isToday = now.toISOString().split('T')[0] === airDate

  if (!isReleased) {
    return {
      isReleased: false,
      isToday,
      formattedDate: fullDate,
      formattedTime: '21:00h BRT',
      label: isToday ? 'Lança Hoje às 21:00h' : `Lança em ${dayMonth} às 21:00h`,
      badgeClass: isToday
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    }
  }

  return {
    isReleased: true,
    isToday: false,
    formattedDate: fullDate,
    formattedTime: '21:00h',
    label: `Exibido em ${dayMonth}`,
    badgeClass: 'bg-white/5 text-white/50 border-white/10'
  }
}

export function DetailsClient({ initialContent }: DetailsClientProps) {
  const router = useRouter()
  const [content, setContent] = useState<ContentItem>(initialContent)
  const [isMuted, setIsMuted] = useState(true)
  const [trailerId, setTrailerId] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  
  // Season & Episode states for TV shows
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [activeEpisode, setActiveEpisode] = useState<number>(1)
  const [upcomingNoticeEp, setUpcomingNoticeEp] = useState<Episode | null>(null)

  const { favoriteIds, addToFavorites, removeFromFavorites } = useFavorites()
  const isInList = favoriteIds.includes(content.id)

  // Fetch Trailer
  useEffect(() => {
    if (!content) return
    setTrailerId(null)
    setIsVideoPlaying(false)

    const fetchTrailer = async () => {
      try {
        const type = content.type || 'movie'
        const res = await fetch(`/api/content/trailer?tmdbId=${content.tmdbId || content.id}&type=${type}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.trailer?.youtube_video_id) {
          setTrailerId(data.trailer.youtube_video_id)
        }
      } catch (error) {
        console.error('Error fetching trailer for details page:', error)
      }
    }

    fetchTrailer()
  }, [content])

  const fetchEpisodes = async (seasonNumber: number) => {
    setLoadingEpisodes(true)
    try {
      const tmdbId = content.tmdbId || content.id
      const response = await fetch(`/api/content/tv?tmdbId=${tmdbId}&season=${seasonNumber}`)
      const data = await response.json()

      let episodesData = data.episodes
      if (!episodesData && Array.isArray(data)) {
        episodesData = data
      }

      if (episodesData) {
        const mappedEpisodes = episodesData.map((ep: any) => ({
          episode_number: ep.number || ep.episode_number,
          name: ep.title || ep.name || `Episódio ${ep.number || ep.episode_number}`,
          overview: ep.description || ep.overview || '',
          still_path: ep.thumbnail || ep.still_path || '',
          air_date: ep.air_date || ''
        }))
        setEpisodes(mappedEpisodes)
      }
    } catch (error) {
      console.error('Error fetching episodes for details page:', error)
    } finally {
      setLoadingEpisodes(false)
    }
  }

  // Fetch Seasons for TV shows
  useEffect(() => {
    const fetchSeasonsData = async () => {
      if (content.type === 'movie') return

      setLoadingSeasons(true)
      try {
        const tmdbId = content.tmdbId || content.id
        const response = await fetch(`/api/content/tv?tmdbId=${tmdbId}`)
        const data = await response.json()

        if (data.seasons) {
          if (Array.isArray(data.seasons)) {
            const filteredSeasons = data.seasons.filter((s: Season) => s.season_number > 0)
            setSeasons(filteredSeasons)
            if (filteredSeasons.length > 0) {
              const firstSeasonNum = filteredSeasons[0].season_number
              setSelectedSeason(firstSeasonNum)
              fetchEpisodes(firstSeasonNum)
            }
          } else if (typeof data.seasons === 'number') {
            const generatedSeasons: Season[] = []
            for (let i = 1; i <= data.seasons; i++) {
              generatedSeasons.push({
                season_number: i,
                name: `Temporada ${i}`,
                episode_count: 0
              })
            }
            setSeasons(generatedSeasons)
            if (generatedSeasons.length > 0) {
              setSelectedSeason(1)
              fetchEpisodes(1)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching seasons for details page:', error)
      } finally {
        setLoadingSeasons(false)
      }
    }

    fetchSeasonsData()
  }, [content])

  // Fetch related content
  const { contents: relatedContents, loading: loadingRelated } = useContent({
    endpoint: '/api/content/trending',
    params: { type: content.type === 'movie' ? 'movie' : 'tv' }
  })

  const handleToggleList = async () => {
    if (isInList) {
      await removeFromFavorites(content.id)
    } else {
      await addToFavorites(content)
    }
  }

  const handlePlayMain = () => {
    setActiveEpisode(1)
    setShowPlayer(true)
  }

  const handleEpisodeClick = (ep: Episode) => {
    const info = getEpisodeReleaseInfo(ep.air_date)
    if (!info.isReleased) {
      setUpcomingNoticeEp(ep)
    } else {
      setActiveEpisode(ep.episode_number)
      setShowPlayer(true)
    }
  }

  const handleForcePlayUpcoming = () => {
    if (upcomingNoticeEp) {
      setActiveEpisode(upcomingNoticeEp.episode_number)
      setShowPlayer(true)
      setUpcomingNoticeEp(null)
    }
  }

  const handleSeasonChange = (seasonNum: number) => {
    setSelectedSeason(seasonNum)
    fetchEpisodes(seasonNum)
  }

  const videoUrl = content.videoUrl || "https://videos.pexels.com/video-files/7901217/7901217-uhd_3840_2160_25fps.mp4"
  const posterUrl = content.backdrop || "https://images.pexels.com/videos/7901217/pexels-photo-7901217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"

  const titleWords = (content.title || '').split(' ')
  const mainTitle = titleWords[0] || 'REVERSA'
  const subTitle = titleWords.slice(1).join(' ')

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-netflix-red selection:text-white">
      <Header />

      {/* Cinematic Hero Backdrop */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${posterUrl}")` }}
          >
            {/* Background Video Trailer */}
            {trailerId ? (
              <div className={`absolute inset-0 w-full h-full scale-125 pointer-events-none transition-opacity duration-1000 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <ReactPlayer 
                  url={`https://www.youtube.com/watch?v=${trailerId}`}
                  playing={true}
                  loop={true}
                  muted={isMuted}
                  onStart={() => setIsVideoPlaying(true)}
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: { 
                        autoplay: 1, 
                        controls: 0, 
                        disablekb: 1, 
                        modestbranding: 1, 
                        playsinline: 1,
                        playlist: trailerId,
                        rel: 0,
                        showinfo: 0
                      }
                    } as any
                  }}
                  className="pointer-events-none"
                />
              </div>
            ) : (
              <video 
                src={videoUrl} 
                poster={posterUrl}
                autoPlay 
                muted={isMuted}
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover scale-105 opacity-80"
              />
            )}
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

            {/* Hero Details Overlay */}
            <div className="relative z-10 h-full flex items-end pb-24 px-8 md:px-16 lg:px-24">
              <div className="max-w-4xl w-full space-y-6">
                <div className="flex items-center gap-3 text-netflix-red font-black tracking-[0.5em] text-[10px] uppercase drop-shadow-lg">
                  <span className="w-12 h-px bg-netflix-red" />
                  {content.type === 'movie' ? 'Filme Reversa' : content.type === 'anime' ? 'Anime Reversa' : 'Série Reversa'}
                </div>

                <div className="space-y-1">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.8] uppercase opacity-95 text-shadow-xl select-none">
                    {mainTitle}
                    {subTitle && (
                      <span className="font-thin opacity-60 italic normal-case block mt-2 text-3xl md:text-5xl tracking-tight">
                        {subTitle}
                      </span>
                    )}
                  </h1>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/90">
                  <div className="glass px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xl">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> 
                    <span>{content.rating || '8.5'} Avaliação</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {content.year || '2026'}</span>
                    <span className="px-2 py-0.5 border border-white/20 rounded text-[9px] font-black uppercase tracking-widest bg-white/5">Ultra 4K</span>
                    {content.type === 'movie' ? (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {content.runtime ? `${content.runtime} min` : '135 min'}</span>
                    ) : (
                      <span>{seasons.length > 0 ? `${seasons.length} Temp.` : ''}</span>
                    )}
                  </div>
                </div>

                {/* Overview */}
                <p className="text-xs md:text-sm text-white/70 max-w-2xl leading-relaxed font-bold italic line-clamp-3 text-shadow-md">
                  {content.overview || 'Exploração visual cinematográfica e narrativa exclusiva do ecossistema Reversa.'}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 font-black px-8 py-6 rounded-sm text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl group"
                    onClick={handlePlayMain}
                  >
                    <Play className="w-5 h-5 mr-2 fill-current transition-transform group-hover:scale-115" />
                    ASSISTIR AGORA
                  </Button>

                  <Button
                    size="lg"
                    className="glass text-white hover:bg-white/10 font-black px-8 py-6 rounded-sm text-sm transition-all hover:scale-105 active:scale-95 border-white/10 flex items-center"
                    onClick={handleToggleList}
                  >
                    {isInList ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    {isInList ? 'MINHA LISTA' : 'ADICIONAR À LISTA'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mute Control */}
            <div className="absolute bottom-24 right-12 z-20">
              <button
                className="w-12 h-12 rounded-full border border-white/10 glass flex items-center justify-center text-white transition-all hover:bg-white/10 active:scale-90 shadow-2xl group"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110" /> : <Volume2 className="w-5 h-5 transition-transform group-hover:scale-110" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Page Content */}
      <main className="relative z-20 px-4 sm:px-8 lg:px-12 pb-24 -mt-12 space-y-24">
        
        {/* Seasons & Episodes Section (TV Shows Only) */}
        {content.type !== 'movie' && (
          <section className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-12 space-y-10 shadow-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter uppercase text-white flex items-center gap-2">
                  <Tv className="w-6 h-6 text-netflix-red" />
                  Episódios & Lançamentos
                </h3>
                <p className="text-xs text-white/30 font-bold uppercase tracking-wider">
                  Selecione a temporada para conferir episódios disponíveis e datas de lançamento
                </p>
              </div>

              {/* Season Selection Tabs */}
              {seasons.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => (
                    <button
                      key={s.season_number}
                      onClick={() => handleSeasonChange(s.season_number)}
                      className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                        selectedSeason === s.season_number
                          ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30'
                          : 'glass text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episodes List/Grid */}
            {loadingEpisodes ? (
              <div className="py-20 text-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-netflix-red mx-auto"></div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-black">Carregando episódios e datas...</p>
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {episodes.map((ep) => {
                  const releaseInfo = getEpisodeReleaseInfo(ep.air_date)
                  const epThumbnail = ep.still_path 
                    ? (ep.still_path.startsWith('http') ? ep.still_path : `https://image.tmdb.org/t/p/w300${ep.still_path}`)
                    : content.backdrop || "https://images.pexels.com/videos/7901217/pexels-photo-7901217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"

                  return (
                    <div 
                      key={ep.episode_number}
                      onClick={() => handleEpisodeClick(ep)}
                      className={`group cursor-pointer border rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full ${
                        !releaseInfo.isReleased
                          ? 'bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40'
                          : 'bg-zinc-900/40 border-white/5 hover:border-netflix-red/30'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
                        <img 
                          src={epThumbnail}
                          alt={ep.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-300 ${
                            !releaseInfo.isReleased ? 'bg-blue-600/80 backdrop-blur-md' : 'bg-netflix-red shadow-lg shadow-netflix-red/40'
                          }`}>
                            {!releaseInfo.isReleased ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-black text-white/80 tracking-wider">
                          EP {ep.episode_number}
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${releaseInfo.badgeClass}`}>
                              {!releaseInfo.isReleased ? (
                                <>
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{releaseInfo.label}</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>{releaseInfo.label}</span>
                                </>
                              )}
                            </span>
                          </div>

                          <h4 className="font-black text-xs uppercase tracking-wider text-white line-clamp-1 group-hover:text-netflix-red transition-colors">
                            {ep.name}
                          </h4>
                          <p className="text-[10px] text-white/40 leading-relaxed font-bold italic line-clamp-2">
                            {ep.overview || "Nenhuma sinopse disponível para este episódio."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-white/20 uppercase tracking-widest font-black">Nenhum episódio disponível para esta temporada.</p>
              </div>
            )}
          </section>
        )}

        {/* Related Content / Recommendations Row */}
        {relatedContents && relatedContents.length > 0 && (
          <ContentRow
            title={content.type === 'movie' ? "Outros Filmes Recomendados" : "Outras Séries Recomendadas"}
            contents={relatedContents.filter((item) => item.id !== content.id).slice(0, 15)}
            loading={loadingRelated}
            onPlay={(item) => router.push(`/details/${item.id}?type=${item.type}`)}
            onAddToList={addToFavorites}
            onRemoveFromList={(item) => removeFromFavorites(item.id)}
            onViewDetails={(item) => router.push(`/details/${item.id}?type=${item.type}`)}
            favoriteIds={favoriteIds}
          />
        )}
      </main>

      <Footer />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        content={content}
        season={selectedSeason}
        episode={activeEpisode}
      />

      {/* Upcoming Episode Notice Modal Overlay */}
      <AnimatePresence>
        {upcomingNoticeEp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="max-w-md w-full bg-zinc-900 border border-blue-500/30 p-8 rounded-2xl shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-xl">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Lançamento Programado
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {upcomingNoticeEp.name}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Este episódio está agendado para estrear em{' '}
                  <strong className="text-blue-300">
                    {getEpisodeReleaseInfo(upcomingNoticeEp.air_date).formattedDate}
                  </strong>{' '}
                  às <strong className="text-blue-300">21:00h BRT</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => setUpcomingNoticeEp(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl"
                >
                  Entendido, Aguardar
                </Button>
                <Button
                  onClick={handleForcePlayUpcoming}
                  className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-netflix-red/30"
                >
                  Tentar Assistir Agora
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
