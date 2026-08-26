import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    const type = searchParams.get('type')
    const season = searchParams.get('season')
    const episode = searchParams.get('episode')

    if (!tmdbId || !type) {
      return NextResponse.json(
        { error: 'tmdbId and type are required' },
        { status: 400 }
      )
    }

    let apiUrl = ''
    if (type === 'movie') {
      apiUrl = `https://dioneyflix.notiffly.com.br/api/player/movie/${tmdbId}`
    } else {
      apiUrl = `https://dioneyflix.notiffly.com.br/api/player/tv/${tmdbId}/${season || 1}/${episode || 1}`
    }

    console.log('[VIP Proxy API] Fetching from DioneyFlix:', apiUrl)

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[VIP Proxy API] Error:', error.message)
    const status = error.response?.status || 500
    const message = error.response?.data?.error || 'Failed to fetch player data'
    return NextResponse.json({ error: message }, { status })
  }
}
