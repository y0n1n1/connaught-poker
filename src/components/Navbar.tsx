'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                Connaught Poker
              </span>
            </Link>

            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/leaderboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/leaderboard')}`}
                >
                  Leaderboard
                </Link>
                <Link
                  href="/games"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/games')}`}
                >
                  Games
                </Link>
                {profile?.isAdmin && (
                  <Link
                    href="/admin"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/admin')}`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {profile?.displayName || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/leaderboard')}`}
            >
              Leaderboard
            </Link>
            <Link
              href="/games"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/games')}`}
            >
              Games
            </Link>
            {profile?.isAdmin && (
              <Link
                href="/admin"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/admin')}`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
