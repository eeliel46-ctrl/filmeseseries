
'use client'

import { PieChart, ChevronLeft, ChevronRight, ArrowUpRight, Apple, TrendingUp } from 'lucide-react'

export function InvestmentCards() {
  const investments = [
    {
      id: 1,
      name: 'NVIDIA Corp',
      symbol: 'NVDA',
      category: 'Semiconductors',
      confidence: 94,
      change: 12.4,
      isPositive: true,
      bars: [40, 60, 50, 80, 100],
    },
    {
      id: 2,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      category: 'Consumer Electronics',
      confidence: 82,
      change: -2.1,
      isPositive: false,
      bars: [80, 70, 60, 65, 50],
    },
    {
      id: 3,
      name: 'Tesla, Inc.',
      symbol: 'TSLA',
      category: 'Automotive',
      confidence: 88,
      change: 8.7,
      isPositive: true,
      bars: [30, 40, 60, 75, 90],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
          <PieChart className="text-finance-red w-5 h-5" /> Investment Insights
        </h3>
        <div className="flex gap-2">
          <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/5 transition-colors group">
            <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-white" />
          </button>
          <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/5 transition-colors group">
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
        {investments.map((item) => (
          <div key={item.id} className="glass p-8 min-w-[320px] flex-shrink-0 group hover:border-finance-red/40 transition-all cursor-pointer relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:rotate-12">
                {item.symbol === 'AAPL' ? <Apple className="text-white w-6 h-6" /> : <div className="text-white font-black text-xl italic">N</div>}
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${item.confidence > 90 ? 'bg-finance-red/20 text-finance-red' : 'bg-white/5 text-white/40'}`}>
                  {item.confidence}% AI Confidence
                </span>
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-xl font-bold tracking-tight">{item.name}</p>
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-6">{item.category} • {item.symbol}</p>
              
              <div className="h-20 flex items-end gap-1.5 mb-6">
                {item.bars.map((height, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-[4px] transition-all duration-500 ${
                      i === item.bars.length - 1 
                        ? (item.isPositive ? 'bg-finance-red shadow-[0_0_15px_rgba(229,9,20,0.4)]' : 'bg-white/40') 
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`text-sm font-bold ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {item.isPositive ? '+' : ''}{item.change}%
                </p>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 group-hover:text-finance-red transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            {/* Hover Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-finance-red/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  )
}
