'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BoardGame {
  id: string
  bggId: number
  name: string
  description: string
  image: string
  thumbnail: string
  minPlayers: number
  maxPlayers: number
  playingTime: number
  minAge: number
  categories: string
  mechanics: string
  designers: string
  publishers: string
  yearPublished: number
  complexity: number
  rating: number
  createdAt: string
  updatedAt: string
}

interface GameStats {
  totalGames: number
  syncedGames: number
  pendingSync: number
  lastSyncDate?: string
}

interface SyncHistory {
  id: string
  type: string
  status: string
  gamesProcessed: number
  gamesAdded: number
  gamesUpdated: number
  startedAt: string
  completedAt?: string
  error?: string
}

export default function GamesPage() {
  const [games, setGames] = useState<BoardGame[]>([])
  const [stats, setStats] = useState<GameStats | null>(null)
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null)
  const [showGameDetails, setShowGameDetails] = useState(false)
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState('')

  useEffect(() => {
    fetchGames()
    fetchGameStats()
    fetchSyncHistory()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/admin/games')
      if (response.ok) {
        const data = await response.json()
        setGames(data.games)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGameStats = async () => {
    try {
      const response = await fetch('/api/admin/games/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching game stats:', error)
    }
  }

  const fetchSyncHistory = async () => {
    try {
      const response = await fetch('/api/admin/games/sync-history')
      if (response.ok) {
        const data = await response.json()
        setSyncHistory(data.history)
      }
    } catch (error) {
      console.error('Error fetching sync history:', error)
    }
  }

  const handleManualSync = async () => {
    setSyncInProgress(true)
    setSyncProgress(0)
    setSyncStatus('Starting manual sync...')

    try {
      const response = await fetch('/api/admin/games/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual' })
      })

      if (response.ok) {
        const data = await response.json()
        setSyncStatus('Sync completed successfully!')
        setTimeout(() => {
          fetchGames()
          fetchGameStats()
          fetchSyncHistory()
          setSyncInProgress(false)
          setSyncProgress(0)
          setSyncStatus('')
        }, 2000)
      } else {
        setSyncStatus('Sync failed. Please try again.')
        setTimeout(() => {
          setSyncInProgress(false)
          setSyncProgress(0)
          setSyncStatus('')
        }, 3000)
      }
    } catch (error) {
      console.error('Error during sync:', error)
      setSyncStatus('Sync failed. Please try again.')
      setTimeout(() => {
        setSyncInProgress(false)
        setSyncProgress(0)
        setSyncStatus('')
      }, 3000)
    }
  }

  const handleFullSync = async () => {
    if (!confirm('This will perform a full sync of all BGG games. This may take a long time. Continue?')) {
      return
    }

    setSyncInProgress(true)
    setSyncProgress(0)
    setSyncStatus('Starting full sync...')

    try {
      const response = await fetch('/api/admin/games/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'full' })
      })

      if (response.ok) {
        const data = await response.json()
        setSyncStatus('Full sync completed successfully!')
        setTimeout(() => {
          fetchGames()
          fetchGameStats()
          fetchSyncHistory()
          setSyncInProgress(false)
          setSyncProgress(0)
          setSyncStatus('')
        }, 2000)
      } else {
        setSyncStatus('Full sync failed. Please try again.')
        setTimeout(() => {
          setSyncInProgress(false)
          setSyncProgress(0)
          setSyncStatus('')
        }, 3000)
      }
    } catch (error) {
      console.error('Error during full sync:', error)
      setSyncStatus('Full sync failed. Please try again.')
      setTimeout(() => {
        setSyncInProgress(false)
        setSyncProgress(0)
        setSyncStatus('')
      }, 3000)
    }
  }

  const handleSearchBGG = async (query: string) => {
    if (!query.trim()) return

    try {
      const response = await fetch(`/api/admin/games/search-bgg?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        // Handle search results - you can implement a modal or dropdown to show results
        console.log('BGG search results:', data)
      }
    } catch (error) {
      console.error('Error searching BGG:', error)
    }
  }

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.categories.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.mechanics.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <Link href="/games" className="flex items-center px-3 py-2 text-white bg-gray-700 rounded-lg">
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
            <Link href="/settings" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
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
          <h1 className="text-3xl font-bold text-gray-900">Game Management</h1>
          <p className="text-gray-600">Manage board games, sync with BGG, and view game statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalGames || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Synced Games</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.syncedGames || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Sync</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingSync || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-sm font-semibold text-gray-900">
                  {stats?.lastSyncDate ? new Date(stats.lastSyncDate).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">BGG Sync Controls</h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleManualSync}
              disabled={syncInProgress}
              className="btn-primary disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Manual Sync
            </button>
            <button
              onClick={handleFullSync}
              disabled={syncInProgress}
              className="btn-secondary disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Full Sync
            </button>
            <button
              onClick={() => {/* TODO: Implement scheduled sync setup */}}
              className="btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Setup Scheduled Sync
            </button>
          </div>
          
          {syncInProgress && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{syncStatus}</span>
                <span className="text-sm text-gray-500">{syncProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Actions */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search games by name, description, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {/* TODO: Implement BGG search modal */}}
                className="btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search BGG
              </button>
            </div>
          </div>
        </div>

        {/* Games Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Players
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {game.thumbnail ? (
                            <img className="h-12 w-12 rounded-lg object-cover" src={game.thumbnail} alt={game.name} />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{game.name}</div>
                          <div className="text-sm text-gray-500">
                            {game.categories ? JSON.parse(game.categories).slice(0, 2).join(', ') : 'No categories'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {game.minPlayers}-{game.maxPlayers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{game.rating?.toFixed(1) || 'N/A'}</span>
                        {game.rating && (
                          <div className="ml-2 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(game.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {game.yearPublished || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedGame(game)
                            setShowGameDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {/* TODO: Implement edit game */}}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {/* TODO: Implement game statistics */}}
                          className="text-green-600 hover:text-green-900"
                        >
                          Stats
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sync History */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sync History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games Processed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncHistory.map((sync) => (
                  <tr key={sync.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sync.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sync.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sync.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sync.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sync.gamesProcessed} (Added: {sync.gamesAdded}, Updated: {sync.gamesUpdated})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sync.startedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sync.completedAt ? new Date(sync.completedAt).toLocaleString() : 'In Progress'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
