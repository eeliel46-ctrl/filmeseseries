export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Comprehensive script that blocks all popups and proxies nested iframes recursively
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

  // --- 2. Override window.open to block popups ---
  window.open = function(url, target, features) {
    console.log('[PopupBlocker] window.open blocked:', url);
    return { close: function(){}, focus: function(){}, blur: function(){}, location: { href: '' } };
  };

  // --- 3. Block window.location changes targeting parent/top ---
  try {
    Object.defineProperty(window, 'top', { get: function() { return window; }, configurable: true });
    Object.defineProperty(window, 'parent', { get: function() { return window; }, configurable: true });
  } catch(e) {}

  // --- 4. Intercept all link clicks targeting external pages ---
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (el && el.tagName === 'A') {
      var target = el.getAttribute('target');
      var href = el.getAttribute('href') || '';
      if (target === '_blank' || target === '_top' || target === '_parent') {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[PopupBlocker] Link blocked:', href);
        return false;
      }
    }
  }, true);

  // --- 5. Intercept form submissions targeting external pages ---
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form && (form.target === '_blank' || form.target === '_top')) {
      e.preventDefault();
      console.log('[PopupBlocker] Form submit blocked');
    }
  }, true);

  // --- 6. Intercept iframe src setting to proxy nested iframes recursively ---
  var originalUrl = getOriginalUrl();
  
  // A. Property Setter
  var originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
  if (originalSrcDescriptor) {
    Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
      get: function() {
        return originalSrcDescriptor.get.call(this);
      },
      set: function(value) {
        if (value && typeof value === 'string') {
          // Resolve relative URLs using baseURI to make them absolute before check
          var absoluteUrl = value;
          try {
            absoluteUrl = new URL(value, this.baseURI || document.baseURI).href;
          } catch(e) {}
          
          if (absoluteUrl.startsWith('http') && !absoluteUrl.includes(window.location.host)) {
            console.log('[IframeInterceptor] Property src proxied:', absoluteUrl);
            value = '/api/player/proxy?url=' + encodeURIComponent(absoluteUrl) + '&referer=' + encodeURIComponent(originalUrl);
          }
        }
        originalSrcDescriptor.set.call(this, value);
      }
    });
  }

  // B. setAttribute Method
  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name && name.toLowerCase() === 'src' && this.tagName === 'IFRAME') {
      if (value && typeof value === 'string') {
        var absoluteUrl = value;
        try {
          absoluteUrl = new URL(value, this.baseURI || document.baseURI).href;
        } catch(e) {}

        if (absoluteUrl.startsWith('http') && !absoluteUrl.includes(window.location.host)) {
          console.log('[IframeInterceptor] Method setAttribute src proxied:', absoluteUrl);
          value = '/api/player/proxy?url=' + encodeURIComponent(absoluteUrl) + '&referer=' + encodeURIComponent(originalUrl);
        }
      }
    }
    return originalSetAttribute.call(this, name, value);
  };
})();
</script>
`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get('url')
    const refererParam = searchParams.get('referer')

    if (!targetUrl) {
      return new NextResponse('URL is required', { status: 400 })
    }

    // Determine the referer to use
    let referer = 'https://www.google.com/'
    if (refererParam) {
      referer = refererParam
    } else if (targetUrl.includes('streamsrcs.2embed.cc')) {
      referer = 'https://www.2embed.cc/'
    } else if (targetUrl.includes('lookmovie')) {
      referer = 'https://streamsrcs.2embed.cc/'
    }

    // Fetch the target URL from the server side (no Origin header)
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Referer': referer
      },
      responseType: 'text',
      timeout: 10000 // 10s timeout to avoid hanging
    })

    let html = response.data

    // 1. Remove known ad/popup scripts by domain patterns
    html = html.replace(/<script[^>]*src=['"]https?:\/\/[^'"]*forgivefireextinguisher[^'"]*['"][^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*src=['"]https?:\/\/[^'"]*popunder[^'"]*['"][^>]*><\/script>/gi, '')
    html = html.replace(/<script[^>]*src=['"]https?:\/\/[^'"]*\.php\?[^'"]*['"][^>]*><\/script>/gi, '')

    // 2. Bypass sandbox check in 2embed outer page
    html = html.replace('function isReallySandboxed()', 'function isReallySandboxed(){return false;} function _original_isReallySandboxed()')

    // 3. Inject base tag so relative links resolve correctly to original server
    const baseTag = `<base href="${targetUrl}">`

    // 4. Inject base tag and comprehensive blocker script right after <head>
    const injection = baseTag + COMPREHENSIVE_BLOCKER_SCRIPT
    if (html.includes('<head>')) {
      html = html.replace(/<head>/i, '<head>' + injection)
    } else if (html.includes('<html')) {
      html = html.replace(/<html[^>]*>/i, (m: string) => m + injection)
    } else {
      html = injection + html
    }

    // 5. Chain proxy for inner iframe src (streamsrcs.2embed.cc)
    html = html.replace(/data-src=["'](https?:\/\/streamsrcs\.2embed\.cc\/[^"']+)["']/gi, (match: string, p1: string) => {
      return `data-src="/api/player/proxy?url=${encodeURIComponent(p1)}&referer=${encodeURIComponent(targetUrl)}"`
    })
    html = html.replace(/src=["'](https?:\/\/streamsrcs\.2embed\.cc\/[^"']+)["']/gi, (match: string, p1: string) => {
      return `src="/api/player/proxy?url=${encodeURIComponent(p1)}&referer=${encodeURIComponent(targetUrl)}"`
    })

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
