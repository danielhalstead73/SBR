import { NextRequest, NextResponse } from 'next/server'
import { followerService } from '@sbr/database'
import { auth } from '@sbr/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const follower = await followerService.followOrganization(user.id, id)
    
    return NextResponse.json({
      success: true,
      follower
    })
  } catch (error) {
    console.error('Failed to follow organization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to follow organization' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await followerService.unfollowOrganization(user.id, id)
    
    return NextResponse.json({
      success: true,
      message: 'Unfollowed successfully'
    })
  } catch (error) {
    console.error('Failed to unfollow organization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unfollow organization' },
      { status: 500 }
    )
  }
}
