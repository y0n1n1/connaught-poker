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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Top players by total winnings
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading leaderboard...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error loading leaderboard: {error}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No players on the leaderboard yet. Play some games to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Winnings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Games Played
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg per Game
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `${index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{entry.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          entry.totalWinnings > 0 ? 'text-green-600' :
                          entry.totalWinnings < 0 ? 'text-red-600' :
                          'text-gray-900'
                        }`}>
                          ${entry.totalWinnings.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.gamesPlayed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${entry.gamesPlayed > 0
                          ? (entry.totalWinnings / entry.gamesPlayed).toFixed(2)
                          : '0.00'
                        }
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
