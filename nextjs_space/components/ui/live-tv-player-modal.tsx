'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Maximize, RotateCw, Tv, Radio, ShieldCheck, Sparkles, Volume2, ChevronRight, Play } from 'lucide-react'
import { Channel, CHANNELS_DATA } from '@/lib/channels-data'
import { Button } from '@/components/ui/button'

interface LiveTvPlayerModalProps {
  channel: Channel | null
  onClose: () => void
  onSelectChannel?: (channel: Channel) => void
}

export function LiveTvPlayerModal({
  channel,
  onClose,
  onSelectChannel,
}: LiveTvPlayerModalProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0)
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)
  const [keyReload, setKeyReload] = useState(0)
  const [showChannelList, setShowChannelList] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setSelectedServerIndex(0)
    setIsIframeLoaded(false)
    setKeyReload(0)
  }, [channel?.id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!channel) return null

  const currentServer = channel.servers[selectedServerIndex] || channel.servers[0]

  const handleReload = () => {
    setIsIframeLoaded(false)
    setKeyReload((prev) => prev + 1)
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen()
      }
    }
  }

  const relatedChannels = CHANNELS_DATA.filter(
    (c) => c.category === channel.category && c.id !== channel.id
  ).slice(0, 8)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-red-600/20 border border-red-500/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">AO VIVO</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold">
                {channel.number || 'TV'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {channel.name}
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {channel.quality}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChannelList(!showChannelList)}
              className="hidden sm:flex text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5"
            >
              <Tv className="w-3.5 h-3.5 mr-1.5 text-red-400" />
              Outros Canais
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleReload}
              title="Recarregar Transmissão"
              className="text-zinc-400 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              title="Tela Cheia"
              className="text-zinc-400 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg"
            >
              <Maximize className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 w-8 h-8 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Player Container */}
        <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[450px] md:min-h-[520px] flex items-center justify-center overflow-hidden">
          {!isIframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
              <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                Conectando ao sinal de {channel.name}...
              </div>
            </div>
          )}

          {currentServer && (
            <iframe
              key={`${currentServer.url}-${keyReload}`}
              ref={iframeRef}
              src={currentServer.url}
              title={channel.name}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              onLoad={() => setIsIframeLoaded(true)}
            />
          )}

          {/* Quick Side Channel Drawer */}
          {showChannelList && (
            <div className="absolute top-0 right-0 bottom-0 w-72 bg-zinc-950/95 backdrop-blur-xl border-l border-white/10 p-4 overflow-y-auto z-20 transition-all shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Canais Similares</h3>
                <button
                  onClick={() => setShowChannelList(false)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Fechar
                </button>
              </div>
              <div className="space-y-2">
                {relatedChannels.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectChannel) onSelectChannel(c)
                      setShowChannelList(false)
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/60 flex-shrink-0 flex items-center justify-center border border-white/10">
                      <img src={c.logo} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{c.currentProgram || c.category}</div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control & Server Switcher */}
        <div className="p-3 sm:p-4 bg-zinc-900/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Servidores:
            </span>
            {channel.servers.map((server, index) => (
              <button
                key={server.name}
                onClick={() => {
                  if (selectedServerIndex !== index) {
                    setSelectedServerIndex(index)
                    setIsIframeLoaded(false)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedServerIndex === index
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 truncate max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">
              No ar: <strong className="text-zinc-200">{channel.currentProgram || channel.description}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
