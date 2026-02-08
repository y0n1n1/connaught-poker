'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

type User = {
  id: string
  displayName: string
  username: string
}

export default function CreateGamePage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [gameDate, setGameDate] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [generateJoinCode, setGenerateJoinCode] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchUsers()
  }, [user, router])

  useEffect(() => {
    // Set default date to now
    const now = new Date()
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setGameDate(localDate)
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, displayName, username')
      .order('displayName')

    if (error) {
      console.error('Error fetching users:', error)
      return
    }

    setAllUsers(data as User[])
  }

  const togglePlayer = (userId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setError('')
    setLoading(true)

    try {
      // Create game
      const gameData = {
        id: crypto.randomUUID(),
        gameDate: new Date(gameDate).toISOString(),
        hostId: profile.id,
        joinCode: generateJoinCode ? generateCode() : null,
        notes: notes.trim() || null,
        status: 'UPCOMING' as const,
      }

      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

      if (gameError) throw gameError

      // Add host as a player
      if (!selectedPlayers.includes(profile.id)) {
        selectedPlayers.push(profile.id)
      }

      router.push(`/games/${game.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
        <div className="luxury-card p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">🃏</div>
            <h1 className="text-2xl font-bold text-white">Create New Game</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Game Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Date & Time
              </label>
              <input
                type="datetime-local"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Friday night home game, $50 buyin..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Generate Join Code */}
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-[#1a1f26] border border-[#2d3748]">
              <input
                type="checkbox"
                id="generateJoinCode"
                checked={generateJoinCode}
                onChange={(e) => setGenerateJoinCode(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
              />
              <label htmlFor="generateJoinCode" className="text-sm text-gray-300">
                Generate join code (players can join via link)
              </label>
            </div>

            {/* Select Players */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Add Players (Optional)
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2 p-4 rounded-lg bg-[#1a1f26] border border-[#2d3748]">
                {allUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading players...</p>
                ) : (
                  allUsers.map((usr) => (
                    <div
                      key={usr.id}
                      onClick={() => togglePlayer(usr.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        selectedPlayers.includes(usr.id)
                          ? 'bg-green-900/30 border border-green-500/50'
                          : 'bg-[#0f1419] border border-[#2d3748] hover:border-[#3d4c5f]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {usr.displayName}
                          {usr.id === profile.id && (
                            <span className="ml-2 text-xs text-green-400">(You)</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">@{usr.username}</div>
                      </div>
                      {selectedPlayers.includes(usr.id) && (
                        <div className="text-green-400">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Selected: {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Submit */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/games')}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
