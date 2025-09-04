import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@sbr/auth'
import { signupSchema } from '@sbr/shared'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)
    
    const result = await auth.register({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful. Check your email for verification.'
      })
    }
    
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 400 })
  }
}
