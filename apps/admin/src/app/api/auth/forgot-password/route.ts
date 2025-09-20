import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@sbr/database'
import { config } from '@sbr/config'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await userService.findUserByEmail(email)
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Check if user has admin privileges
    if (user.role !== 'super_admin' && user.role !== 'venue_admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Generate a simple reset token (in a real app, this would be more secure)
    const resetToken = Buffer.from(`${user.id}-${Date.now()}`).toString('base64')
    
    // Create reset URL
    const resetUrl = `${config.urls.admin}/reset-password?token=${resetToken}`
    
    // In a real application, you would send an email here
    // For now, we'll just log the reset URL for development
    console.log(`Password reset URL for ${email}: ${resetUrl}`)
    
    // TODO: Implement actual email sending
    // await emailService.sendPasswordResetEmail(user.email, resetUrl)
    
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
