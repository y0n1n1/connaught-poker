import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will be auto-generated later if needed
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          passwordHash: string
          displayName: string
          createdAt: string
          updatedAt: string
          isAdmin: boolean
          showTotalWinnings: boolean
          showGameHistory: boolean
          showIndividualResults: boolean
        }
        Insert: {
          id: string
          username: string
          passwordHash: string
          displayName: string
          createdAt?: string
          updatedAt: string
          isAdmin?: boolean
          showTotalWinnings?: boolean
          showGameHistory?: boolean
          showIndividualResults?: boolean
        }
        Update: {
          id?: string
          username?: string
          passwordHash?: string
          displayName?: string
          createdAt?: string
          updatedAt?: string
          isAdmin?: boolean
          showTotalWinnings?: boolean
          showGameHistory?: boolean
          showIndividualResults?: boolean
        }
      }
      games: {
        Row: {
          id: string
          createdAt: string
          gameDate: string
          hostId: string
          status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          joinCode: string | null
          notes: string | null
        }
        Insert: {
          id: string
          createdAt?: string
          gameDate: string
          hostId: string
          status?: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          joinCode?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          createdAt?: string
          gameDate?: string
          hostId?: string
          status?: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          joinCode?: string | null
          notes?: string | null
        }
      }
      buyins: {
        Row: {
          id: string
          gameId: string
          userId: string
          amount: number
          paidStatus: 'UNPAID' | 'PAID' | 'PENDING'
          timestamp: string
          enteredBy: string
        }
        Insert: {
          id: string
          gameId: string
          userId: string
          amount: number
          paidStatus?: 'UNPAID' | 'PAID' | 'PENDING'
          timestamp?: string
          enteredBy: string
        }
        Update: {
          id?: string
          gameId?: string
          userId?: string
          amount?: number
          paidStatus?: 'UNPAID' | 'PAID' | 'PENDING'
          timestamp?: string
          enteredBy?: string
        }
      }
      game_results: {
        Row: {
          id: string
          gameId: string
          userId: string
          finalAmount: number
          netWinnings: number
          timestamp: string
          enteredBy: string
        }
        Insert: {
          id: string
          gameId: string
          userId: string
          finalAmount: number
          netWinnings: number
          timestamp?: string
          enteredBy: string
        }
        Update: {
          id?: string
          gameId?: string
          userId?: string
          finalAmount?: number
          netWinnings?: number
          timestamp?: string
          enteredBy?: string
        }
      }
    }
  }
}
