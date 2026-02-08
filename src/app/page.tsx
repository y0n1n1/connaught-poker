'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="poker-card p-6 sm:p-8 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-3xl">👋</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {profile.displayName}!
            </h1>
          </div>
          <p className="text-gray-400">
            Track your poker games and see how you stack up.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link href="/games/new" className="poker-card p-6 text-center group">
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
              🃏
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Create Game
            </h3>
            <p className="text-sm text-gray-400">
              Host a new poker game
            </p>
          </Link>

          <Link href="/leaderboard" className="poker-card p-6 text-center group">
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
              🏆
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Leaderboard
            </h3>
            <p className="text-sm text-gray-400">
              See who's winning
            </p>
          </Link>

          <Link href="/games" className="poker-card p-6 text-center group">
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
              🎮
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              View Games
            </h3>
            <p className="text-sm text-gray-400">
              Browse all games
            </p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="poker-card p-6 sm:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="text-2xl">📊</div>
            <h2 className="text-xl font-bold text-white">Your Stats</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="stat-value relative z-10">$0.00</div>
              <div className="text-sm text-gray-400 mt-2 relative z-10">
                Total Winnings
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value relative z-10">0</div>
              <div className="text-sm text-gray-400 mt-2 relative z-10">
                Games Played
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value relative z-10">$0.00</div>
              <div className="text-sm text-gray-400 mt-2 relative z-10">
                Avg per Game
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🎲 Play some games to see your stats!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
