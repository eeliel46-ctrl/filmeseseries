
'use client'

import Link from 'next/link'
import { Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-32 px-8 md:px-16 lg:px-24 bg-black relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
        <div className="space-y-8">
          <div className="bg-netflix-red px-3 py-1 transform -skew-x-12 inline-block shadow-2xl">
            <span className="text-white text-2xl font-black tracking-tighter block transform skew-x-12 uppercase">REVERSA</span>
          </div>
          <p className="text-[11px] text-white/20 font-black leading-loose uppercase tracking-[0.15em]">
            A próxima geração do streaming de cinema em casa. Experiência visual imersiva e curadoria exclusiva do ecossistema Reversa.
          </p>
        </div>
        
        <div className="space-y-6">
          <h6 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Plataforma</h6>
          <ul className="text-[11px] font-bold uppercase tracking-widest space-y-4 text-white/60">
            <li><Link href="/account" className="hover:text-white transition-colors">Conta Premium</Link></li>
            <li><Link href="/devices" className="hover:text-white transition-colors">Dispositivos Ultra</Link></li>
            <li><Link href="/plans" className="hover:text-white transition-colors">Planos de Cinema</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h6 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Suporte</h6>
          <ul className="text-[11px] font-bold uppercase tracking-widest space-y-4 text-white/60">
            <li><Link href="/help" className="hover:text-white transition-colors">Central de Comando</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Protocolos de Uso</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Segurança de Dados</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h6 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Conectar</h6>
          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 border border-white/10 glass rounded-sm flex items-center justify-center hover:bg-netflix-red hover:border-netflix-red transition-all cursor-pointer shadow-xl group">
              <Instagram className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </a>
            <a href="#" className="w-10 h-10 border border-white/10 glass rounded-sm flex items-center justify-center hover:bg-netflix-red hover:border-netflix-red transition-all cursor-pointer shadow-xl group">
              <Twitter className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </a>
            <a href="#" className="w-10 h-10 border border-white/10 glass rounded-sm flex items-center justify-center hover:bg-netflix-red hover:border-netflix-red transition-all cursor-pointer shadow-xl group">
              <Youtube className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-black text-center pt-12 border-t border-white/5">
        © 2026 REVERSA ENTERTAINMENT SYSTEM // CINEMATIC INTERFACE v2.0
      </div>
    </footer>
  )
}
