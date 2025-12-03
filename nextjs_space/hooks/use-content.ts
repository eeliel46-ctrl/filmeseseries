
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ContentItem } from '@/lib/types'

interface UseContentOptions {
  endpoint: string
  params?: Record<string, string>
}

export function useContent({ endpoint, params = {} }: UseContentOptions) {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams(params)
      const url = `${endpoint}${searchParams.toString() ? `?${searchParams}` : ''}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setContents(data.contents || [])
      } else {
        setError(data.error || 'Erro ao carregar conteúdo')
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setError('Erro ao carregar conteúdo')
    } finally {
      setLoading(false)
    }
  }, [endpoint, JSON.stringify(params)])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return {
    contents,
    loading,
    error,
    refetch: fetchContent
  }
}
