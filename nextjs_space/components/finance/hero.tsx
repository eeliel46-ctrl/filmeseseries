
'use client'

import { TrendingUp, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="pt-32 pb-32 flex flex-col items-center text-center px-6 relative">
      <div className="relative">
        {/* Floating Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-16 -left-8 md:-left-32 glass p-4 flex items-center gap-3 animate-float hidden sm:flex"
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="text-green-500 w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Savings</p>
            <p className="text-sm font-semibold">+$42.00 today</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute -bottom-12 -right-8 md:-right-40 glass p-4 flex items-center gap-3 animate-float hidden sm:flex"
          style={{ animationDelay: '1.5s' }}
        >
          <div className="w-8 h-8 rounded-full bg-finance-red/20 flex items-center justify-center">
            <RefreshCw className="text-finance-red w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Auto-Invest</p>
            <p className="text-sm font-semibold">$100.00 allocated</p>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] max-w-4xl"
        >
          Your Wealth, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
            Smoothened.
          </span>
        </motion.h1>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-10 text-lg md:text-xl text-white/50 max-w-xl font-medium tracking-tight"
      >
        The AI-powered financial assistant that destabilizes traditional banking with elegant automation and real-time insights.
      </motion.p>
      
      <motion.button 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 px-10 py-5 finance-gradient rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(229,9,20,0.4)] hover:scale-105 transition-all active:scale-95"
      >
        Get Started Free
      </motion.button>
    </section>
  )
}
