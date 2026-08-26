
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: 'desc' }
    })

    return NextResponse.json({ favorites })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { contentId, contentType, title, poster, year, rating } = await request.json()

    if (!contentId || !contentType || !title) {
      return NextResponse.json(
        { error: 'Dados obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Check if already in favorites
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Já está na lista de favoritos' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        contentId,
        contentType,
        title,
        poster,
        year,
        rating
      }
    })

    return NextResponse.json({ favorite })

  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
