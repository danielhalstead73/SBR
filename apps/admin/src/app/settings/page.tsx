'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SystemSettings {
  bggSyncEnabled: boolean
  bggSyncInterval: number
  emailNotificationsEnabled: boolean
  maxFileUploadSize: number
  sessionTimeout: number
  maintenanceMode: boolean
  debugMode: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (updatedSettings: Partial<SystemSettings>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })
      if (response.ok) {
        await fetchSettings() // Refresh settings
        alert('Settings saved successfully')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleSetting = (key: keyof SystemSettings) => {
    if (!settings) return
    
    const updatedSettings = {
      ...settings,
      [key]: !settings[key]
    }
    setSettings(updatedSettings)
    handleSaveSettings({ [key]: updatedSettings[key] })
  }

  const handleNumberSetting = (key: keyof SystemSettings, value: number) => {
    if (!settings) return
    
    const updatedSettings = {
      ...settings,
      [key]: value
    }
    setSettings(updatedSettings)
    handleSaveSettings({ [key]: value })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">SBR Admin</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/users" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Users
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/games" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Games
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/sessions" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sessions
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/organizations" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/settings" className="flex items-center px-3 py-2 text-white bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>

        {settings && (
          <div className="space-y-6">
            {/* BGG Integration Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">BGG Integration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable BGG Sync</label>
                    <p className="text-sm text-gray-500">Automatically sync games from BoardGameGeek</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('bggSyncEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.bggSyncEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.bggSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Interval (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.bggSyncInterval}
                    onChange={(e) => handleNumberSetting('bggSyncInterval', parseInt(e.target.value))}
                    className="input-field max-w-xs"
                    disabled={!settings.bggSyncEnabled}
                  />
                  <p className="text-sm text-gray-500 mt-1">How often to sync with BGG (1-168 hours)</p>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Notifications</h2>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
                  <p className="text-sm text-gray-500">Send email notifications for system events</p>
                </div>
                <button
                  onClick={() => handleToggleSetting('emailNotificationsEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.emailNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* System Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => handleNumberSetting('maxFileUploadSize', parseInt(e.target.value))}
                    className="input-field max-w-xs"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum file size for uploads</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleNumberSetting('sessionTimeout', parseInt(e.target.value))}
                    className="input-field max-w-xs"
                  />
                  <p className="text-sm text-gray-500 mt-1">How long before sessions expire</p>
                </div>
              </div>
            </div>

            {/* System Mode Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Mode</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('maintenanceMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Debug Mode</label>
                    <p className="text-sm text-gray-500">Enable debug logging and features</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('debugMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                      settings.debugMode ? 'bg-yellow-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* System Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Actions</h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {/* TODO: Implement cache clear */}}
                    className="btn-secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Cache
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement database backup */}}
                    className="btn-secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Backup Database
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement system restart */}}
                    className="btn-danger"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restart System
                  </button>
                </div>
              </div>
            </div>

            {saving && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving settings...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
