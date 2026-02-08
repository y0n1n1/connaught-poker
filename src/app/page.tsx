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
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile.displayName}!
          </h1>
          <p className="mt-1 text-gray-600">
            Track your poker games and see how you stack up against your friends.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link
            href="/games/new"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-blue-600 text-3xl mb-2">+</div>
            <h3 className="text-lg font-semibold text-gray-900">Create Game</h3>
            <p className="text-sm text-gray-600 mt-1">
              Host a new poker game
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-yellow-600 text-3xl mb-2">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
            <p className="text-sm text-gray-600 mt-1">
              See who's winning
            </p>
          </Link>

          <Link
            href="/games"
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-green-600 text-3xl mb-2">🎮</div>
            <h3 className="text-lg font-semibold text-gray-900">View Games</h3>
            <p className="text-sm text-gray-600 mt-1">
              Browse all games
            </p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <div className="text-sm text-gray-600">Total Winnings</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <div className="text-sm text-gray-600">Avg per Game</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Play some games to see your stats!
          </p>
        </div>
      </main>
    </div>
  )
}
