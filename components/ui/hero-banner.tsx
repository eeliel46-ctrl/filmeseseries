
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Plus, Info, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from './button'
import { Badge } from './badge'

interface HeroBannerProps {
  contents: ContentItem[]
  onPlay?: (content: ContentItem) => void
  onAddToList?: (content: ContentItem) => void
  onViewDetails?: (content: ContentItem) => void
}

export function HeroBanner({
  contents,
  onPlay,
  onAddToList,
  onViewDetails
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  // Auto-rotate banner every 7 seconds
  useEffect(() => {
    if (contents.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contents.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [contents.length])

  if (!contents || contents.length === 0) {
    return (
      <div className="relative h-[70vh] bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Carregando conteúdo...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const currentContent = contents[currentIndex]

  return (
    <div className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {currentContent?.backdrop ? (
              <Image
                src={currentContent.backdrop}
                alt={currentContent.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
            )}
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Content Type & Rating */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge className="bg-red-600 text-white">
                      {currentContent.type === 'series' ? 'Série' : currentContent.type === 'anime' ? 'Anime' : 'Filme'}
                    </Badge>
                    {currentContent.rating && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                        ★ {currentContent.rating}
                      </Badge>
                    )}
                    {currentContent.year && (
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {currentContent.year}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {currentContent.title}
                  </h1>

                  {/* Overview */}
                  {currentContent.overview && (
                    <p className="text-lg text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {currentContent.overview}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-8">
                    {currentContent.runtime && (
                      <span>{currentContent.runtime} min</span>
                    )}
                    {currentContent.seasons && (
                      <span>{currentContent.seasons} temporadas</span>
                    )}
                    {currentContent.genres && (
                      <span>{currentContent.genres.slice(0, 3).join(', ')}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                      onClick={() => onPlay?.(currentContent)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Assistir
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-400 text-white hover:bg-gray-800 font-semibold px-8"
                      onClick={() => onAddToList?.(currentContent)}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Minha Lista
                    </Button>

                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white hover:bg-gray-800 font-semibold px-8"
                      onClick={() => onViewDetails?.(currentContent)}
                    >
                      <Info className="w-5 h-5 mr-2" />
                      Mais Info
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Audio Toggle */}
          <div className="absolute bottom-20 right-4 sm:right-8 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          {/* Progress Indicators */}
          {contents.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex space-x-2">
                {contents.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
