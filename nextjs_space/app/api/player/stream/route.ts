import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
      return new NextResponse('URL parameter is required', { status: 400 })
    }

    console.log('[Stream Proxy] Fetching target URL:', targetUrl)

    // Fetch from target server using native fetch
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://dioneyflix.notiffly.com.br/',
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'no body')
      console.error(`[Stream Proxy] Target server returned status ${response.status}. Body: ${errorText}`)
      return new NextResponse(`Target server returned status ${response.status}. Body: ${errorText}`, {
        status: response.status,
      })
    }

    const contentType = response.headers.get('content-type') || ''

    // Check if it is a playlist
    const isPlaylist =
      contentType.includes('mpegurl') ||
      contentType.includes('application/x-mpegURL') ||
      targetUrl.includes('.m3u8') ||
      targetUrl.includes('.txt')

    if (isPlaylist) {
      const playlistText = await response.text()
      const lines = playlistText.split('\n')

      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim()
        if (trimmed.length === 0) return line

        // Case A: Metadata tag with URI parameter (like audio tracks)
        if (trimmed.startsWith('#')) {
          if (trimmed.includes('URI=')) {
            return trimmed.replace(/URI=["']([^"']+)["']/g, (match, p1) => {
              let absoluteUri = p1
              if (p1.startsWith('/')) {
                absoluteUri = `https://dioneyflix.notiffly.com.br${p1}`
              } else if (!p1.startsWith('http')) {
                const parentDir = targetUrl.substring(
                  0,
                  targetUrl.lastIndexOf('/')
                )
                absoluteUri = `${parentDir}/${p1}`
              }
              const proxyUrl = `/api/player/stream?url=${encodeURIComponent(
                absoluteUri
              )}`
              return `URI="${proxyUrl}"`
            })
          }
          return line
        }

        // Case B: Direct stream / segment / subtitle URI
        let absoluteSegmentUrl = trimmed
        if (trimmed.startsWith('/')) {
          absoluteSegmentUrl = `https://dioneyflix.notiffly.com.br${trimmed}`
        } else if (!trimmed.startsWith('http')) {
          const parentDir = targetUrl.substring(0, targetUrl.lastIndexOf('/'))
          absoluteSegmentUrl = `${parentDir}/${trimmed}`
        }

        return `/api/player/stream?url=${encodeURIComponent(absoluteSegmentUrl)}`
      })

      const rewrittenPlaylist = rewrittenLines.join('\n')

      return new NextResponse(rewrittenPlaylist, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store',
        },
      })
    }

    // Case C: Binary file stream (.ts segment)
    const headers = new Headers()
    headers.set('Content-Type', contentType)

    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    const acceptRanges = response.headers.get('accept-ranges')
    if (acceptRanges) {
      headers.set('Accept-Ranges', acceptRanges)
    }

    headers.set('Access-Control-Allow-Origin', '*')

    // Return the response body stream directly
    return new NextResponse(response.body, {
      headers,
    })
  } catch (error: any) {
    console.error('[Stream Proxy] Error:', error.message)
    return new NextResponse(`Stream proxy error: ${error.message}`, {
      status: 500,
    })
  }
}
