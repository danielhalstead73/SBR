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

    const formattedOrganizations = organizations.map(org => ({
      id: org.id,
      name: org.name,
      description: org.description,
      address: org.address,
      city: org.city,
      state: org.state,
      zipCode: org.zipCode,
      phone: org.phone,
      email: org.email,
      website: org.website,
      logo: org.logo,
      bannerImage: org.bannerImage,
      socialLinks: org.socialLinks,
      contactInfo: org.contactInfo,
      latitude: org.latitude,
      longitude: org.longitude,
      isVerified: true, // Default since isVerified field doesn't exist in schema
      isActive: true, // Default since isActive field doesn't exist in schema
      totalUsers: org.users?.length || 0,
      totalVenues: org.venues?.length || 0,
      totalEvents: org.events?.length || 0,
      totalFollowers: org.followers?.length || 0,
      createdAt: org.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      organizations: formattedOrganizations,
    })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}
