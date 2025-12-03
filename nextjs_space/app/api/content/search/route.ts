
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') as 'movie' | 'tv'

    if (!query) {
      return NextResponse.json(
        { error: 'Query de busca é obrigatório' },
        { status: 400 }
      )
    }

    const results = await tmdbService.search(query, type)
    
    const contents = results.map((item: any) => {
      const contentType = item.media_type || type || (item.title ? 'movie' : 'tv')
      return tmdbService.convertToContentItem(item, contentType)
    })

    return NextResponse.json({ contents })

  } catch (error) {
    console.error('Error searching content:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conteúdo' },
      { status: 500 }
    )
  }
}
