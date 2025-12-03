
'use client'

import { useState, useEffect } from 'react'
import { X, Play, Plus, Check, Star, Calendar, Clock, Tv } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from './button'
import { Badge } from './badge'
import { ScrollArea } from './scroll-area'

interface ContentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  onRemoveFromList?: (content: ContentItem) => void
  isInList?: boolean
}

export function ContentDetailsModal({
  isOpen,
  onClose,
  content,
  onPlay,
  onAddToList,
  onRemoveFromList,
  isInList = false
}: ContentDetailsModalProps) {
  const [imageLoading, setImageLoading] = useState(true)

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

  const handleToggleList = () => {
    if (!content) return
    
    if (isInList) {
      onRemoveFromList?.(content)
    } else {
      onAddToList?.(content)
    }
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
          className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh]"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <ScrollArea className="h-full max-h-[90vh]">
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
              {content.backdrop ? (
                <Image
                  src={content.backdrop}
                  alt={content.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  onLoad={() => setImageLoading(false)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700" />
              )}
              
              {/* Loading skeleton */}
              {imageLoading && content.backdrop && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start space-x-6">
                  {/* Poster */}
                  <div className="flex-shrink-0 w-32 aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                    {content.poster ? (
                      <Image
                        src={content.poster}
                        alt={content.title}
                        width={128}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-red-600 text-white">
                        {content.type === 'series' ? 'Série' : content.type === 'anime' ? 'Anime' : 'Filme'}
                      </Badge>
                      {content.rating && (
                        <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                          ★ {content.rating}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      {content.year && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{content.year}</span>
                        </div>
                      )}
                      {content.runtime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{content.runtime} min</span>
                        </div>
                      )}
                      {content.seasons && (
                        <div className="flex items-center space-x-1">
                          <Tv className="w-4 h-4" />
                          <span>{content.seasons} temporadas</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Button
                        className="bg-white text-black hover:bg-gray-200 font-semibold"
                        onClick={() => onPlay?.(content)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Assistir
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="border-gray-400 text-white hover:bg-gray-800"
                        onClick={handleToggleList}
                      >
                        {isInList ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Na Lista
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Minha Lista
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6">
              {/* Overview */}
              {content.overview && (
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">Sinopse</h3>
                  <p className="text-gray-300 leading-relaxed">{content.overview}</p>
                </div>
              )}

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">Gêneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast */}
              {content.cast && content.cast.length > 0 && (
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">Elenco Principal</h3>
                  <p className="text-gray-300">{content.cast.slice(0, 5).join(', ')}</p>
                </div>
              )}

              {/* Director */}
              {content.director && (
                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">Direção</h3>
                  <p className="text-gray-300">{content.director}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                {content.episodes && (
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Total de Episódios</h4>
                    <p className="text-white">{content.episodes}</p>
                  </div>
                )}
                
                {content.imdbId && (
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">IMDb ID</h4>
                    <p className="text-white">{content.imdbId}</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
