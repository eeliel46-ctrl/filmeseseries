'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Info, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any
import { ContentItem } from '@/lib/types'
import { Button } from './button'

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
  const [trailerId, setTrailerId] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
 
  // Reset video playing state when changing content
  useEffect(() => {
    setIsVideoPlaying(false)
  }, [currentIndex])

  // Auto-rotate banner every 12 seconds
  useEffect(() => {
    if (contents.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contents.length)
    }, 12000)

    return () => clearInterval(interval)
  }, [contents.length])

  // Fetch Kinocheck Trailer
  useEffect(() => {
    if (!contents || contents.length === 0) return;
    
    const currentContent = contents[currentIndex];
    setTrailerId(null); // Reset while fetching
    
    if (!currentContent.tmdbId) return;

    const fetchTrailer = async () => {
      try {
        const type = currentContent.type || 'movie';
        const res = await fetch(`/api/content/trailer?tmdbId=${currentContent.tmdbId}&type=${type}`);
        if (!res.ok) return;
        
        const data = await res.json();
        if (data.trailer?.youtube_video_id) {
          setTrailerId(data.trailer.youtube_video_id);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    fetchTrailer();
  }, [currentIndex, contents]);

  if (!contents || contents.length === 0) {
    return (
      <div className="relative h-[70vh] bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Carregando conteúdo...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const currentContent = contents[currentIndex]
  const videoUrl = currentContent.videoUrl || "https://videos.pexels.com/video-files/7901217/7901217-uhd_3840_2160_25fps.mp4"
  const posterUrl = currentContent.backdrop || "https://images.pexels.com/videos/7901217/pexels-photo-7901217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"

  // Splitting title for cinematic effect
  const titleWords = (currentContent.title || '').split(' ')
  const mainTitle = titleWords[0] || 'REVERSA'
  const subTitle = titleWords.slice(1).join(' ')

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${posterUrl}")` }}
        >
          {/* Background Video */}
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
              className="absolute inset-0 w-full h-full object-cover scale-110"
            />
          )}
          
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 h-full flex items-end pb-32 md:pb-40 px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                className="space-y-10"
              >
                {/* Brand Tagline */}
                <div className="flex items-center gap-3 text-netflix-red font-black tracking-[0.5em] text-[11px] uppercase drop-shadow-lg">
                  <span className="w-12 h-px bg-netflix-red" />
                  REVERSA ORIGINAL
                </div>

                {/* Dramatic Cinematic Typography */}
                <div className="space-y-1">
                  <h2 className="text-7xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.8] uppercase opacity-90 text-shadow-xl select-none">
                    {mainTitle}
                    {subTitle && (
                      <div className="font-thin opacity-60 italic normal-case block mt-4 text-5xl md:text-7xl lg:text-8xl tracking-tight">
                        {subTitle}
                      </div>
                    )}
                  </h2>
                </div>

                {/* Glassmorphic Metadata Pill Cluster */}
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                  <div className="glass px-6 py-2.5 rounded-full flex items-center gap-2 shadow-2xl">
                    <span className="text-yellow-400">★</span> 
                    <span>{currentContent.rating || '9.8'} <span className="text-white/40 font-normal ml-1">Rating</span></span>
                  </div>
                  <div className="flex items-center gap-5 text-white/70">
                    <span>{currentContent.year || '2026'}</span>
                    <span className="px-2.5 py-1 border border-white/20 rounded text-[10px] font-black uppercase tracking-widest bg-white/5">Ultra 4K</span>
                    <span>{currentContent.runtime ? `${currentContent.runtime}m` : '2h 15m'}</span>
                  </div>
                </div>

                {/* Cinematic CTA Buttons */}
                <div className="flex flex-wrap items-center gap-5 pt-8">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 font-black px-12 py-9 rounded-sm text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl group"
                    onClick={() => onPlay?.(currentContent)}
                  >
                    <Play className="w-8 h-8 mr-3 fill-current transition-transform group-hover:scale-110" />
                    ASSISTIR AGORA
                  </Button>
                  
                  <Button
                    size="lg"
                    className="glass text-white hover:bg-white/10 font-black px-12 py-9 rounded-sm text-xl transition-all hover:scale-105 active:scale-95 border-white/10 flex items-center group"
                    onClick={() => onViewDetails?.(currentContent)}
                  >
                    <Info className="w-8 h-8 mr-3 transition-transform group-hover:rotate-12" />
                    MAIS INFORMAÇÕES
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Audio Control */}
          <div className="absolute bottom-12 right-12 z-20">
            <button
              className="w-16 h-16 rounded-full border border-white/10 glass flex items-center justify-center text-white transition-all hover:bg-white/10 active:scale-90 shadow-2xl group"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Ativar som" : "Mudar para mudo"}
            >
              {isMuted ? <VolumeX className="w-7 h-7 transition-transform group-hover:scale-110" /> : <Volume2 className="w-7 h-7 transition-transform group-hover:scale-110" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
