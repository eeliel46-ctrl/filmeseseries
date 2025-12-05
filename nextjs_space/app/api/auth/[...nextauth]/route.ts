
export const dynamic = "force-dynamic"

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { headers } from 'next/headers'

// Dynamically get the base URL from headers for production deployments
function getBaseUrl(): string {
  // Check for explicit NEXTAUTH_URL first
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  // Try to get from headers (works in production)
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    if (host) {
      return `${protocol}://${host}`
    }
  } catch (e) {
    // Headers not available in this context
  }
  
  // Fallback for production Abacus.AI deployment
  return 'https://filmeseseries-online.abacusai.app'
}

// Set NEXTAUTH_URL if not set
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = getBaseUrl()
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
