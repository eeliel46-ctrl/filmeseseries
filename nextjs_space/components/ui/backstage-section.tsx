
'use client'

interface BackstageItem {
  title: string
  description: string
  image: string
}

interface BackstageSectionProps {
  featureTitle: string
  featureSubtitle: string
  featureImage: string
  items: BackstageItem[]
  onAction?: () => void
}

export function BackstageSection({ 
  featureTitle, 
  featureSubtitle, 
  featureImage, 
  items,
  onAction
}: BackstageSectionProps) {
  return (
    <section className="animate-fade-in py-10">
      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-0 bg-zinc-900/30 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        {/* Left: Immersive Poster */}
        <div className="relative h-[700px] group overflow-hidden">
          <img 
            src={featureImage} 
            alt={featureTitle} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-16 space-y-8">
            <span className="bg-netflix-red text-[10px] font-black px-4 py-2 uppercase tracking-[0.3em] rounded-sm shadow-2xl">SÉRIE EXCLUSIVA</span>
            <div className="space-y-2">
              <h4 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase text-shadow-xl text-white">
                {featureTitle}<br />
                <span className="font-thin italic opacity-60 lowercase">{featureSubtitle}</span>
              </h4>
            </div>
            <button 
              onClick={onAction}
              className="bg-white text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-netflix-red hover:text-white transition-all shadow-2xl active:scale-95 transform hover:scale-105"
            >
              Ver Agora
            </button>
          </div>
        </div>
        
        {/* Right: Backstage Info */}
        <div className="p-16 flex flex-col justify-center space-y-16 bg-black/40 backdrop-blur-3xl border-l border-white/5">
          <div className="space-y-4">
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Bastidores <span className="text-netflix-red">Reversa</span></h3>
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest italic">Behind the scenes // 2026 Production</p>
          </div>

          <div className="space-y-12">
            {items.map((item, index) => (
              <div key={index} className="flex gap-8 items-center group cursor-pointer">
                <div className="w-44 h-28 rounded-2xl overflow-hidden flex-none border border-white/10 shadow-2xl relative">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="space-y-2">
                  <h5 className="font-black text-base uppercase tracking-tight group-hover:text-netflix-red transition-colors text-white">{item.title}</h5>
                  <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-bold italic">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
