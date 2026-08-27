'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tv, Radio, Play, ChevronRight, Sparkles } from 'lucide-react'
import { CHANNELS_DATA, Channel } from '@/lib/channels-data'
import { LiveTvPlayerModal } from '@/components/ui/live-tv-player-modal'

export function LiveChannelsRow() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  // Top 10 featured channels
  const featuredChannels = CHANNELS_DATA.filter((c) => c.isFeatured).slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-red-500" />
            AO VIVO
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-500" />
            TV Ao Vivo & Canais VIP
          </h2>
        </div>

        <Link
          href="/canais"
          className="text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-1 group transition-colors"
        >
          Ver Todos (+35)
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {featuredChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => setSelectedChannel(channel)}
            className="group relative flex flex-col bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-red-500/50 rounded-2xl p-3 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-1"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/5 flex items-center justify-center p-3 mb-2.5">
              <img
                src={channel.logo}
                alt={channel.name}
                className="max-h-14 max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold shadow">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                LIVE
              </div>

              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[9px] font-bold">
                {channel.quality}
              </div>

              {/* Play hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[1px]">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                  {channel.name}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {channel.currentProgram || channel.category}
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-zinc-400">
                {channel.number || 'TV'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedChannel && (
        <LiveTvPlayerModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onSelectChannel={(newChannel) => setSelectedChannel(newChannel)}
        />
      )}
    </div>
  )
}
