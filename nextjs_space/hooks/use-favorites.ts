
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ContentItem, Favorite } from '@/lib/types'
import toast from 'react-hot-toast'

export function useFavorites() {
  const { data: session } = useSession() || {}
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!session?.user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/favorites')
      const data = await response.json()
      
      if (response.ok) {
        setFavorites(data.favorites || [])
      } else {
        console.error('Error fetching favorites:', data.error)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add to favorites
  const addToFavorites = async (content: ContentItem) => {
    if (!session?.user) {
      toast.error('Faça login para adicionar aos favoritos')
      return false
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          poster: content.poster,
          year: content.year,
          rating: content.rating,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFavorites(prev => [data.favorite, ...prev])
        toast.success('Adicionado aos favoritos')
        return true
      } else {
        toast.error(data.error || 'Erro ao adicionar aos favoritos')
        return false
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Erro ao adicionar aos favoritos')
      return false
    }
  }

  // Remove from favorites
  const removeFromFavorites = async (contentId: string) => {
    if (!session?.user) {
      return false
    }

    try {
      const response = await fetch(`/api/favorites/${contentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.contentId !== contentId))
        toast.success('Removido dos favoritos')
        return true
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao remover dos favoritos')
        return false
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Erro ao remover dos favoritos')
      return false
    }
  }

  // Check if content is in favorites
  const isInFavorites = (contentId: string) => {
    return favorites.some(fav => fav.contentId === contentId)
  }

  // Get favorite IDs as array
  const favoriteIds = favorites.map(fav => fav.contentId)

  useEffect(() => {
    fetchFavorites()
  }, [session])

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    favoriteIds,
    refetch: fetchFavorites
  }
}
