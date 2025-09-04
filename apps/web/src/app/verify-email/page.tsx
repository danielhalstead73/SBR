'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.')
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Verify your email
          </h2>
          <p className="text-gray-600">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg ${
            message.includes('sent') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Didn't receive the email?
          </h3>
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Back to login
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Make sure to check your spam folder if you don't see the email in your inbox.</p>
        </div>
      </div>
    </div>
  )
}
