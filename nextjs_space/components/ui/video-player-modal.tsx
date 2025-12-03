
'use client'

import { useState, useEffect } from 'react'
import { X, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from './button'
import { playerFlixService } from '@/lib/services/playerflix'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  season?: number
  episode?: number
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  content,
  season = 1,
  episode = 1
}: VideoPlayerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playerUrl, setPlayerUrl] = useState<string>('')
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const fetchPlayerUrl = async () => {
      if (!content || !isOpen) return

      setIsLoadingUrl(true)
      try {
        const isMovie = content.type === 'movie'
        const isSeries = content.type === 'series' || content.type === 'anime'

        if (isMovie) {
          // Para filmes, precisamos do IMDB ID
          let imdbId = content.imdbId

          // Se não tiver imdbId, busca via TMDb
          if (!imdbId && content.tmdbId) {
            const response = await fetch(`/api/content/imdb?tmdbId=${content.tmdbId}&type=movie`)
            const data = await response.json()
            imdbId = data.imdbId
          }

          if (imdbId) {
            const url = playerFlixService.getMoviePlayerUrl(imdbId)
            console.log('Movie Player URL (PlayerFlix VIP):', url)
            setPlayerUrl(url)
          } else {
            console.error('IMDB ID not found for movie:', content.title)
            setPlayerUrl('')
          }
        } else if (isSeries) {
          // Para séries, usa o TMDB ID diretamente
          const tmdbId = content.tmdbId || content.id
          
          if (tmdbId) {
            const url = playerFlixService.getSeriesPlayerUrl(tmdbId, season, episode)
            console.log('Series Player URL (PlayerFlix VIP):', url)
            setPlayerUrl(url)
          } else {
            console.error('TMDB ID not found for series:', content.title)
            setPlayerUrl('')
          }
        }
      } catch (error) {
        console.error('Error fetching player URL:', error)
        setPlayerUrl('')
      } finally {
        setIsLoadingUrl(false)
      }
    }

    fetchPlayerUrl()
  }, [content, isOpen, season, episode])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isOpen || !content) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative bg-black rounded-lg overflow-hidden shadow-2xl ${
            isFullscreen 
              ? 'w-full h-full max-w-none max-h-none' 
              : 'w-full max-w-6xl h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-semibold">{content.title}</h2>
                {(content.type === 'series' || content.type === 'anime') && (
                  <p className="text-gray-400 text-sm">
                    Temporada {season} • Episódio {episode}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Player Container */}
          <div className="relative w-full h-full bg-black">
            {isLoadingUrl ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                  <div className="text-white text-lg">Carregando player...</div>
                </div>
              </div>
            ) : playerUrl ? (
              <iframe
                src={playerUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-forms allow-scripts allow-same-origin allow-presentation allow-top-navigation-by-user-activation"
                allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; accelerometer *; gyroscope *; camera *; microphone *"
                referrerPolicy="no-referrer"
                title={`Reproduzindo ${content.title}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-white text-xl mb-4">Conteúdo não disponível</div>
                  <div className="text-gray-400">
                    Desculpe, este conteúdo não está disponível para reprodução no momento.
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
