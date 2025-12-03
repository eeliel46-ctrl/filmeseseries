
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { CalendarItem } from '@/lib/services/superflix'
import { ContentCard } from '@/components/ui/content-card'
import { VideoPlayerModal } from '@/components/ui/video-player-modal'
import { SeasonEpisodeModal } from '@/components/ui/season-episode-modal'
import { ContentItem } from '@/lib/types'
import { Calendar, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function LancamentosPage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/calendar')
      const data = await response.json()
      
      if (data.success) {
        setCalendarData(data.data)
      }
    } catch (error) {
      console.error('Error fetching calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayContent = (item: CalendarItem) => {
    const content: ContentItem = {
      id: item.tmdb_id,
      tmdbId: item.tmdb_id,
      imdbId: item.imdb_id,
      title: item.title,
      type: 'series',
      poster: item.poster_path,
      backdrop: item.backdrop_path
    }
    
    setSelectedContent(content)
    setSelectedSeason(item.season_number)
    setSelectedEpisode(item.episode_number)
    setShowPlayer(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoje':
        return 'bg-green-600'
      case 'Futuro':
        return 'bg-blue-600'
      case 'Atualizado':
        return 'bg-yellow-600'
      case 'Atrasado':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hoje':
        return <TrendingUp className="w-4 h-4" />
      case 'Futuro':
        return <Calendar className="w-4 h-4" />
      case 'Atualizado':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredData = filterStatus === 'all' 
    ? calendarData 
    : calendarData.filter(item => item.status === filterStatus)

  const groupedByStatus = {
    'Hoje': filteredData.filter(item => item.status === 'Hoje'),
    'Futuro': filteredData.filter(item => item.status === 'Futuro'),
    'Atualizado': filteredData.filter(item => item.status === 'Atualizado'),
    'Atrasado': filteredData.filter(item => item.status === 'Atrasado')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4 mx-auto"></div>
            <div className="text-white text-lg">Carregando lançamentos...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 pb-10 px-4 md:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Calendário de Lançamentos
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Acompanhe os últimos episódios e próximos lançamentos
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['all', 'Hoje', 'Futuro', 'Atualizado', 'Atrasado'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'Todos' : status}
              {status !== 'all' && (
                <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-full text-xs">
                  {groupedByStatus[status as keyof typeof groupedByStatus]?.length || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 aspect-[2/3] rounded-lg mb-2"></div>
                <div className="bg-gray-800 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-800 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Nenhum lançamento encontrado para este filtro
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.map((item, index) => (
              <div
                key={`${item.tmdb_id}-${item.season_number}-${item.episode_number}-${index}`}
                className="group cursor-pointer"
                onClick={() => handlePlayContent(item)}
              >
                <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-900">
                  {item.poster_path ? (
                    <Image
                      src={item.poster_path}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Calendar className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 ${getStatusColor(item.status)} text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1`}>
                    {getStatusIcon(item.status)}
                    <span>{item.status}</span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-1">
                    T{item.season_number} • E{item.episode_number}
                  </p>
                  {item.episode_title && (
                    <p className="text-gray-500 text-xs line-clamp-1">
                      {item.episode_title}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(item.air_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        content={selectedContent}
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  )
}
