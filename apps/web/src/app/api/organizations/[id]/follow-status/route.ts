import { NextRequest, NextResponse } from 'next/server'
import { followerService } from '@sbr/database'
import { auth } from '@sbr/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({
        success: true,
        isFollowing: false
      })
    }

    const user = await auth.getUserByToken(sessionToken)
    if (!user) {
      return NextResponse.json({
        success: true,
        isFollowing: false
      })
    }

    const isFollowing = await followerService.isFollowing(user.id, id)
    
    return NextResponse.json({
      success: true,
      isFollowing
    })
  } catch (error) {
    console.error('Failed to check follow status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check follow status' },
      { status: 500 }
    )
  }
}
