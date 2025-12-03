
import { NextResponse } from 'next/server'
import { superflixService } from '@/lib/services/superflix'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const calendarData = await superflixService.getCalendarData()
    
    return NextResponse.json({
      success: true,
      data: calendarData
    })
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch calendar data' 
      },
      { status: 500 }
    )
  }
}
