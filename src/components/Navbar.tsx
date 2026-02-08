'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/games', label: 'Games', icon: '🎮' },
  ]

  if (profile?.isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin', icon: '⚙️' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1f26] border-b border-[#2d3748] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">♠️</div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Connaught Poker
            </span>
          </Link>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? 'bg-green-900/30 text-green-400'
                        : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="mr-1.5">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/profile"
                  className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-all"
                >
                  {profile?.displayName}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 transition-all"
                >
                  Sign out
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-900/30 transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2d3748] bg-[#1a1f26]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-green-900/30 text-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                }`}
              >
                <span className="mr-2 text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-all"
            >
              <span className="mr-2 text-xl">👤</span>
              {profile?.displayName}
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                signOut()
              }}
              className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 transition-all"
            >
              <span className="mr-2 text-xl">🚪</span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
