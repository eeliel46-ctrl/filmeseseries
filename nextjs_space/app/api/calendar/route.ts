export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { superflixService } from '@/lib/services/superflix'

export async function GET() {
  try {
    const calendarData = await superflixService.getCalendarData()
    
    return NextResponse.json({
      success: true,
      data: calendarData || []
    })
  } catch (error: any) {
    console.error('Error fetching calendar data:', error?.message)
    return NextResponse.json(
      { 
        success: true, 
        data: [] 
      },
      { status: 200 }
    )
  }
}
