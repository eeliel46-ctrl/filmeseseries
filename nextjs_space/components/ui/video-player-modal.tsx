'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Maximize, Minimize, RefreshCw, ChevronDown, Check, ShieldCheck, Sparkles, Play, AlertCircle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContentItem } from '@/lib/types'
import { Button } from './button'
import { embedProviders, getProvider, getNextProvider } from '@/lib/services/embed-providers'
import { SmartPlayerEngine } from '@/lib/services/smart-player-engine'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  season?: number
  episode?: number
}

const LOADING_STEPS = [
  'Conectando ao servidor mais rápido...',
  'Calibrando áudio digital e qualidade 1080p/4K...',
  'Sincronizando transmissão com proteção anti-anúncios...',
  'Iniciando reprodução automática...',
]

export function VideoPlayerModal({
  isOpen,
  onClose,
  content,
  season = 1,
  episode = 1,
}: VideoPlayerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playerUrl, setPlayerUrl] = useState<string>('')
  const [selectedProviderId, setSelectedProviderId] = useState<string>(embedProviders[0].id)
  const [showProviderMenu, setShowProviderMenu] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [iframeError, setIframeError] = useState(false)

  // Smart Loading Engine States
  const [isSmartLoading, setIsSmartLoading] = useState(true)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(25)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Block popup attempts on parent window while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOpen = window.open
      window.open = function (url, target, features) {
        console.log('[Anti-Popup Shield] Blocked popup attempt:', url)
        return {
          close: () => {},
          focus: () => {},
          blur: () => {},
        } as any
      }

      const handleBeforeUnload = () => {}
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        window.open = originalOpen
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'f' || e.key === 'F') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          toggleFullscreen()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Smart Stream Resolution & Fast Loading Pipeline with Autoplay
  useEffect(() => {
    if (!content || !isOpen) return

    let isMounted = true
    setIsSmartLoading(true)
    setIframeError(false)
    setLoadingStepIndex(0)
    setLoadingProgress(30)

    const step1 = setTimeout(() => {
      if (!isMounted) return
      setLoadingStepIndex(1)
      setLoadingProgress(65)
    }, 350)

    const step2 = setTimeout(() => {
      if (!isMounted) return
      setLoadingStepIndex(2)
      setLoadingProgress(90)
    }, 700)

    // Resolve stream via Smart Player Engine
    const resolveStream = async () => {
      try {
        const result = await SmartPlayerEngine.resolveBestStream(
          content,
          selectedProviderId,
          season,
          episode
        )

        if (!isMounted) return

        setPlayerUrl(result.url)

        setTimeout(() => {
          if (!isMounted) return
          setLoadingStepIndex(3)
          setLoadingProgress(100)
          setTimeout(() => {
            if (isMounted) {
              setIsSmartLoading(false)
              // Auto-focus iframe to trigger immediate playback
              setTimeout(() => {
                iframeRef.current?.focus()
              }, 100)
            }
          }, 250)
        }, 950)
      } catch (err) {
        console.error('[SmartPlayer] Resolution error:', err)
        if (isMounted) {
          setIsSmartLoading(false)
          setIframeError(true)
        }
      }
    }

    resolveStream()

    return () => {
      isMounted = false
      clearTimeout(step1)
      clearTimeout(step2)
    }
  }, [content, isOpen, season, episode, selectedProviderId, loadAttempt])

  // Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(!isFullscreen))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }, [isFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Switch to another server
  const handleSwitchServer = (providerId: string) => {
    setSelectedProviderId(providerId)
    setShowProviderMenu(false)
    setLoadAttempt((prev) => prev + 1)
  }

  // Next server on error
  const handleNextServer = () => {
    const next = getNextProvider(selectedProviderId)
    if (next) {
      handleSwitchServer(next.id)
    }
  }

  // Retry current server
  const handleRetry = () => {
    setLoadAttempt((prev) => prev + 1)
  }

  if (!isOpen || !content) return null

  const currentProvider = getProvider(selectedProviderId) || embedProviders[0]
  const isMovie = content.type === 'movie'
  const backdropImg = content.backdrop || content.poster || ''

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-0 md:p-4 backdrop-blur-xl"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`relative bg-black overflow-hidden shadow-2xl border border-white/10 ${
            isFullscreen
              ? 'w-screen h-screen rounded-none'
              : 'w-full h-full md:w-[96vw] md:max-w-[1500px] md:h-[88vh] md:rounded-2xl'
          }`}
        >
          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              {/* Title & Metadata */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-netflix-red flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-netflix-red/30">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-white text-base md:text-lg font-black tracking-tight truncate">
                    {content.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    {!isMovie && (
                      <span className="text-netflix-red font-black">
                        T{season} : E{episode}
                      </span>
                    )}
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Autoplay Ativo
                    </span>
                    <span className="text-white/40 hidden sm:inline">•</span>
                    <span className="text-white/60 flex items-center gap-1 hidden sm:inline-flex">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Anti-Popup
                    </span>
                    <span className="text-white/40 hidden sm:inline">•</span>
                    <span className="text-yellow-400 font-bold hidden sm:inline">
                      {currentProvider.quality}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                {/* Server Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProviderMenu(!showProviderMenu)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span>{currentProvider.icon}</span>
                    <span className="hidden sm:inline">{currentProvider.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showProviderMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProviderMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                      >
                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5">
                          Servidores de Streaming
                        </div>
                        <div className="space-y-1 mt-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
                          {embedProviders.map((provider) => {
                            const isSelected = selectedProviderId === provider.id
                            return (
                              <button
                                key={provider.id}
                                onClick={() => handleSwitchServer(provider.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                  isSelected
                                    ? 'bg-netflix-red/20 text-white border border-netflix-red/40'
                                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                              >
                                <span className="text-lg shrink-0">{provider.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs truncate">{provider.name}</span>
                                    <span className="text-[9px] font-black uppercase text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                                      {provider.quality}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-white/40 truncate mt-0.5">
                                    {provider.tags.join(' • ')}
                                  </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-netflix-red shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Retry Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="text-white hover:bg-white/15 rounded-full w-9 h-9 p-0"
                  title="Recarregar Servidor"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

                {/* Fullscreen Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/15 rounded-full w-9 h-9 p-0"
                  title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-netflix-red/80 rounded-full w-9 h-9 p-0 transition-colors"
                  title="Fechar Player"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Video Viewport */}
          <div className="relative w-full h-full bg-black">
            {/* Cinematic Smart Loading Screen */}
            <AnimatePresence>
              {isSmartLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden"
                >
                  {/* Atmospheric Backdrop Blur */}
                  {backdropImg && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-25 scale-110 filter blur-2xl pointer-events-none"
                      style={{ backgroundImage: `url(${backdropImg})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 pointer-events-none" />

                  {/* Central Glow Radar and Animation */}
                  <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
                    {/* Glowing Logo / Pulse */}
                    <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-netflix-red/20 animate-ping duration-1000" />
                      <div className="absolute inset-0 rounded-full border-2 border-netflix-red/40 border-t-netflix-red animate-spin" />
                      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-7 h-7 text-netflix-red animate-pulse" />
                      </div>
                    </div>

                    {/* Movie/Series Title */}
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2 truncate max-w-full">
                      {content.title}
                    </h3>
                    {!isMovie && (
                      <p className="text-xs text-netflix-red font-bold uppercase tracking-widest mb-4">
                        Temporada {season} • Episódio {episode}
                      </p>
                    )}

                    {/* Current Status Message */}
                    <motion.div
                      key={loadingStepIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-semibold text-white/80 h-6 flex items-center justify-center gap-2 mb-6"
                    >
                      <span className="w-2 h-2 rounded-full bg-netflix-red animate-pulse" />
                      <span>{LOADING_STEPS[loadingStepIndex]}</span>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-3 border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-600 to-netflix-red"
                        initial={{ width: '0%' }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      />
                    </div>

                    {/* Server Info Tag */}
                    <div className="flex items-center justify-between w-full text-[11px] font-bold text-white/40 px-1">
                      <span>Servidor: <strong className="text-white/80">{currentProvider.name}</strong></span>
                      <span className="text-emerald-400 font-mono">Autoplay • Full HD</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sandboxed Secure Player Frame with Full Autoplay Permissions */}
            {playerUrl && !iframeError ? (
              <iframe
                ref={iframeRef}
                key={`${playerUrl}-${loadAttempt}`}
                src={playerUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *; accelerometer *; gyroscope *; camera *; microphone *"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-downloads"
                referrerPolicy="origin"
                title={`Reproduzindo ${content.title}`}
                style={{ border: 'none' }}
              />
            ) : (
              /* Fallback Error View */
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-6 text-red-500">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">
                  Servidor Temporariamente Indisponível
                </h3>
                <p className="text-sm text-white/50 max-w-md mb-8">
                  O servidor <strong>{currentProvider.name}</strong> não respondeu a tempo. Clique abaixo para alternar automaticamente para outro servidor.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    onClick={handleNextServer}
                    className="bg-netflix-red hover:bg-red-700 text-white font-black px-8 py-3 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    Alternar para Próximo Servidor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="border-white/20 text-white hover:bg-white/10 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
