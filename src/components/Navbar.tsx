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
    { href: '/', label: 'Home' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/games', label: 'Games' },
  ]

  if (profile?.isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin' })
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[#3d2f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl">♠</div>
            <div>
              <h1 className="text-xl font-bold font-serif heading-gold">
                Connaught
              </h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Poker Club</p>
            </div>
          </Link>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30'
                        : 'text-gray-300 hover:text-[#d4af37] hover:bg-[#1a1512]/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="ml-4 h-6 w-px bg-[#3d2f1f]"></div>
                <Link
                  href="/profile"
                  className="ml-4 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-[#d4af37] hover:bg-[#1a1512]/50 transition-all"
                >
                  {profile?.displayName}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-[#1a1512]/50 transition-all"
                >
                  Sign Out
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-[#1a1512]/50 transition-all"
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
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-[#d4af37] hover:bg-[#1a1512]/50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3d2f1f] glass">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30'
                    : 'text-gray-300 hover:text-[#d4af37] hover:bg-[#1a1512]/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[#3d2f1f] my-2"></div>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-[#d4af37] hover:bg-[#1a1512]/50 transition-all"
            >
              {profile?.displayName}
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                signOut()
              }}
              className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-red-400 hover:bg-[#1a1512]/50 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
