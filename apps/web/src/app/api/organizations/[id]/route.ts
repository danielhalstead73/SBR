import { NextRequest, NextResponse } from 'next/server'
import { organizationService } from '@sbr/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const organization = await organizationService.findOrganizationById(id)
    
    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        description: organization.description,
        address: organization.address,
        city: organization.city,
        state: organization.state,
        zipCode: organization.zipCode,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        logo: organization.logo,
        bannerImage: organization.bannerImage,
        socialLinks: organization.socialLinks,
        contactInfo: organization.contactInfo,
        latitude: organization.latitude,
        longitude: organization.longitude,
        allowMultiVenue: organization.allowMultiVenue,
        enableFollowers: organization.enableFollowers,
        enablePublicEvents: organization.enablePublicEvents,
        enableMessaging: organization.enableMessaging,
        followers: organization.followers,
        events: organization.events,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      }
    })
  } catch (error) {
    console.error('Failed to fetch organization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    )
  }
}
