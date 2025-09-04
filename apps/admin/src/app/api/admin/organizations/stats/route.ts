import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { organizationService } from '@sbr/database'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)

    if (!user || !authorize.isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const organizations = await organizationService.getAllOrganizations()

    const stats = {
      totalOrganizations: organizations.length,
      verifiedOrganizations: organizations.length, // All organizations are verified by default
      activeOrganizations: organizations.length, // All organizations are active by default
      organizationsWithVenues: organizations.filter(o => (o.venues?.length || 0) > 0).length,
      organizationsWithEvents: organizations.filter(o => (o.events?.length || 0) > 0).length,
      averageFollowers: organizations.length > 0 
        ? organizations.reduce((sum, org) => sum + (org.followers?.length || 0), 0) / organizations.length 
        : 0,
      recentOrganizations: organizations
        .filter(o => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return o.createdAt > thirtyDaysAgo
        })
        .length,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error fetching organization stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization stats' },
      { status: 500 }
    )
  }
}
