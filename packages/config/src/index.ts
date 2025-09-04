// Environment configuration
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  // Authentication
  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
    sessionDuration: process.env.SESSION_DURATION || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@sbr.com',
  },

  // Rate Limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
  },

  // App URLs
  urls: {
    web: process.env.WEB_URL || 'http://localhost:3000',
    admin: process.env.ADMIN_URL || 'http://localhost:3001',
    bggApi: process.env.BGG_API_URL || 'https://boardgamegeek.com/xmlapi2',
  },

  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

// Type-safe config access
export type Config = typeof config

// Validation function
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
  ]

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
    console.warn('Using default values. This is not recommended for production.')
  }
}

// Export default config
export default config
