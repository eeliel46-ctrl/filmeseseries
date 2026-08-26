'use client'

import { useState, useEffect, useCallback } from 'react'
import { ContentItem } from '@/lib/types'

export interface WatchedItem {
  id: string
  tmdbId: string
  title: string
  type: 'movie' | 'series' | 'anime'
  poster: string
  backdrop: string
  season?: number
  episode?: number
  progressPercent: number
  durationStr: string
  rating: string
  matchPercent: number
  ageRating: string
  quality: string
  genres: string[]
  lastWatched: number
}

const STORAGE_KEY = 'reversa_continue_watching_v3'

const INITIAL_SEED_ITEMS: WatchedItem[] = [
  {
    id: '108978',
    tmdbId: '108978',
    title: 'Reacher',
    type: 'series',
    poster: 'https://image.tmdb.org/t/p/w500/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg',
    season: 4,
    episode: 4,
    progressPercent: 72,
    durationStr: '54:55',
    rating: '8.1',
    matchPercent: 94,
    ageRating: '16+',
    quality: '4K',
    genres: ['Ação', 'Crime', 'Drama'],
    lastWatched: Date.now() - 1000 * 60 * 30
  },
  {
    id: '1368337',
    tmdbId: '1368337',
    title: 'Código: Vingança',
    type: 'movie',
    poster: 'https://image.tmdb.org/t/p/w500/muMwJAiMtReEHLKpKMWt2rMkYF7.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/RMXG8myu1aGlNUsRjtxzmpdMK0.jpg',
    progressPercent: 48,
    durationStr: '1:12:40',
    rating: '8.5',
    matchPercent: 88,
    ageRating: '16+',
    quality: 'Ultra HD',
    genres: ['Ação', 'Thriller'],
    lastWatched: Date.now() - 1000 * 60 * 120
  },
  {
    id: '95350',
    tmdbId: '95350',
    title: 'Lanternas',
    type: 'series',
    poster: 'https://image.tmdb.org/t/p/w500/wiF1C97GuJEOBSKWrtub517THjF.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/mdbWfpbWhvxgG3k5MHpo90UgAUe.jpg',
    season: 1,
    episode: 2,
    progressPercent: 60,
    durationStr: '48:15',
    rating: '8.2',
    matchPercent: 91,
    ageRating: '14+',
    quality: '4K',
    genres: ['Ficção Científica', 'Mistério'],
    lastWatched: Date.now() - 1000 * 60 * 360
  },
  {
    id: '125988',
    tmdbId: '125988',
    title: 'Silo',
    type: 'series',
    poster: 'https://image.tmdb.org/t/p/w500/tVR4q9FazxJuCEpaYxiCijUlvM3.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uTWhbLc7Bj4qNSdW3ZvZKL8cOHv.jpg',
    season: 2,
    episode: 1,
    progressPercent: 35,
    durationStr: '52:10',
    rating: '8.3',
    matchPercent: 86,
    ageRating: '16+',
    quality: 'HD',
    genres: ['Ficção Científica', 'Drama'],
    lastWatched: Date.now() - 1000 * 60 * 720
  }
]

export function useContinueWatching() {
  const [items, setItems] = useState<WatchedItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage with version check
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed)
        } else {
          setItems(INITIAL_SEED_ITEMS)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ITEMS))
        }
      } else {
        setItems(INITIAL_SEED_ITEMS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ITEMS))
      }
    } catch (e) {
      setItems(INITIAL_SEED_ITEMS)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save / Update progress
  const saveProgress = useCallback((
    content: ContentItem,
    season: number = 1,
    episode: number = 1,
    progressPercent: number = 20
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === content.id)
      const isMovie = content.type === 'movie'

      const updatedItem: WatchedItem = {
        id: content.id,
        tmdbId: content.tmdbId || content.id,
        title: content.title,
        type: content.type as any,
        poster: content.poster || '',
        backdrop: content.backdrop || content.poster || '',
        season: !isMovie ? season : undefined,
        episode: !isMovie ? episode : undefined,
        progressPercent: Math.max(progressPercent, 15),
        durationStr: !isMovie ? `S${season}:E${episode}` : '1:24:10',
        rating: content.rating || '8.5',
        matchPercent: 85 + Math.floor(Math.random() * 14),
        ageRating: '16+',
        quality: '4K',
        genres: content.genres || ['Streaming'],
        lastWatched: Date.now()
      }

      let newList: WatchedItem[]
      if (existingIndex >= 0) {
        newList = [...prev]
        newList[existingIndex] = updatedItem
      } else {
        newList = [updatedItem, ...prev]
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
      } catch (err) {}

      return newList
    })
  }, [])

  // Remove single item
  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      } catch (err) {}
      return filtered
    })
  }, [])

  return {
    items,
    isLoaded,
    saveProgress,
    removeItem
  }
}
