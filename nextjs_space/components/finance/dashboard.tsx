
'use client'

import { LucideIcon, TrendingUp, RefreshCw, Activity, PieChart, ChevronLeft, ChevronRight, Bolt } from 'lucide-react'
import { motion } from 'framer-motion'
import { InvestmentCards } from './investment-cards'
import { ActivityFeed } from './activity-feed'
import { Hero } from './hero'

export function FinanceDashboard() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-[#fafafa] font-sans">
      {/* Background Video */}
      <video 
        src="https://videos.pexels.com/video-files/15283120/15283120-sd_960_540_30fps.mp4" 
        poster="https://images.pexels.com/videos/15283120/3d-clip-editor-marketingdigital-15283120.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />

      {/* Glow Effects */}
      <div className="red-glow top-[-100px] left-[-100px]" />
      <div className="red-glow bottom-[-200px] right-[-100px]" />

      <main className="relative z-10">
        <Hero />
        
        <section className="px-4 sm:px-8 lg:px-12 pb-24 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <ActivityFeed />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <InvestmentCards />
          </div>
        </section>
      </main>

      {/* Footer Metrics Overlay */}
      <footer className="relative z-20 px-4 sm:px-8 lg:px-12 py-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap gap-8 md:gap-12 justify-center md:justify-start">
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Assets</p>
              <p className="text-xl font-bold tracking-tight">$124,500.00</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Monthly Spend</p>
              <p className="text-xl font-bold tracking-tight">$3,420.12</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">AI Efficiency</p>
              <p className="text-xl font-bold text-finance-red tracking-tight">98.2%</p>
            </div>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
            © 2026 FinanceIA • SECURED BY QUANTUM ENCRYPTION
          </div>
        </div>
      </footer>
    </div>
  )
}
