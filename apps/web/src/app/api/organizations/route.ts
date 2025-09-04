import { NextResponse } from 'next/server'
import { organizationService } from '@sbr/database'

export async function GET() {
  try {
    const organizations = await organizationService.getAllOrganizations()
    
    return NextResponse.json({
      success: true,
      organizations: organizations.map(org => ({
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
        allowMultiVenue: org.allowMultiVenue,
        enableFollowers: org.enableFollowers,
        enablePublicEvents: org.enablePublicEvents,
        enableMessaging: org.enableMessaging,
        followers: org.followers,
        events: org.events,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      }))
    })
  } catch (error) {
    console.error('Failed to fetch organizations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}
