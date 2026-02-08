# Connaught Poker - Project Overview

## Vision
A simple web app to track poker games among friends in our dorm. Designed for ~20 active users with features like leaderboards, winnings tracking, and game host management tools.

## Core Principles
- Fun and social first
- Simple data model (small scale, casual use)
- Public leaderboards with user-controlled privacy settings
- Easy game hosting and buyin tracking

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes (REST)
- **Language**: TypeScript
- **Deployment**: Railway (or Vercel for simplicity)

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Hosting**: Supabase

## Key Features

### User Features
- Username/password authentication
- Customizable public profiles with privacy toggles
- Personal stats dashboard (cumulative winnings, game history)
- Self-entry of buyin/result data

### Game Host Features
- Create games with easy player selection (list-based)
- Generate shareable join links
- Track buyin payment status (who paid, who owes)
- Enter results for any player

### Admin Features (You)
- Password reset capability for any user
- Full system access

### Public Features
- Leaderboard (all-time winnings)
- Game history with respecting privacy settings
- Player profiles (respecting privacy settings)

## Non-Goals
- Mobile app (web-responsive is sufficient)
- Real-time game tracking
- Complex analytics or charts (keep it simple)
- Integration with payment apps

## Deployment Strategy
1. **Database**: Supabase PostgreSQL instance
2. **Backend + Frontend**: Unified on Vercel (Next.js handles both API routes and frontend)
3. **Simplicity**: Everything on Vercel except the database on Supabase

## Development Approach
1. Phase 1: Database schema + migrations (Prisma)
2. Phase 2: Backend API (REST endpoints)
3. Phase 3: Frontend (Next.js + shadcn/ui)
4. Phase 4: Deploy + test with real users
