
export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "StreamFlix - Sua plataforma de streaming",
  description: "Descubra e assista aos melhores filmes e séries. Uma experiência de streaming única e moderna.",
  keywords: "streaming, filmes, séries, entretenimento, netflix",
  authors: [{ name: "StreamFlix" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "StreamFlix - Sua plataforma de streaming",
    description: "Descubra e assista aos melhores filmes e séries. Uma experiência de streaming única e moderna.",
    url: "/",
    siteName: "StreamFlix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StreamFlix - Plataforma de Streaming",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamFlix - Sua plataforma de streaming",
    description: "Descubra e assista aos melhores filmes e séries",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
