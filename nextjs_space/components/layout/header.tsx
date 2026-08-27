
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Bell, User, LogOut, Heart } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MOVIE_GENRES, TV_GENRES } from '@/lib/genres'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession() || {}
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'TV Ao Vivo', href: '/canais' },
    { name: 'Séries', href: '/series' },
    { name: 'Filmes', href: '/movies' },
    { name: 'Bombando', href: '/lancamentos' },
    { name: 'Minha Lista', href: '/my-list' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-10">
          <Link 
            href="/" 
            className="bg-netflix-red px-2 py-0.5 transform -skew-x-12 inline-block transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            <span className="text-white text-2xl font-black tracking-tighter block transform skew-x-12 uppercase">
              REVERSA
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7">
            <Link href="/" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-white/50'}`}>Início</Link>
            
            <Link 
              href="/canais" 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white flex items-center gap-1.5 ${
                pathname === '/canais' ? 'text-white' : 'text-white/50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              TV Ao Vivo
            </Link>

            {/* Restored Genre Dropdowns */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white flex items-center gap-1 ${pathname.startsWith('/series') ? 'text-white' : 'text-white/50'}`}>
                Séries
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900/95 border-white/10 backdrop-blur-xl max-h-[70vh] overflow-y-auto scrollbar-hide">
                <DropdownMenuItem onClick={() => router.push('/series')} className="text-white hover:bg-white/10 cursor-pointer uppercase text-[10px] font-black tracking-widest">Todas as Séries</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                {TV_GENRES.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => router.push(`/series?genre=${g.id}`)} className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-[10px] font-bold uppercase tracking-widest">{g.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white flex items-center gap-1 ${pathname.startsWith('/movies') ? 'text-white' : 'text-white/50'}`}>
                Filmes
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900/95 border-white/10 backdrop-blur-xl max-h-[70vh] overflow-y-auto scrollbar-hide">
                <DropdownMenuItem onClick={() => router.push('/movies')} className="text-white hover:bg-white/10 cursor-pointer uppercase text-[10px] font-black tracking-widest">Todos os Filmes</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                {MOVIE_GENRES.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => router.push(`/movies?genre=${g.id}`)} className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-[10px] font-bold uppercase tracking-widest">{g.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/lancamentos" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white ${pathname === '/lancamentos' ? 'text-white' : 'text-white/50'}`}>Bombando</Link>
            <Link href="/my-list" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white ${pathname === '/my-list' ? 'text-white' : 'text-white/50'}`}>Minha Lista</Link>
          </nav>
        </div>

        {/* Search and User Menu */}
        <div className="flex items-center space-x-6">
          {/* Functional Glass Search */}
          <form onSubmit={handleSearch} className="hidden lg:block relative group">
            <input
              type="text"
              placeholder="BUSCAR NO VAULT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass border-white/5 rounded-full px-6 py-2 pl-12 text-[10px] font-black uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-netflix-red w-56 transition-all focus:w-80 group-hover:border-white/20"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-netflix-red transition-colors" />
          </form>

          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-netflix-red rounded-full border border-black" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-sm bg-netflix-red flex items-center justify-center font-black text-white text-sm transition-all hover:scale-110 shadow-2xl active:scale-95">
                {session?.user?.name?.[0] || 'V'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/95 border-gray-800">
          <div className="px-4 py-3 bg-zinc-900/50">
            <p className="text-sm font-bold text-white">
              {session?.user?.name || session?.user?.email}
            </p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Premium Account</p>
          </div>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                onClick={() => router.push('/my-list')}
                className="text-white hover:bg-gray-800 cursor-pointer"
              >
                <Heart className="w-4 h-4 mr-2" />
                Minha Lista
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-white hover:bg-gray-800 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden px-4 pb-4 flex space-x-4 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-gray-300 ${
              pathname === item.href ? 'text-white' : 'text-gray-400'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
