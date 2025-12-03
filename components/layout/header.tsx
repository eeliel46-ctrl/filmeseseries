
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
    { name: 'Filmes', href: '/movies' },
    { name: 'Séries', href: '/series' },
    { name: 'Minha Lista', href: '/my-list' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-red-600 text-2xl font-bold">
            STREAMFLIX
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {/* Início */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === '/' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Início
            </Link>

            {/* Filmes com gêneros */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname.startsWith('/movies') ? 'text-white' : 'text-gray-400'
              }`}>
                Filmes
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 border-gray-800">
                <DropdownMenuItem
                  onClick={() => router.push('/movies')}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  Todos os gêneros
                </DropdownMenuItem>
                {MOVIE_GENRES.map((g) => (
                  <DropdownMenuItem
                    key={g.id}
                    onClick={() => router.push(`/movies?genre=${g.id}`)}
                    className="text-white hover:bg-gray-800 cursor-pointer"
                  >
                    {g.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Séries com gêneros */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname.startsWith('/series') ? 'text-white' : 'text-gray-400'
              }`}>
                Séries
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 border-gray-800">
                <DropdownMenuItem
                  onClick={() => router.push('/series')}
                  className="text-white hover:bg-gray-800 cursor-pointer"
                >
                  Todos os gêneros
                </DropdownMenuItem>
                {TV_GENRES.map((g) => (
                  <DropdownMenuItem
                    key={g.id}
                    onClick={() => router.push(`/series?genre=${g.id}`)}
                    className="text-white hover:bg-gray-800 cursor-pointer"
                  >
                    {g.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Minha Lista */}
            <Link
              href="/my-list"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === '/my-list' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Minha Lista
            </Link>
          </nav>
        </div>

        {/* Search and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 border border-gray-700 rounded-md px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Mobile Search */}
          <button
            onClick={() => router.push('/search')}
            className="md:hidden text-white hover:text-gray-300"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
            <Bell className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 text-white hover:text-gray-300">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/95 border-gray-800">
              <div className="px-2 py-2">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name || session?.user?.email}
                </p>
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
