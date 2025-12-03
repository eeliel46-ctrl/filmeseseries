
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { tmdbService } from '@/lib/services/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'movie' | 'tv' || 'movie'
    const timeWindow = searchParams.get('time') as 'day' | 'week' || 'week'

    const results = await tmdbService.getTrending(type, timeWindow)
    
    const contents = results.map((item: any) => 
      tmdbService.convertToContentItem(item, type)
    )

    return NextResponse.json({ contents })

  } catch (error) {
    console.error('Error fetching trending content:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conteúdo em alta' },
      { status: 500 }
    )
  }
}
