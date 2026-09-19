export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Comprehensive stealth blocker script that neutralizes popups, ad overlays,
// and sandbox detection without breaking player functionality.
const COMPREHENSIVE_BLOCKER_SCRIPT = `
<script>
(function() {
  // --- 1. Helper to get original URL of this proxy page ---
  function getOriginalUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('url') || window.location.href;
    } catch(e) {
      return window.location.href;
    }
  }

  // --- 2. Stealth window.open mock that passes anti-adblock checks ---
  var fakeOpen = function(url, target, features) {
    console.log('[StealthBlocker] Blocked popup window.open:', url);
    return {
      closed: false,
      focus: function(){},
      blur: function(){},
      close: function(){},
      location: { href: '' },
      document: { write: function(){} }
    };
  };
  try {
    fakeOpen.toString = function() { return 'function open() { [native code] }'; };
    Object.defineProperty(window, 'open', {
      value: fakeOpen,
      writable: true,
      configurable: true
    });
  } catch(e) {
    window.open = fakeOpen;
  }

  // --- 3. Override devtools detection to prevent redirect loops ---
  window.devtoolsDetector = {
    addListener: function() {},
    removeListener: function() {},
    launch: function() {},
    lanuch: function() {},
    stop: function() {},
    isLaunch: false
  };

  // --- 3.1 Neutralize Notification / Geolocation permission spam prompts ---
  try {
    if (typeof window.Notification !== 'undefined') {
      window.Notification.requestPermission = function() {
        return Promise.resolve('denied');
      };
      Object.defineProperty(window.Notification, 'permission', {
        get: function() { return 'denied'; },
        configurable: true
      });
    }
  } catch(e) {}

  try {
    if (navigator.permissions && navigator.permissions.query) {
      var origQuery = navigator.permissions.query;
      navigator.permissions.query = function(params) {
        if (params && (params.name === 'notifications' || params.name === 'geolocation')) {
          return Promise.resolve({ state: 'denied', onchange: null });
        }
        return origQuery.call(navigator.permissions, params);
      };
    }
  } catch(e) {}

  // --- 4. Intercept all link clicks targeting new tabs or external windows ---
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (el && el.tagName === 'A') {
      var target = el.getAttribute('target');
      var href = el.getAttribute('href') || '';
      if (target === '_blank' || target === '_top' || target === '_parent') {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[StealthBlocker] Blocked new tab link click:', href);
        return false;
      }
    }
  }, true);

  // --- 5. Intercept form submissions targeting new tabs ---
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form && (form.target === '_blank' || form.target === '_top')) {
      e.preventDefault();
      console.log('[StealthBlocker] Blocked popup form submission');
    }
  }, true);

  // --- 6. Intercept iframe src setting to proxy nested iframes recursively ---
  var originalUrl = getOriginalUrl();
  
  var originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (originalSrcDescriptor) {
    Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
      get: function() {
        return originalSrcDescriptor.get.call(this);
      },
      set: function(value) {
        if (value && typeof value === 'string') {
          var absoluteUrl = value;
          try {
            absoluteUrl = new URL(value, this.baseURI || document.baseURI).href;
          } catch(e) {}
          
          if (absoluteUrl.startsWith('http') && !absoluteUrl.includes(window.location.host)) {
            console.log('[StealthBlocker] Proxied iframe src property:', absoluteUrl);
            value = '/api/player/proxy?url=' + encodeURIComponent(absoluteUrl) + '&referer=' + encodeURIComponent(originalUrl);
          }
        }
        originalSrcDescriptor.set.call(this, value);
      }
    });
  }

  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name && name.toLowerCase() === 'src' && this.tagName === 'IFRAME') {
      if (value && typeof value === 'string') {
        var absoluteUrl = value;
        try {
          absoluteUrl = new URL(value, this.baseURI || document.baseURI).href;
        } catch(e) {}

        if (absoluteUrl.startsWith('http') && !absoluteUrl.includes(window.location.host)) {
          console.log('[StealthBlocker] Proxied iframe setAttribute src:', absoluteUrl);
          value = '/api/player/proxy?url=' + encodeURIComponent(absoluteUrl) + '&referer=' + encodeURIComponent(originalUrl);
        }
      }
    }
    return originalSetAttribute.call(this, name, value);
  };

  // --- 7. Continuously dismantle transparent click overlays & ad queues ---
  function dismantleOverlays() {
    var badSelectors = ['#overlay', '#trigger', '.ad_overlay', '#sbxErr', '.sbx-err-container'];
    for (var i = 0; i < badSelectors.length; i++) {
      var el = document.querySelector(badSelectors[i]);
      if (el) {
        el.remove();
      }
    }
    if (window.urls && Array.isArray(window.urls) && window.urls.length > 0) {
      window.urls.length = 0;
    }
    if (window.track && typeof window.track === 'object') {
      window.track.window = 0;
    }
  }

  setInterval(dismantleOverlays, 200);
  document.addEventListener('DOMContentLoaded', dismantleOverlays);
  window.addEventListener('load', dismantleOverlays);
})();
</script>
<style>
  #overlay, #trigger, .ad_overlay, #sbxErr, .sbx-err-container {
    display: none !important;
    pointer-events: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    opacity: 0 !important;
  }
</style>
`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const targetUrl = searchParams.get('url') || searchParams.get('target')
    const refererParam = searchParams.get('referer')

    // --- CASE 1: AJAX / API Proxy Forwarder ---
    if (action === 'ajax' || action === 'api') {
      if (!targetUrl) {
        return new NextResponse(JSON.stringify({ error: 'Target URL required' }), { status: 400 })
      }

      // Ensure target URL points to correct AJAX endpoint
      let targetPath = targetUrl
      if (action === 'ajax' && !targetPath.includes('/ajax/') && !targetPath.includes('.php')) {
        targetPath = targetPath.replace(/\/?$/, '/ajax/get_stream_link')
      }
      const targetObj = new URL(targetPath)

      searchParams.forEach((value, key) => {
        if (key !== 'action' && key !== 'target' && key !== 'url' && key !== 'referer') {
          targetObj.searchParams.set(key, value)
        }
      })

      // Determine the target embed page URL for accurate server fallback
      let embedPageUrl: string | undefined = refererParam || undefined
      if (!embedPageUrl) {
        const reqReferer = request.headers.get('referer') || ''
        if (reqReferer.includes('url=')) {
          try {
            const parsed = new URL(reqReferer)
            embedPageUrl = parsed.searchParams.get('url') || undefined
          } catch(e) {}
        }
      }
      const referer = embedPageUrl || `${targetObj.origin}/`

      let data: any = null
      try {
        const ajaxRes = await axios.get(targetObj.toString(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': referer
          },
          responseType: 'json',
          timeout: 10000
        })
        data = ajaxRes.data
      } catch (err: any) {
        console.warn('Initial AJAX fetch failed:', err.message)
      }

      // If data returned unknown error (e.g. invalid server id '_default'), automatically resolve the real server ID from embed page
      if (!data || !data.success) {
        try {
          const pageRes = await axios.get(referer, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000
          })
          const serverMatches = [...pageRes.data.matchAll(/class=["'][^"']*server\b[^"']*["'][^>]*data-id=["']([^"']+)["']/g)]
          const realServerId = serverMatches.find(m => m[1] !== '_default')?.[1]
          if (realServerId) {
            targetObj.searchParams.set('id', realServerId)
            const retryRes = await axios.get(targetObj.toString(), {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': referer
              },
              responseType: 'json',
              timeout: 8000
            })
            data = retryRes.data
          }
        } catch (retryErr: any) {
          console.error('Retry server resolution error:', retryErr.message)
        }
      }

      // If response contains stream link, rewrite it through our proxy
      if (data && typeof data === 'object') {
        if (data.data && data.data.link && typeof data.data.link === 'string') {
          data.data.link = `/api/player/proxy?url=${encodeURIComponent(data.data.link)}&referer=${encodeURIComponent(targetObj.origin + '/')}`
        }
        if (data.data && data.data.video_url && typeof data.data.video_url === 'string') {
          data.data.video_url = `/api/player/proxy?url=${encodeURIComponent(data.data.video_url)}&referer=${encodeURIComponent(targetObj.origin + '/')}`
        }
      }

      return NextResponse.json(data || { success: false, error: 'Unable to resolve stream' }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        }
      })
    }

    // --- CASE 2: HTML Embed Player Proxy ---
    if (!targetUrl) {
      return new NextResponse('URL is required', { status: 400 })
    }

    // Determine the referer to use
    let referer = 'https://www.google.com/'
    if (refererParam) {
      referer = refererParam
    } else if (targetUrl.includes('embedplayapi.top')) {
      referer = 'https://embedplayapi.top/'
    } else if (targetUrl.includes('embedplay.one')) {
      referer = 'https://embedplayapi.top/'
    } else if (targetUrl.includes('embedplayabyss.top')) {
      referer = 'https://www.embedplay.one/'
    } else if (targetUrl.includes('abysscdn.com')) {
      referer = 'https://embedplayabyss.top/'
    } else if (targetUrl.includes('playerflixapi.com')) {
      referer = 'https://playerflixapi.com/'
    } else if (targetUrl.includes('streamsrcs.2embed.cc')) {
      referer = 'https://www.2embed.cc/'
    } else if (targetUrl.includes('lookmovie')) {
      referer = 'https://streamsrcs.2embed.cc/'
    }

    // Fetch the target URL server-side
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Referer': referer
      },
      responseType: 'text',
      timeout: 10000
    })

    let html = response.data

    // 1. Remove disable-devtool to permit seamless operation
    html = html.replace(/<script[^>]*disable-devtool[^>]*><\/script>/gi, '')

    // 2. Remove known ad networks & popunder script tags
    html = html.replace(/<script[^>]*src=['"][^'"]*sinonneurism[^'"]*['"][^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*src=['"][^'"]*forgivefireextinguisher[^'"]*['"][^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*src=['"][^'"]*popunder[^'"]*['"][^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*src=['"][^'"]*\.php\?[^'"]*['"][^>]*><\/script>/gi, '')

    // 3. Remove inline ad loaders (_paq, Monetag, etc.) safely without spanning multiple scripts
    html = html.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?_paq[\s\S]*?<\/script>/gi, '')
    html = html.replace(/var\s+win\s*=\s*window\.open\([^)]*\);?/gi, '// blocked win')

    // 4. Neutralize EmbedPlay domain tracker / localhost blocker safely
    html = html.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?_0x4a4bee[\s\S]*?<\/script>/gi, '')
    html = html.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?ACESSO\s+NÃO[\s\S]*?<\/script>/gi, '')

    // 5. Rewrite BASE_URL in EmbedPlay to route AJAX get_stream_link via this proxy
    html = html.replace(
      /const\s+BASE_URL\s*=\s*['"][^'"]*['"]\s*;?/gi,
      `const BASE_URL = '/api/player/proxy?action=ajax&target=https://embedplayapi.top/';`
    )

    // 6. Rewrite HOME_URL in embedplay.one to route getPlayer API via this proxy
    html = html.replace(
      /var\s+HOME_URL\s*=\s*['"][^'"]*['"]\s*;?/gi,
      `var HOME_URL = '/api/player/proxy?action=api&target=https://www.embedplay.one';`
    )

    // 7. Neutralize Abyss CDN anti-sandbox & popups
    html = html.replace(/var\s+urls\s*=\s*\[[^\]]*\]/gi, 'var urls = []')
    html = html.replace(/if\s*\(\s*track\.window\s*>=\s*2\s*\)/gi, 'if (false)')
    html = html.replace(/loadScript\(['"][^'"]*fuckadblock[^'"]*['"]\)/gi, 'Promise.resolve(true)')
    html = html.replace(/<div\s+id=["']overlay["'][^>]*><\/div>/gi, '')
    html = html.replace(/<div\s+id=["']trigger["'][^>]*><\/div>/gi, '')

    // 8. Bypass sandbox check in 2embed outer page completely
    html = html.replace(/function\s+isReallySandboxed\s*\(\s*\)/g, 'function isReallySandboxed(){return false;} function _orig_isReallySandboxed()')
    html = html.replace(/isReallySandboxed\(\)/g, 'false')

    // 9. Inject base tag and stealth blocker script right after <head>
    const baseTag = `<base href="${targetUrl}">`
    const injection = baseTag + COMPREHENSIVE_BLOCKER_SCRIPT
    if (html.includes('<head>')) {
      html = html.replace(/<head>/i, '<head>' + injection)
    } else if (html.includes('<html')) {
      html = html.replace(/<html[^>]*>/i, (m: string) => m + injection)
    } else {
      html = injection + html
    }

    // 10. Chain proxy for inner iframe sources
    html = html.replace(/data-src=["'](https?:\/\/streamsrcs\.2embed\.cc\/[^"']+)["']/gi, (match: string, p1: string) => {
      return `data-src="/api/player/proxy?url=${encodeURIComponent(p1)}&referer=${encodeURIComponent(targetUrl)}"`
    })
    html = html.replace(/src=["'](https?:\/\/streamsrcs\.2embed\.cc\/[^"']+)["']/gi, (match: string, p1: string) => {
      return `src="/api/player/proxy?url=${encodeURIComponent(p1)}&referer=${encodeURIComponent(targetUrl)}"`
    })
    html = html.replace(/src=["'](https?:\/\/abysscdn\.com\/[^"']+)["']/gi, (match: string, p1: string) => {
      return `src="/api/player/proxy?url=${encodeURIComponent(p1)}&referer=${encodeURIComponent(targetUrl)}"`
    })

    // 11. Inject auto-start script to guarantee instant stream start
    const autoPlayScript = `
    <script>
      (function() {
        function triggerPlayer() {
          try {
            var realServer = document.querySelector('.server[data-id]:not([data-id="_default"])');
            if (realServer && typeof Player !== 'undefined' && Player.play) {
              Player.play(false, realServer);
            }
          } catch(e) {}
        }
        document.addEventListener('DOMContentLoaded', triggerPlayer);
        setTimeout(triggerPlayer, 200);
        setTimeout(triggerPlayer, 600);
      })();
    </script>
    `
    if (html.includes('</body>')) {
      html = html.replace('</body>', autoPlayScript + '</body>')
    } else {
      html = html + autoPlayScript
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store'
      }
    })

  } catch (error: any) {
    console.error('Proxy error:', error)
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url') || searchParams.get('target')
    const refererParam = searchParams.get('referer')

    if (!targetUrl) {
      return new NextResponse(JSON.stringify({ error: 'Target URL required' }), { status: 400 })
    }

    const contentType = request.headers.get('content-type') || 'application/x-www-form-urlencoded'
    const bodyText = await request.text()

    const targetObj = new URL(targetUrl)
    const fullTarget = targetObj.pathname.endsWith('/api') ? targetObj.toString() : `${targetObj.origin}/api`
    const referer = refererParam || `${targetObj.origin}/`

    const response = await axios.post(fullTarget, bodyText, {
      headers: {
        'Content-Type': contentType,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': referer
      },
      responseType: 'json',
      timeout: 10000
    })

    const data = response.data
    if (data && typeof data === 'object') {
      if (data.data && data.data.video_url && typeof data.data.video_url === 'string') {
        data.data.video_url = `/api/player/proxy?url=${encodeURIComponent(data.data.video_url)}&referer=${encodeURIComponent(targetObj.origin + '/')}`
      }
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
      }
    })
  } catch (error: any) {
    console.error('Proxy POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
    }
  })
}
