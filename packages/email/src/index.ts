import nodemailer from 'nodemailer'
import { config } from '@sbr/config'

// Email service interface
export interface EmailService {
  sendVerificationEmail(to: string, name: string, token: string): Promise<void>
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<void>
  sendWelcomeEmail(to: string, name: string): Promise<void>
}

// Email templates
const emailTemplates = {
  verification: (name: string, token: string) => ({
    subject: 'Verify your SBR account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to SBR!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with SBR. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.urls.web}/verify-email?token=${token}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">
          ${config.urls.web}/verify-email?token=${token}
        </p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with SBR, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          SBR - Social Board Gaming<br>
          Connect with board game enthusiasts and discover new games
        </p>
      </div>
    `,
    text: `
      Welcome to SBR!
      
      Hi ${name},
      
      Thank you for creating an account with SBR. To complete your registration, please verify your email address by visiting this link:
      
      ${config.urls.web}/verify-email?token=${token}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with SBR, you can safely ignore this email.
      
      SBR - Social Board Gaming
      Connect with board game enthusiasts and discover new games
    `
  }),

  passwordReset: (name: string, token: string) => ({
    subject: 'Reset your SBR password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password for your SBR account. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.urls.web}/reset-password?token=${token}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">
          ${config.urls.web}/reset-password?token=${token}
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          SBR - Social Board Gaming<br>
          Connect with board game enthusiasts and discover new games
        </p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hi ${name},
      
      We received a request to reset your password for your SBR account. Visit this link to create a new password:
      
      ${config.urls.web}/reset-password?token=${token}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      SBR - Social Board Gaming
      Connect with board game enthusiasts and discover new games
    `
  }),

  welcome: (name: string) => ({
    subject: 'Welcome to SBR!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to SBR!</h1>
        <p>Hi ${name},</p>
        <p>Welcome to SBR - your new home for board gaming! We're excited to have you join our community of board game enthusiasts.</p>
        <p>Here's what you can do with SBR:</p>
        <ul>
          <li>Discover new board games and read reviews</li>
          <li>Track your gaming sessions and scores</li>
          <li>Connect with other players in your area</li>
          <li>Join gaming groups and organizations</li>
          <li>Share your gaming experiences</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.urls.web}/dashboard" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
        <p>Happy gaming!</p>
        <p>The SBR Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          SBR - Social Board Gaming<br>
          Connect with board game enthusiasts and discover new games
        </p>
      </div>
    `,
    text: `
      Welcome to SBR!
      
      Hi ${name},
      
      Welcome to SBR - your new home for board gaming! We're excited to have you join our community of board game enthusiasts.
      
      Here's what you can do with SBR:
      - Discover new board games and read reviews
      - Track your gaming sessions and scores
      - Connect with other players in your area
      - Join gaming groups and organizations
      - Share your gaming experiences
      
      Get started: ${config.urls.web}/dashboard
      
      If you have any questions or need help getting started, feel free to reach out to our support team.
      
      Happy gaming!
      
      The SBR Team
      
      SBR - Social Board Gaming
      Connect with board game enthusiasts and discover new games
    `
  })
}

// Email service implementation
export class EmailService implements EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    })
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const template = emailTemplates.verification(name, token)
    
    await this.transporter.sendMail({
      from: config.email.from,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const template = emailTemplates.passwordReset(name, token)
    
    await this.transporter.sendMail({
      from: config.email.from,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const template = emailTemplates.welcome(name)
    
    await this.transporter.sendMail({
      from: config.email.from,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Convenience functions
export const sendVerificationEmail = (to: string, name: string, token: string) =>
  emailService.sendVerificationEmail(to, name, token)

export const sendPasswordResetEmail = (to: string, name: string, token: string) =>
  emailService.sendPasswordResetEmail(to, name, token)

export const sendWelcomeEmail = (to: string, name: string) =>
  emailService.sendWelcomeEmail(to, name)
