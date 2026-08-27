'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CHANNELS_DATA, CHANNEL_CATEGORIES, Channel } from '@/lib/channels-data'
import { LiveTvPlayerModal } from '@/components/ui/live-tv-player-modal'
import {
  Search,
  Play,
  Radio,
  Tv,
  Sparkles,
  Zap,
  ShieldCheck,
  Flame,
  Layers,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CanaisPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  // Featured Channel for Hero Banner
  const featuredChannel = useMemo(() => {
    return CHANNELS_DATA.find((c) => c.isFeatured && c.category === 'esportes') || CHANNELS_DATA[0]
  }, [])

  // Filtered Channels
  const filteredChannels = useMemo(() => {
    return CHANNELS_DATA.filter((channel) => {
      const matchesCategory =
        selectedCategory === 'todos' || channel.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      <main className="flex-1 pb-20">
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-8 lg:px-12 overflow-hidden border-b border-white/5 bg-gradient-to-b from-zinc-950 via-[#0d0d12] to-[#09090b]">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
              {/* Left Text */}
              <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Transmissão Ao Vivo em Alta Definição
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Canais de TV{' '}
                  <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                    Abertos & Fechados
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Assista a futebol ao vivo, notícias, filmes, séries, desenhos e documentários 24 horas por dia com múltiplos servidores de alta performance.
                </p>

                {/* Hero Feature highlights */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-medium text-zinc-300">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Zap className="w-4 h-4 text-amber-400" />
                    +35 Canais 1080p / 4K
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Multi-Servidores com Failover
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Tv className="w-4 h-4 text-red-400" />
                    Futebol & Premieres 24h
                  </div>
                </div>

                {/* Quick Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Button
                    size="lg"
                    onClick={() => setActiveChannel(featuredChannel)}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 shadow-xl shadow-red-600/30 rounded-xl"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Assistir Destaque ({featuredChannel.name})
                  </Button>
                </div>
              </div>

              {/* Right Featured Card Card Preview */}
              <div className="w-full max-w-md lg:max-w-lg z-10">
                <div
                  onClick={() => setActiveChannel(featuredChannel)}
                  className="group relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-2xl hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/80 flex items-center justify-center">
                    <img
                      src={featuredChannel.logo}
                      alt={featuredChannel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      AO VIVO
                    </div>

                    {/* Quality */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500/80 text-black font-extrabold text-[10px] uppercase shadow">
                      {featuredChannel.quality}
                    </div>

                    {/* Play Icon Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                        Canal em Destaque
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                        {featuredChannel.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {featuredChannel.currentProgram || featuredChannel.description}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-white/10 hover:bg-white/10 text-xs"
                    >
                      Ver Canal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTROLS: CATEGORIES & SEARCH ================= */}
        <section className="sticky top-[72px] z-40 bg-[#09090b]/95 backdrop-blur-md py-4 px-4 sm:px-8 lg:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {CHANNEL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar canal ou gênero..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ================= CHANNELS GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {CHANNEL_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Canais'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                {filteredChannels.length} disponíveis
              </span>
            </div>
          </div>

          {filteredChannels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10 text-center px-4">
              <Tv className="w-12 h-12 text-zinc-500 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Nenhum canal encontrado</h3>
              <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                Não encontramos nenhum canal com o termo "{searchQuery}". Tente buscar por outro nome ou selecione outra categoria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('todos')
                }}
                className="mt-4 rounded-xl border-white/10"
              >
                Ver Todos os Canais
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className="group relative flex flex-col bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/10 hover:border-red-500/50 rounded-2xl p-3 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-red-600/10 hover:-translate-y-1"
                >
                  {/* Thumbnail / Logo Container */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center mb-3">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold shadow">
                      <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                      LIVE
                    </div>

                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[9px] font-bold">
                      {channel.quality}
                    </div>

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Channel Meta */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono font-bold">
                          {channel.number || 'TV'}
                        </span>
                        <span className="capitalize">{channel.category}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mt-1">
                        {channel.name}
                      </h3>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {channel.currentProgram || channel.description}
                      </p>
                    </div>

                    {/* Server count tag */}
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{channel.servers.length} servidores</span>
                      <span className="text-red-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        Assistir <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Live Player Modal */}
      {activeChannel && (
        <LiveTvPlayerModal
          channel={activeChannel}
          onClose={() => setActiveChannel(null)}
          onSelectChannel={(newChannel) => setActiveChannel(newChannel)}
        />
      )}
    </div>
  )
}
