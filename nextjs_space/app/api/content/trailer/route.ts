import { NextResponse } from 'next/server';
import axios from 'axios';

const DIONEYFLIX_BASE_URL = 'https://dioneyflix.notiffly.com.br/api';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  const type = searchParams.get('type') || 'movie';

  if (!tmdbId) {
    return NextResponse.json({ error: 'Missing tmdbId' }, { status: 400 });
  }

  // Map types to DioneyFlix endpoints
  const endpoint = type === 'tv' || type === 'series' || type === 'show' ? 'tv' : 'movie';

  try {
    // 1. Try DioneyFlix Details API (highly reliable, returns BR/PT trailers)
    try {
      const url = `${DIONEYFLIX_BASE_URL}/media/${endpoint}/${tmdbId}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 5000
      });
      
      const data = response.data;
      if (data.trailer) {
        return NextResponse.json({ trailer: { youtube_video_id: data.trailer } });
      }

      // Check the videos array if trailer is null
      if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        const trailer = data.videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || 
                        data.videos.find((v: any) => v.site === 'YouTube');
        if (trailer?.key) {
          return NextResponse.json({ trailer: { youtube_video_id: trailer.key } });
        }
      }
    } catch (err: any) {
      console.warn('[TRAILER_PROXY] DioneyFlix fetch failed:', err.message);
    }

    // 2. Fallback to TMDB videos API if the key is available
    const DEFAULT_TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
    const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || DEFAULT_TMDB_API_KEY;
    const isKeyValid = apiKey !== '' && !apiKey.includes('your_tmdb_api_key_here');
    
    if (isKeyValid) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${tmdbId}/videos`, {
          params: { api_key: apiKey, language: 'pt-BR' },
          timeout: 4000
        });
        
        let videos = response.data.results || [];
        let trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || 
                      videos.find((v: any) => v.site === 'YouTube');
        
        if (!trailer) {
          // Retry without language filter (defaults to English)
          const fallbackResponse = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${tmdbId}/videos`, {
            params: { api_key: apiKey },
            timeout: 4000
          });
          videos = fallbackResponse.data.results || [];
          trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || 
                    videos.find((v: any) => v.site === 'YouTube');
        }

        if (trailer?.key) {
          return NextResponse.json({ trailer: { youtube_video_id: trailer.key } });
        }
      } catch (err: any) {
        console.warn('[TRAILER_PROXY] TMDB fetch failed:', err.message);
      }
    }

    // 3. Second Fallback to Kinocheck API (public)
    try {
      const kinocheckEndpoint = endpoint === 'tv' ? 'shows' : 'movies';
      const kResponse = await fetch(`https://api.kinocheck.com/${kinocheckEndpoint}?tmdb_id=${tmdbId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (kResponse.ok) {
        const kData = await kResponse.json();
        if (kData.trailer?.youtube_video_id) {
          return NextResponse.json(kData);
        }
      }
    } catch (err: any) {
      console.warn('[TRAILER_PROXY] Kinocheck fallback failed:', err.message);
    }

    return NextResponse.json({ trailer: null });
  } catch (error: any) {
    console.error('[TRAILER_ROUTE_ERROR]', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
