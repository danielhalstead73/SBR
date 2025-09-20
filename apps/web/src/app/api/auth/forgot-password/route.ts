import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@sbr/auth'
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
    const user = await auth.getUserByEmail(email)
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate password reset token
    const resetToken = await auth.generatePasswordResetToken(user.id)
    
    // Create reset URL
    const resetUrl = `${config.urls.web}/reset-password?token=${resetToken}`
    
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
