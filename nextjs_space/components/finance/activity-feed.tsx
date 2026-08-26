
'use client'

import { Activity } from 'lucide-react'

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      title: 'Subscription Optimization',
      description: "FinanceIA cancelled unused 'Stream+'. Saved $12/mo.",
      time: '2 mins ago',
      active: true,
    },
    {
      id: 2,
      title: 'Investment Dividend',
      description: 'Received $4.20 from Apple Inc. (AAPL)',
      time: '4 hours ago',
      active: false,
    },
    {
      id: 3,
      title: 'Budget Target Reached',
      description: 'Groceries budget is 100% optimized for June.',
      time: 'Yesterday',
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
        <Activity className="text-finance-red w-5 h-5" /> Activity Feed
      </h3>
      <div className="glass p-8 space-y-10 relative overflow-hidden">
        {/* Timeline Line */}
        <div className="absolute left-[47px] top-12 bottom-12 w-[1px] bg-white/5" />
        
        {activities.map((item) => (
          <div key={item.id} className="flex gap-6 relative group">
            <div className={`w-10 h-10 rounded-full bg-[#050505] border ${item.active ? 'border-finance-red shadow-[0_0_15px_rgba(229,9,20,0.5)]' : 'border-white/10'} flex items-center justify-center relative z-10 transition-all group-hover:scale-110`}>
              <div className={`w-2.5 h-2.5 rounded-full ${item.active ? 'bg-finance-red animate-pulse' : 'bg-white/10'}`} />
            </div>
            <div className="pt-1">
              <p className="text-sm font-bold tracking-tight group-hover:text-finance-red transition-colors">{item.title}</p>
              <p className="text-xs text-white/40 leading-relaxed mt-1">{item.description}</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${item.active ? 'text-finance-red' : 'text-white/20'}`}>
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
