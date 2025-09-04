import { sessionService, userService } from '@sbr/database'
import { UserDTO, Role } from '@sbr/shared'
import { emailService } from '@sbr/email'

interface AuthUser extends UserDTO {
  sessionToken?: string
}

export const auth = {
  async login(email: string, password: string): Promise<{ 
    success: boolean
    user?: AuthUser
    token?: string
    error?: string 
  }> {
    try {
      const user = await userService.findUserByEmail(email)
      
      if (!user || !await userService.validatePassword(password, user.password)) {
        return { success: false, error: 'Invalid email or password' }
      }

      if (!user.emailVerified) {
        return { success: false, error: 'Please verify your email address' }
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)
      
      const session = await sessionService.createSession(user.id, expiresAt)
      
      return { 
        success: true, 
        user: user as AuthUser, 
        token: session.token 
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  },

  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const existingUser = await userService.findUserByEmail(data.email)
      if (existingUser) {
        return { success: false, error: 'Email already exists' }
      }

      const user = await userService.createUser(data)
      
      if (user.emailVerifyToken) {
        await emailService.sendVerificationEmail(
          user.email,
          user.firstName,
          user.emailVerifyToken
        )
      }

      return { success: true, user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed' }
    }
  },

  async getUserByToken(token: string): Promise<AuthUser | null> {
    try {
      const session = await sessionService.findSessionByToken(token)
      
      if (!session || session.expiresAt < new Date()) {
        if (session) await sessionService.deleteSession(token)
        return null
      }

      return session.user as AuthUser
    } catch (error) {
      return null
    }
  },

  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await userService.verifyEmail(token)
      if (!user) return { success: false, error: 'Invalid token' }
      
      await emailService.sendWelcomeEmail(user.email, user.firstName)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Verification failed' }
    }
  },
}

export const authorize = {
  isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'super_admin' || user?.role === 'venue_admin'
  },
  
  isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === 'super_admin'
  },
}

export { Role }