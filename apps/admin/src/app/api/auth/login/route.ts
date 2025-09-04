import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { loginSchema } from '@sbr/shared'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    const result = await auth.login(validatedData.email, validatedData.password)
    
    if (result.success && result.token && result.user) {
      // Check if user has admin privileges
      if (!authorize.isAdmin(result.user)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Access denied. Admin privileges required.' 
        }, { status: 403 })
      }
      
      const response = NextResponse.json({
        success: true,
        user: result.user
      })
      
      response.cookies.set('sbr-session', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      })
      
      return response
    }
    
    return NextResponse.json({ success: false, error: result.error }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
