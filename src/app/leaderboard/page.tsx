'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

type LeaderboardEntry = {
  id: string
  displayName: string
  username: string
  totalWinnings: number
  gamesPlayed: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('totalWinnings', { ascending: false })
        .limit(50)

      if (error) throw error

      setLeaderboard(data as LeaderboardEntry[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="luxury-card overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 py-6 border-b border-[#2d3748]">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Top players by total winnings
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading leaderboard...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400 mb-2">Error loading leaderboard</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🎲</div>
              <p className="text-gray-400 mb-2">No players on the leaderboard yet</p>
              <p className="text-sm text-gray-500">
                Play some games to get started!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile View */}
              <div className="block sm:hidden">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`px-4 py-4 border-b border-[#2d3748] last:border-b-0 ${
                      index < 3 ? 'bg-gradient-to-r from-green-900/20 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (
                            <span className="text-gray-500 font-mono">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {entry.displayName}
                          </div>
                          <div className="text-xs text-gray-500">
                            @{entry.username}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          entry.totalWinnings > 0
                            ? 'text-green-400'
                            : entry.totalWinnings < 0
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        ${entry.totalWinnings.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{entry.gamesPlayed} games</span>
                      <span>
                        ${entry.gamesPlayed > 0
                          ? (entry.totalWinnings / entry.gamesPlayed).toFixed(2)
                          : '0.00'}{' '}
                        avg
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <table className="hidden sm:table min-w-full">
                <thead className="bg-[#1a1f26]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Winnings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Games
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Avg/Game
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-[#2d3748] hover:bg-[#1a1f26]/50 transition-colors ${
                        index < 3 ? 'bg-gradient-to-r from-green-900/20 to-transparent' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-2xl">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (
                            <span className="text-gray-500 font-mono text-sm">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-white">
                          {entry.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{entry.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-lg font-bold ${
                            entry.totalWinnings > 0
                              ? 'text-green-400'
                              : entry.totalWinnings < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }`}
                        >
                          ${entry.totalWinnings.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {entry.gamesPlayed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        ${entry.gamesPlayed > 0
                          ? (entry.totalWinnings / entry.gamesPlayed).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
